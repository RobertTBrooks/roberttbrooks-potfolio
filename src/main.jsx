import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AolChat from './modules/AolChat.jsx'
import DeskTop from './DeskTop.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DeskTop />
  </StrictMode>,
)
