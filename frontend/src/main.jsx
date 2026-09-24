import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import AdocaoContextProvider from './context/AdocaoContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AdocaoContextProvider>
        <App />
      </AdocaoContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
