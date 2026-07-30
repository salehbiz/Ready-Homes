import React from 'react';
import { createRoot } from 'react-dom/client';
import { Hero } from './sections/Hero';
import './index.css';

const rootElement = document.getElementById('react-hero-root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Hero />
    </React.StrictMode>
  );
} else {
  console.error("React root element (#react-hero-root) not found in the DOM.");
}

