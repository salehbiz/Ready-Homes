import React, { useRef } from 'react';
import FrameScrub from '../components/FrameScrub';

export const Transformation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={containerRef} id="transformation" className="w-full bg-[#141316] relative select-none">
      <FrameScrub
        frameCount={120}
        framePath={(i) => `/frames/transformation/${String(i).padStart(4, '0')}.webp`}
        poster="/frames/transformation-poster.webp"
        scrollLengthVh={300}
        className="w-full"
      />
    </section>
  );
};
