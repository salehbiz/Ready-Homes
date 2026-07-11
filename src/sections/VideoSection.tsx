import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export const VideoSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  // Use IntersectionObserver to start loading video well before it's visible
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '1500px 0px' } // Start loading 1500px before visible
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Once shouldLoad is true, set the video src and begin loading
  useEffect(() => {
    if (!shouldLoad || !videoRef.current) return;
    const video = videoRef.current;

    video.preload = 'auto';
    video.src = '/videos/house_tour.mp4';
    video.load();

    const handleCanPlay = () => {
      setIsLoaded(true);
      video.muted = true;
      video.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    };

    video.addEventListener('canplaythrough', handleCanPlay);
    // Also handle canplay as a fallback for faster start
    video.addEventListener('canplay', handleCanPlay);
    
    return () => {
      video.removeEventListener('canplaythrough', handleCanPlay);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [shouldLoad]);

  const handlePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(err => console.log("Video play interrupted:", err));
      }
    }
  }, [isPlaying]);

  const handleMuteToggle = useCallback(() => {
    if (videoRef.current) {
      const nextMute = !isMuted;
      videoRef.current.muted = nextMute;
      setIsMuted(nextMute);
    }
  }, [isMuted]);

  return (
    <section ref={sectionRef} className="w-full bg-[#f8f8fa] py-16 md:py-24 select-none">
      <div className="w-full px-6 md:px-12 lg:px-16 select-none flex flex-col items-center gap-8 md:gap-12">
        
        {/* Centered Heading */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 hero-text-font uppercase text-center">
          Walk Through 1159 Diamond
        </h2>

        {/* Video Card Container */}
        <div className="relative w-full aspect-video rounded-[36px] md:rounded-[48px] overflow-hidden shadow-lg border border-neutral-200 bg-neutral-900 group select-none">
          
          {/* Loading shimmer while video buffers */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800 animate-pulse" />
          )}

          {/* HTML5 Video Element — src set dynamically */}
          <video
            ref={videoRef}
            className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            loop
            muted
            playsInline
          />

          {/* Dark Overlay on Hover */}
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors duration-300 pointer-events-none" />

          {/* Custom Video Controls Bar */}
          <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 flex justify-between items-center z-10 pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex gap-4">
              {/* Play/Pause Button */}
              <button
                onClick={handlePlayPause}
                className="w-12 h-12 rounded-full bg-white/95 text-neutral-900 flex items-center justify-center shadow-md hover:scale-105 hover:bg-white transition-all cursor-pointer"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current translate-x-[1px]" />}
              </button>
              
              {/* Volume Mute/Unmute Button */}
              <button
                onClick={handleMuteToggle}
                className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 flex items-center justify-center shadow-md hover:scale-105 hover:bg-black/60 transition-all cursor-pointer"
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>

            <div className="px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-semibold text-white tracking-widest uppercase">
              House Tour Presentation
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
