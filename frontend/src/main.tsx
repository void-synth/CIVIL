/**
 * CIVIL Frontend Entry Point
 * 
 * Minimal React setup - no routing, no state management yet.
 * Just the core truth record creation flow.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
