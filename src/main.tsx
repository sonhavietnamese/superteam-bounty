import ReactDOM from 'react-dom/client'
import './index.css'
import Landing from './pages/Landing'
import React, { FC, ReactNode, useMemo } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { Coin98WalletAdapter, PhantomWalletAdapter, UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets'
import { WalletModalProvider, WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { clusterApiUrl } from '@solana/web3.js'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import '@solana/wallet-adapter-react-ui/styles.css'
import Profile from './pages/Profile'
import ProfileV2 from './pages/ProfileV2'

export const WalletConnectable = ({ children }: { children: ReactNode }) => {
  const network = WalletAdapterNetwork.Devnet

  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  const wallets = useMemo(() => [new PhantomWalletAdapter(), new Coin98WalletAdapter()], [network])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {/* <WalletMultiButton /> */}
          {/* <WalletDisconnectButton /> */}
          {/* <RouterProvider router={router} /> */}
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/:username',
    element: <ProfileV2 />,
  },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <WalletConnectable>
    <RouterProvider router={router} />
  </WalletConnectable>,
)
