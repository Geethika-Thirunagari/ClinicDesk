import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Recharts React 18 StrictMode ResizeObserver visual wrapper bug fix
// This suppresses the specific terminal warning so the dev server runs incredibly smoothly:
const ogWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('The width(-1) and height(-1) of chart')) return;
  ogWarn(...args);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
