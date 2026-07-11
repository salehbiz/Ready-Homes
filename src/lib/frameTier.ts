export type FrameTier = {
  dir: 'desktop-hq' | 'desktop' | 'mobile';
  ext: 'webp' | 'avif';
};

export function getFrameTier(): FrameTier {
  const w = window.innerWidth;
  const dpr = window.devicePixelRatio || 1;
  const conn = (navigator as any).connection;
  const slowConn =
    conn?.effectiveType === '3g' || (conn?.downlink && conn.downlink < 3);

  if (w < 768) return { dir: 'mobile', ext: 'avif' };

  if (dpr >= 1.25 && !slowConn) {
    return { dir: 'desktop-hq', ext: 'webp' };
  }
  return { dir: 'desktop', ext: 'webp' };
}
