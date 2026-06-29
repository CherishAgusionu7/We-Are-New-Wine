import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import faviconPng from './assets/images/new_wine_nw_monogram_logo_1780030388799.png';

const faviconLink = document.querySelector("link[rel='icon']") ?? document.createElement('link');
faviconLink.setAttribute('rel', 'icon');
faviconLink.setAttribute('type', 'image/png');
faviconLink.setAttribute('href', faviconPng);
if (!faviconLink.parentNode) {
  document.head.appendChild(faviconLink);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
