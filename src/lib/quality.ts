/**
 * Antigravity Crisp Quality Script
 * Lightweight Spring physics for custom components
 */

class Spring {
  tension: number;
  friction: number;
  x: number;
  v: number;

  constructor(tension = 120, friction = 14) {
    this.tension = tension;
    this.friction = friction;
    this.x = 0;
    this.v = 0;
  }

  update(target: number, dt = 0.016) {
    const a = (target - this.x) * this.tension - this.v * this.friction;
    this.v += a * dt;
    this.x += this.v * dt;
    return this.x;
  }
}

export function initCrispQualityEffects() {
  // Prevent run on mobile/prefers-reduced-motion
  if (
    typeof window === 'undefined' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    window.innerWidth < 768
  ) {
    return;
  }

  // --- Spring Mouse Follower (Gives a fluid, high-end cursor feel) ---
  const follower = document.createElement('div');
  follower.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 16px;
    height: 16px;
    background: rgba(255, 255, 255, 0.2);
    border: 1.5px solid rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    pointer-events: none;
    z-index: 99999;
    will-change: transform;
    transform: translate3d(-50%, -50%, 0);
    mix-blend-mode: difference;
    transition: width 0.3s, height 0.3s, background 0.3s;
  `;
  document.body.appendChild(follower);

  const springX = new Spring(180, 18);
  const springY = new Spring(180, 18);
  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Grow follower on hover of interactive elements
  window.addEventListener('mouseover', (e) => {
    const target = e.target as HTMLElement;
    if (target && (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button') || target.classList.contains('cursor-pointer'))) {
      follower.style.width = '32px';
      follower.style.height = '32px';
      follower.style.background = 'rgba(255, 255, 255, 0.3)';
    }
  });

  window.addEventListener('mouseout', (e) => {
    const target = e.target as HTMLElement;
    if (target && (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button') || target.classList.contains('cursor-pointer'))) {
      follower.style.width = '16px';
      follower.style.height = '16px';
      follower.style.background = 'rgba(255, 255, 255, 0.2)';
    }
  });

  function tick() {
    const currentX = springX.update(mouse.x);
    const currentY = springY.update(mouse.y);
    follower.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  }
  tick();
}
