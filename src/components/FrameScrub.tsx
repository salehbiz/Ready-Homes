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
  containOnMobile?: boolean;                 // if true, use contain mode on mobile to avoid cropping landscape frames
};

const LERP = 0.25;        // Snappy interpolation
const CONCURRENCY = 16;   // Max parallel loads — images are tiny now

export default function FrameScrub({
  frameCount, framePath, poster, className, scrollLengthVh = 400, children, onProgress, eager = false, containOnMobile = false
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  
  // Use native Image objects for hardware-accelerated drawing and better browser caching
  const images = useRef<(HTMLImageElement | null)[]>(new Array(frameCount + 1).fill(null));
  
  const playhead = useRef(1);
  const target = useRef(1);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  const framePathRef = useRef(framePath);
  framePathRef.current = framePath;

  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  const lastWidth = useRef(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const lastHeight = useRef(typeof window !== 'undefined' ? window.innerHeight : 800);
  const lastOrientation = useRef(typeof window !== 'undefined' && window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');

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

  // Highly optimized HTTP/2 Image Preloader
  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    let loadedCount = 0;
    const requiredForReady = isMobile ? 4 : 6;

    // We generate an optimized loading order: spread out first, then fill in the gaps
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

    const pump = () => {
      if (cancelled) return;
      while (inFlight < CONCURRENCY && idx < order.length) {
        const frame = order[idx++];
        inFlight++;
        
        const img = new Image();
        img.src = framePathRef.current(frame);
        
        const onLoadFinish = () => {
            if (cancelled) return;
            inFlight--;
            images.current[frame] = img;
            loadedCount++;
            if (loadedCount === requiredForReady) {
                setReady(true);
            }
            pump();
        };

        img.onload = onLoadFinish;
        img.onerror = onLoadFinish;
        
        // Eagerly trigger decode if available to avoid main-thread jank during render
        if ('decode' in img) {
            img.decode().catch(() => {});
        }
      }
    };
    
    // Start immediately — images are tiny (~20-27KB each)
    pump();

    return () => { 
        cancelled = true; 
    };
  }, [visible, frameCount, isMobile]);

  // GSAP ScrollTrigger pin — this is the key: pin the section and
  // use ScrollTrigger progress to drive frame target
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const mm = gsap.matchMedia();

    // Desktop layout stays exactly as-is
    mm.add('(min-width: 768px)', () => {
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
    });

    // Mobile layout: no pinning, just scrub as the section scrolls through viewport
    mm.add('(max-width: 767px)', () => {
      const rect = track.getBoundingClientRect();
      const isAtTop = (rect.top + window.scrollY) < 100;
      
      ScrollTrigger.create({
        trigger: track,
        start: isAtTop ? 'top top' : 'top bottom',
        end: 'bottom top',
        scrub: 0,
        onUpdate: (self) => {
          const progress = self.progress;
          target.current = 1 + progress * (frameCount - 1);
          if (onProgressRef.current) {
            onProgressRef.current(progress, Math.round(target.current));
          }
        },
      });
    });

    const timer = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => { 
      clearTimeout(timer); 
      mm.revert(); 
    };
  }, [frameCount, scrollLengthVh]);

  // Find nearest available frame
  const findNearestFrame = useCallback((frame: number): number | null => {
    if (images.current[frame]) return frame;
    for (let delta = 1; delta <= 12; delta++) {
      if (images.current[frame + delta]) return frame + delta;
      if (images.current[frame - delta]) return frame - delta;
    }
    return null;
  }, []);

  // Render loop — only draws
  useEffect(() => {
    if (!ready) return;
    let raf = 0, lastDrawn = -1;

    const draw = (frame: number) => {
      const canvas = canvasRef.current;
      const img = images.current[frame];
      if (!canvas || !img) return;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;
      const cr = canvas.width / canvas.height;
      
      // Use naturalWidth for native Image objects
      const ir = (img.naturalWidth || img.width) / (img.naturalHeight || img.height);
      
      let dw, dh, dx, dy;
      
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
          dx = (canvas.width - dw) / 2;
          dy = 0;
        } else {
          dw = canvas.width;
          dh = dw / ir;
          dx = 0;
          dy = (canvas.height - dh) / 2;
        }
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, dx, dy, dw, dh);
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
      raf = requestAnimationFrame(loop);
    };

    const resize = () => {
      const c = canvasRef.current;
      if (!c) return;
      const isMob = window.innerWidth < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, isMob ? 1.5 : 2);
      const r = c.getBoundingClientRect();
      c.width = r.width * dpr; c.height = r.height * dpr;
      lastDrawn = -1;
    };
    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [ready, findNearestFrame]);

  const reduced = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div 
      ref={trackRef} 
      className={`${className || ''} max-md:h-[100dvh] max-md:min-h-[100dvh] max-md:w-screen max-md:overflow-hidden max-md:relative`} 
      style={{ position: 'relative' }}
    >
      <div 
        ref={stickyRef} 
        style={{ 
          height: isMobile ? '100dvh' : '100vh', 
          overflow: 'hidden', 
          position: 'relative',
          width: isMobile ? '100vw' : 'auto'
        }}
      >
        {reduced
          ? <img src={poster} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <>
              <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              {!ready && <img src={poster} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
            </>}
        {/* Overlay children */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {children}
        </div>
      </div>
    </div>
  );
}
