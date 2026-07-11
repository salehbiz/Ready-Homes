import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap, ScrollTrigger } from '../lib/scroll';

type Props = {
  frameCount: number;
  framePath: (i: number) => string;        // 1-indexed
  poster: string;
  className?: string;
  scrollLengthVh?: number;                  // scroll track length, default 300
  children?: React.ReactNode;
  onProgress?: (progress: number, frame: number) => void;
  eager?: boolean;                           // if true, skip IO and start loading immediately
  tierResolved?: boolean;                    // true if resolution-tier is ready to load
  fallbackFramePath?: (i: number) => string; // fallback path if the main path fails (e.g. for HQ tier)
  pathKey?: string;                          // stable key representing the path/tier (to prevent inline function re-runs)
  containOnMobile?: boolean;                 // if true, use contain mode on mobile to avoid cropping landscape frames
  focalX?: number;
  focalY?: number;
  mobileFocalX?: number;
  mobileFocalY?: number;
  zoomOnMobile?: boolean;
};

const LERP = 0.18;        // Snappy interpolation
const CONCURRENCY = 6;    // Max parallel loads — restored to 6 as specced

export default function FrameScrub({
  frameCount, framePath, poster, className, scrollLengthVh = 400, children, onProgress, eager = false, tierResolved = true, fallbackFramePath, pathKey = '', containOnMobile = false, focalX = 0.5, focalY = 0.5, mobileFocalX, mobileFocalY, zoomOnMobile = false
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  
  // High-performance double-buffered caching engine
  const compressedBlobs = useRef<Map<number, Blob>>(new Map());
  const decodedBitmaps = useRef<Map<number, ImageBitmap>>(new Map());
  const fetchedOrInFlight = useRef<Set<number>>(new Set());
  const decodingFrames = useRef<Set<number>>(new Set());
  const pumpRef = useRef<(() => void) | undefined>(undefined);
  
  const playhead = useRef(1);
  const target = useRef(1);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isFallenBack, setIsFallenBack] = useState(false);
  const [firstFrameDrawn, setFirstFrameDrawn] = useState(false);
  const [grainDataUrl, setGrainDataUrl] = useState<string>('');
  const [inViewport, setInViewport] = useState(false);
  
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  // Store function props and focal properties in refs to completely decouple preloader lifecycle from identity changes
  const framePathRef = useRef(framePath);
  framePathRef.current = framePath;

  const fallbackFramePathRef = useRef(fallbackFramePath);
  fallbackFramePathRef.current = fallbackFramePath;

  const focalXRef = useRef(focalX);
  focalXRef.current = focalX;
  const focalYRef = useRef(focalY);
  focalYRef.current = focalY;
  const mobileFocalXRef = useRef(mobileFocalX);
  mobileFocalXRef.current = mobileFocalX;
  const mobileFocalYRef = useRef(mobileFocalY);
  mobileFocalYRef.current = mobileFocalY;

  const [supportsSvh] = useState(() => typeof CSS !== 'undefined' && CSS.supports && CSS.supports('height', '100svh'));

  // Reset fallback and transition state when the path key changes (stable tier change)
  useEffect(() => {
    setIsFallenBack(false);
    setFirstFrameDrawn(false);
  }, [pathKey]);

  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  const lastWidth = useRef(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const lastHeight = useRef(typeof window !== 'undefined' ? window.innerHeight : 800);
  const lastOrientation = useRef(typeof window !== 'undefined' && window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');

  const reduced = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const o = w > h ? 'landscape' : 'portrait';
      const widthDiff = Math.abs(w - lastWidth.current);
      const heightDiff = Math.abs(h - lastHeight.current);
      const orientationChanged = o !== lastOrientation.current;
      setIsMobile(w < 768);
      if (widthDiff > 10 || heightDiff > 150 || orientationChanged) {
        lastWidth.current = w;
        lastHeight.current = h;
        lastOrientation.current = o;
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate 128x128 monochrome low-alpha noise texture once on mount for desktop viewports
  useEffect(() => {
    if (isMobile) return;
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imgData = ctx.createImageData(128, 128);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const val = Math.floor(Math.random() * 255);
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
      data[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
    setGrainDataUrl(canvas.toDataURL());
  }, [isMobile]);

  // Continuous viewport check to toggle animation play state and optimize performance
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInViewport(entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  // IntersectionObserver — start loading when near viewport (or immediately if eager)
  useEffect(() => {
    if (eager) {
      setVisible(true);
      return;
    }
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: eager ? '3000px 0px' : '800px 0px' } // Preload eager ones very early, lazy ones only when closer
    );
    observer.observe(track);
    return () => observer.disconnect();
  }, [eager]);

  // Clean up decoded ImageBitmaps and Blobs on unmount
  useEffect(() => {
    const bitmaps = decodedBitmaps.current;
    const blobs = compressedBlobs.current;
    const inflight = fetchedOrInFlight.current;
    const decoding = decodingFrames.current;
    return () => {
      bitmaps.forEach(bitmap => bitmap.close());
      bitmaps.clear();
      blobs.clear();
      inflight.clear();
      decoding.clear();
      pumpRef.current = undefined;
    };
  }, []);

  // Highly optimized HTTP/2 Image Preloader using Blob fetching
  useEffect(() => {
    if (!visible || !tierResolved || reduced) return;
    
    let cancelled = false;
    let loadedCount = 0;
    const requiredForReady = 24; // Ready threshold set to 24 frames

    // Reset caches on parameter/viewport/fallback updates
    compressedBlobs.current.clear();
    decodedBitmaps.current.forEach(bitmap => bitmap.close());
    decodedBitmaps.current.clear();
    fetchedOrInFlight.current.clear();
    decodingFrames.current.clear();
    setReady(false);

    // We generate an optimized loading order: spread out first, then fill in the gaps (Stride loading)
    const order: number[] = [];
    const step = isMobile ? 2 : 1;
    for (const stride of [8, 4, 2, 1]) {
      const s = stride * step;
      for (let i = 1; i <= frameCount; i += s) {
        if (!order.includes(i)) order.push(i);
      }
    }

    let idx = 0;
    let inFlight = 0;

    const findPriorityFrame = (center: number, maxDistance = 15): number | null => {
      for (let dist = 0; dist <= maxDistance; dist++) {
        const framePlus = center + dist;
        if (framePlus >= 1 && framePlus <= frameCount && !fetchedOrInFlight.current.has(framePlus)) {
          return framePlus;
        }
        if (dist > 0) {
          const frameMinus = center - dist;
          if (frameMinus >= 1 && frameMinus <= frameCount && !fetchedOrInFlight.current.has(frameMinus)) {
            return frameMinus;
          }
        }
      }
      return null;
    };

    const pump = () => {
      if (cancelled) return;
      while (inFlight < CONCURRENCY) {
        // 1. Try playhead-priority frame search first
        const center = Math.round(playhead.current);
        let frame = findPriorityFrame(center, 15);
        
        // 2. Fall back to base stride order queue
        if (frame === null) {
          while (idx < order.length) {
            const candidate = order[idx++];
            if (!fetchedOrInFlight.current.has(candidate)) {
              frame = candidate;
              break;
            }
          }
        }
        
        if (frame === null) {
          break;
        }
        
        fetchedOrInFlight.current.add(frame);
        inFlight++;
        
        const currentFrame = frame;
        const targetPath = (isFallenBack && fallbackFramePathRef.current) 
          ? fallbackFramePathRef.current(currentFrame) 
          : framePathRef.current(currentFrame);

        fetch(targetPath)
          .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.blob();
          })
          .then(blob => {
            if (cancelled) return;
            compressedBlobs.current.set(currentFrame, blob);
            loadedCount++;
            if (loadedCount === requiredForReady) {
              setReady(true);
            }
            inFlight--;
            pump();
          })
          .catch(() => {
            if (cancelled) return;
            if (!isFallenBack && fallbackFramePathRef.current) {
              setIsFallenBack(true);
              cancelled = true;
            } else {
              inFlight--;
              pump();
            }
          });
      }
    };
    
    pumpRef.current = pump;
    pump();

    return () => { 
      cancelled = true; 
      pumpRef.current = undefined;
    };
  }, [visible, frameCount, isMobile, tierResolved, reduced, isFallenBack]);

  // GSAP ScrollTrigger pin — unified for all viewports (desktop and mobile pin identically)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: track,
        start: 'top top',
        end: () => `+=${window.innerHeight * (scrollLengthVh / 100 - 1)}`,
        pin: true,
        anticipatePin: 1,
        scrub: 0, // Direct map, smooth via LERP
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          target.current = 1 + progress * (frameCount - 1);
          if (onProgressRef.current) {
            onProgressRef.current(progress, Math.round(target.current));
          }
        },
      });
    }, track);

    const timer = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => { 
      clearTimeout(timer); 
      ctx.revert(); 
    };
  }, [frameCount, scrollLengthVh]);

  // ScrollTrigger refresh after the first frame has successfully rendered
  useEffect(() => {
    if (firstFrameDrawn) {
      ScrollTrigger.refresh();
    }
  }, [firstFrameDrawn]);

  // Debounced ScrollTrigger refresh on orientation change or window resize
  useEffect(() => {
    let debounceTimer: number;
    const handleResizeOrOrientation = () => {
      clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
    };

    window.addEventListener('resize', handleResizeOrOrientation);
    window.addEventListener('orientationchange', handleResizeOrOrientation);

    return () => {
      clearTimeout(debounceTimer);
      window.removeEventListener('resize', handleResizeOrOrientation);
      window.removeEventListener('orientationchange', handleResizeOrOrientation);
    };
  }, []);

  // Find nearest available frame
  const findNearestFrame = useCallback((frame: number): number | null => {
    if (decodedBitmaps.current.has(frame)) return frame;
    for (let delta = 1; delta <= 10; delta++) {
      if (decodedBitmaps.current.has(frame + delta)) return frame + delta;
      if (decodedBitmaps.current.has(frame - delta)) return frame - delta;
    }
    return null;
  }, []);

  // Async frame decoder with sliding window cache eviction and decode budget
  const decodeFrames = useCallback(async (center: number) => {
    const DECODE_WINDOW = isMobile ? 15 : 30;
    const lo = Math.max(1, center - DECODE_WINDOW);
    const hi = Math.min(frameCount, center + DECODE_WINDOW);

    // 1. Evict frames outside the decode window first (reclaim memory first)
    for (const [key, bitmap] of decodedBitmaps.current) {
      if (key < lo || key > hi) {
        bitmap.close();
        decodedBitmaps.current.delete(key);
      }
    }

    // 2. Decode outward search order from center
    const decodeOrder: number[] = [];
    const maxDist = DECODE_WINDOW;
    for (let dist = 0; dist <= maxDist; dist++) {
      const p = center + dist;
      if (p >= lo && p <= hi) {
        decodeOrder.push(p);
      }
      if (dist > 0) {
        const m = center - dist;
        if (m >= lo && m <= hi) {
          decodeOrder.push(m);
        }
      }
    }

    // 3. Decode at most 4 bitmaps per invocation
    let decodedCount = 0;
    const BUDGET = 4;

    for (const i of decodeOrder) {
      if (decodedCount >= BUDGET) break;

      if (!decodedBitmaps.current.has(i) && !decodingFrames.current.has(i) && compressedBlobs.current.has(i)) {
        const blob = compressedBlobs.current.get(i);
        if (blob) {
          decodedCount++;
          decodingFrames.current.add(i);
          
          createImageBitmap(blob)
            .then(bmp => {
              decodingFrames.current.delete(i);
              // Verify bounds in case the playhead shifted during async decode
              const currentCenter = Math.round(playhead.current);
              const currentLo = Math.max(1, currentCenter - DECODE_WINDOW);
              const currentHi = Math.min(frameCount, currentCenter + DECODE_WINDOW);
              if (i >= currentLo && i <= currentHi) {
                decodedBitmaps.current.set(i, bmp);
              } else {
                bmp.close();
              }
            })
            .catch(() => {
              decodingFrames.current.delete(i);
            });
        }
      }
    }
  }, [frameCount, isMobile]);

  // Render loop — only draws
  useEffect(() => {
    if (!ready || !tierResolved) return;
    let raf = 0, lastDrawn = -1;

    const draw = (frame: number) => {
      const canvas = canvasRef.current;
      const bmp = decodedBitmaps.current.get(frame);
      if (!canvas || !bmp) return;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;
      const cr = canvas.width / canvas.height;
      
      const ir = bmp.width / bmp.height;
      
      let dw, dh, dx, dy;

      const isMob = window.innerWidth < 768;
      const fx = (isMob && mobileFocalXRef.current !== undefined) ? mobileFocalXRef.current : focalXRef.current;
      const fy = (isMob && mobileFocalYRef.current !== undefined) ? mobileFocalYRef.current : focalYRef.current;
      
      if (containOnMobile && isMobile) {
        // Contain logic: show whole image, letterbox remaining canvas space
        if (ir > cr) {
          dw = canvas.width;
          dh = dw / ir;
          dx = 0;
          dy = (canvas.height - dh) / 2;
        } else {
          dh = canvas.height;
          dw = dh * ir;
          dx = (canvas.width - dw) / 2;
          dy = 0;
        }
      } else {
        // Cover logic: fill canvas, crop overflowing edges
        if (ir > cr) {
          dh = canvas.height;
          dw = dh * ir;
          dx = (canvas.width - dw) * fx;
          dy = 0;
        } else {
          dw = canvas.width;
          dh = dw / ir;
          dx = 0;
          dy = (canvas.height - dh) * fy;
        }
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(bmp, dx, dy, dw, dh);

      setFirstFrameDrawn(true);
    };

    const loop = () => {
      // Very smooth LERP interpolation
      playhead.current += (target.current - playhead.current) * LERP;
      const idealFrame = Math.round(playhead.current);
      const frame = findNearestFrame(idealFrame);
      if (frame !== null && frame !== lastDrawn) {
        draw(frame);
        lastDrawn = frame;
      }
      decodeFrames(idealFrame);
      if (pumpRef.current) {
        pumpRef.current();
      }
      raf = requestAnimationFrame(loop);
    };

    const resize = () => {
      const c = canvasRef.current;
      if (!c) return;
      const isMob = window.innerWidth < 768;
      // Cap DPR at 1.5 on mobile to save GPU memory on 3x devices, and 2.0 on desktop
      const dpr = Math.min(window.devicePixelRatio || 1, isMob ? 1.5 : 2);
      const r = c.getBoundingClientRect();
      c.width = r.width * dpr; c.height = r.height * dpr;
      lastDrawn = -1;
    };
    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [ready, findNearestFrame, decodeFrames, tierResolved, isMobile, containOnMobile]);

  return (
    <div 
      ref={trackRef} 
      className={`${className || ''} max-md:w-screen max-md:relative`} 
      style={{ position: 'relative' }}
    >
      <div 
        ref={stickyRef} 
        style={{ 
          height: supportsSvh ? '100svh' : '100vh', 
          overflow: 'hidden', 
          position: 'relative',
          width: isMobile ? '100vw' : 'auto'
        }}
      >
        {reduced
          ? <img src={poster} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: (zoomOnMobile && isMobile) ? 'scale(1.1) translateZ(0)' : 'translateZ(0)', filter: 'contrast(1.04) saturate(1.06) brightness(1.01)' }} />
          : <>
              <canvas 
                ref={canvasRef} 
                style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  opacity: firstFrameDrawn ? 1 : 0,
                  transition: 'opacity 0.4s ease-out',
                  display: 'block',
                  transform: (zoomOnMobile && isMobile) ? 'scale(1.1) translateZ(0)' : 'translateZ(0)',
                  filter: 'contrast(1.04) saturate(1.06) brightness(1.01)'
                }} 
              />
              <img 
                src={poster} 
                alt="" 
                style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  opacity: firstFrameDrawn ? 0 : 1,
                  transition: 'opacity 0.4s ease-out',
                  pointerEvents: 'none',
                  display: 'block',
                  transform: (zoomOnMobile && isMobile) ? 'scale(1.1) translateZ(0)' : 'translateZ(0)',
                  filter: 'contrast(1.04) saturate(1.06) brightness(1.01)'
                }} 
              />
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes grainShift {
                  0%, 100% { background-position: 0px 0px; }
                  12.5% { background-position: -20px 10px; }
                  25% { background-position: 40px -30px; }
                  37.5% { background-position: -10px -10px; }
                  50% { background-position: 30px 20px; }
                  62.5% { background-position: -30px 40px; }
                  75% { background-position: 10px -20px; }
                  87.5% { background-position: 20px -10px; }
                }
              `}} />
              {grainDataUrl && !isMobile && (
                <div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${grainDataUrl})`,
                    backgroundRepeat: 'repeat',
                    opacity: 0.035,
                    mixBlendMode: 'overlay',
                    pointerEvents: 'none',
                    zIndex: 5,
                    animation: 'grainShift 0.66s steps(8) infinite',
                    animationPlayState: inViewport && !reduced ? 'running' : 'paused'
                  }}
                />
              )}
            </>}
        {/* Overlay children */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {children}
        </div>
      </div>
    </div>
  );
}
