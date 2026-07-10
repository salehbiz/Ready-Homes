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
};

const CONCURRENCY = 6;
const LERP = 0.25;        // Snappy spring-like interpolation
const DECODE_INTERVAL = 60; // ms between decode batches

export default function FrameScrub({
  frameCount, framePath, poster, className, scrollLengthVh = 400, children, onProgress
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const blobs = useRef(new Map<number, Blob>());
  const bitmaps = useRef(new Map<number, ImageBitmap>());
  const playhead = useRef(1);
  const target = useRef(1);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const decodeCenter = useRef(1);
  const isDecoding = useRef(false);
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  // Stabilize framePath in a ref
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

  const windowSize = useRef(isMobile ? 15 : 35);

  // IntersectionObserver — start loading when near viewport
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px 0px' }
    );
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  // Stride loader
  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    const order: number[] = [];
    const step = isMobile ? 2 : 1;
    for (const stride of [8, 4, 2, 1]) {
      const s = stride * step;
      for (let i = 1; i <= frameCount; i += s) {
        if (!order.includes(i)) order.push(i);
      }
    }
    let idx = 0, inFlight = 0, loadedEarly = 0;
    const earlyLimit = Math.min(isMobile ? 12 : 24, order.length);

    const pump = () => {
      while (inFlight < CONCURRENCY && idx < order.length && !cancelled) {
        const frame = order[idx++];
        inFlight++;
        fetch(framePathRef.current(frame))
          .then(r => r.blob())
          .then(async (b) => {
            if (cancelled) return;
            blobs.current.set(frame, b);
            if (loadedEarly < earlyLimit) {
              try {
                const bmp = await createImageBitmap(b);
                if (!cancelled) bitmaps.current.set(frame, bmp);
              } catch { /* skip */ }
            }
            if (++loadedEarly === earlyLimit) setReady(true);
          })
          .catch(() => {})
          .finally(() => { inFlight--; pump(); });
      }
    };
    pump();
    return () => { cancelled = true; };
  }, [visible, frameCount, isMobile]);

  // Decode loop
  const runDecode = useCallback(async () => {
    if (isDecoding.current) return;
    isDecoding.current = true;
    const WINDOW = windowSize.current;
    const center = decodeCenter.current;
    const lo = Math.max(1, center - WINDOW);
    const hi = Math.min(frameCount, center + WINDOW);

    for (const [k, bmp] of bitmaps.current) {
      if (k < lo || k > hi) { bmp.close(); bitmaps.current.delete(k); }
    }
    for (let i = center; i <= hi; i++) {
      if (!bitmaps.current.has(i) && blobs.current.has(i)) {
        try { bitmaps.current.set(i, await createImageBitmap(blobs.current.get(i)!)); }
        catch { /* skip */ }
      }
    }
    for (let i = center - 1; i >= lo; i--) {
      if (!bitmaps.current.has(i) && blobs.current.has(i)) {
        try { bitmaps.current.set(i, await createImageBitmap(blobs.current.get(i)!)); }
        catch { /* skip */ }
      }
    }
    isDecoding.current = false;
  }, [frameCount]);

  useEffect(() => {
    if (!ready) return;
    const timer = setInterval(runDecode, DECODE_INTERVAL);
    return () => clearInterval(timer);
  }, [ready, runDecode]);

  // GSAP ScrollTrigger pin — this is the key: pin the section and
  // use ScrollTrigger progress to drive frame target
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
        scrub: true,
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
    return () => { clearTimeout(timer); ctx.revert(); };
  }, [frameCount, scrollLengthVh]);

  // Find nearest available frame
  const findNearestFrame = useCallback((frame: number): number | null => {
    if (bitmaps.current.has(frame)) return frame;
    for (let delta = 1; delta <= 12; delta++) {
      if (bitmaps.current.has(frame + delta)) return frame + delta;
      if (bitmaps.current.has(frame - delta)) return frame - delta;
    }
    return null;
  }, []);

  // Render loop — only draws
  useEffect(() => {
    if (!ready) return;
    let raf = 0, lastDrawn = -1;

    const draw = (frame: number) => {
      const canvas = canvasRef.current;
      const bmp = bitmaps.current.get(frame);
      if (!canvas || !bmp) return;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;
      const cr = canvas.width / canvas.height;
      const ir = bmp.width / bmp.height;
      let dw, dh, dx, dy;
      if (ir > cr) { dh = canvas.height; dw = dh * ir; dx = (canvas.width - dw) / 2; dy = 0; }
      else { dw = canvas.width; dh = dw / ir; dx = 0; dy = (canvas.height - dh) / 2; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bmp, dx, dy, dw, dh);
    };

    const loop = () => {
      playhead.current += (target.current - playhead.current) * LERP;
      const idealFrame = Math.round(playhead.current);
      decodeCenter.current = idealFrame;
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
    <div ref={trackRef} className={className} style={{ position: 'relative' }}>
      <div ref={stickyRef} style={{ height: '100vh', overflow: 'hidden', position: 'relative' }}>
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
