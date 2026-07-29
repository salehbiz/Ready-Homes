export type FrameTier = {
  dir: 'desktop-hq' | 'desktop' | 'mobile';
  ext: 'webp' | 'avif';
};

export function getFrameTier(): FrameTier {
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
  const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
  const conn = typeof navigator !== 'undefined' ? (navigator as any).connection : null;
  const slowConn =
    conn?.effectiveType === 'slow-2g' ||
    conn?.effectiveType === '2g' ||
    conn?.effectiveType === '3g' ||
    (conn?.downlink !== undefined && conn.downlink < 3);

  if (isMobile) return { dir: 'mobile', ext: 'avif' };

  if (dpr >= 1.25 && !slowConn) {
    return { dir: 'desktop-hq', ext: 'avif' };
  }
  return { dir: 'desktop', ext: 'webp' };
}
