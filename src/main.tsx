import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { WalletUIProvider } from "@algoscan/use-wallet-ui"
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <WalletUIProvider providers={['kmd', 'algosigner']}>
      <App />
    </WalletUIProvider>
  </React.StrictMode>
)
