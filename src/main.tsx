import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// CSS (touch-action, overscroll-behavior) covers most browsers; iOS Safari
// still needs these to block pinch zoom and the long-press menu.
const block = (event: Event) => event.preventDefault()
document.addEventListener('gesturestart', block)
document.addEventListener('contextmenu', block)
document.addEventListener(
  'touchmove',
  (event) => {
    if (event.touches.length > 1) event.preventDefault()
  },
  { passive: false },
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
