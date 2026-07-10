import React, { useRef, useState, useCallback } from 'react';
import FrameScrub from '../components/FrameScrub';

const rooms = [
  { name: 'Living Room', num: '01', desc: 'Soaring ceilings, designer fireplace, and floor-to-ceiling glass that floods the space with golden California light.' },
  { name: 'Kitchen', num: '02', desc: 'Custom cabinetry, waterfall stone island, and professional-grade appliances built for the home chef.' },
  { name: 'Stairs', num: '03', desc: 'A sculptural floating staircase that connects levels with effortless architectural elegance.' },
  { name: 'Master Bedroom', num: '04', desc: 'A private retreat with panoramic garden views, blackout motorized shades, and a walk-in closet the size of a room.' },
  { name: 'Master Bathroom', num: '05', desc: 'Spa-grade freestanding soaking tub, dual rain showers, and hand-laid Italian porcelain throughout.' },
  { name: 'Spa', num: '06', desc: 'Your personal wellness sanctuary \u2014 infrared sauna, steam room, and heated stone relaxation lounge.' },
  { name: 'Pool', num: '07', desc: 'Infinity-edge heated pool with LED lighting, surrounded by mature tropical landscaping and a built-in bar.' },
  { name: 'Cinema Room', num: '08', desc: 'Dolby Atmos surround, 4K laser projection, tiered seating \u2014 a private theater that rivals the real thing.' },
];

const getRoom = (frame: number) => {
  if (frame <= 15) return rooms[0];
  if (frame <= 30) return rooms[1];
  if (frame <= 45) return rooms[2];
  if (frame <= 60) return rooms[3];
  if (frame <= 75) return rooms[4];
  if (frame <= 90) return rooms[5];
  if (frame <= 105) return rooms[6];
  return rooms[7];
};

export const HorizontalScrubSection: React.FC = () => {
  const [currentRoom, setCurrentRoom] = useState(rooms[0]);
  const [progress, setProgress] = useState(0);
  const prevRoomRef = useRef(rooms[0].num);

  const handleProgress = useCallback((prog: number, frame: number) => {
    setProgress(prog);
    const room = getRoom(frame);
    if (room.num !== prevRoomRef.current) {
      prevRoomRef.current = room.num;
      setCurrentRoom(room);
    }
  }, []);

  return (
    <section id="horizontal-scrub" className="w-full bg-[#141316] relative select-none">
      <FrameScrub
        frameCount={120}
        framePath={(i) => `/frames/section3/${String(i).padStart(4, '0')}.webp`}
        poster="/frames/section3-poster.webp"
        scrollLengthVh={500}
        className="w-full"
        onProgress={handleProgress}
      >
        {/* Dark gradient overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

        {/* Progress bar at the very top */}
        <div className="absolute top-0 left-0 w-full h-[3px] z-50 bg-white/10">
          <div
            className="h-full bg-white origin-left"
            style={{ transform: `scaleX(${progress})`, transition: 'none' }}
          />
        </div>

        {/* Room info overlay — bottom-left */}
        <div className="absolute bottom-12 left-8 md:bottom-16 md:left-16 z-30 flex flex-col gap-2 max-w-md pointer-events-none">
          <span className="text-[9px] md:text-[10px] font-bold tracking-widest text-white/50 uppercase">
            Exploring Area
          </span>
          <h3
            key={currentRoom.name}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] animate-slide-up"
          >
            {currentRoom.name}
          </h3>
          <p className="text-xs md:text-sm text-white/50 font-medium leading-relaxed max-w-xs mt-1">
            {currentRoom.desc}
          </p>
        </div>

        {/* Room counter badge — bottom-right */}
        <div className="absolute bottom-12 right-8 md:bottom-16 md:right-16 z-30 pointer-events-none">
          <div className="flex items-center gap-4 md:gap-5 px-5 py-3.5 md:px-6 md:py-4 rounded-[20px] bg-black/50 backdrop-blur-lg border border-white/10 shadow-2xl transition-all duration-300">
            <div className="flex flex-col items-center justify-center min-w-[28px]">
              <span
                key={currentRoom.num}
                className="text-xl md:text-2xl font-bold text-white font-mono leading-none animate-slide-up"
              >
                {currentRoom.num}
              </span>
              <span className="text-[9px] font-semibold text-neutral-500 font-mono mt-1 uppercase">
                / {String(rooms.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Scroll hint — bottom center, fades out as you scroll */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 text-white/40 pointer-events-none"
          style={{ opacity: Math.max(0, 1 - progress * 8) }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
          <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase">Scroll to explore</span>
        </div>
      </FrameScrub>
    </section>
  );
};
