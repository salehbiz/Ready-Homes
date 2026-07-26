import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HorizontalScrubSection } from './sections/HorizontalScrubSection.tsx';

// Don't import index.css here since it's already imported in hero-mount.tsx 
// (or we can import it just in case, Vite handles duplicate CSS imports perfectly)
import './index.css';

const rootElement = document.getElementById('react-horizontal-scrub-root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <HorizontalScrubSection />
    </StrictMode>
  );
}
