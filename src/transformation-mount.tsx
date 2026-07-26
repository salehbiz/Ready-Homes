import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Transformation } from './sections/Transformation.tsx';

const rootElement = document.getElementById('react-transformation-root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <Transformation />
    </StrictMode>
  );
}
