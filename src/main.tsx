import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Router from './routes/Router'
import { WalletProvider } from './contexts/WalletContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WalletProvider>
      <Router />
    </WalletProvider>
  </StrictMode>,
)
