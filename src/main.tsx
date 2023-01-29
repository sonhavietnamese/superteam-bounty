import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import '@solana/wallet-adapter-react-ui/styles.css'
import { Coin98WalletAdapter, PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { ReactNode, useMemo } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Landing from './pages/Landing'
import ProfileV2 from './pages/ProfileV2'

export const WalletConnectable = ({ children }: { children: ReactNode }) => {
  // const network = WalletAdapterNetwork.Devnet
  const network = 'https://solana-devnet.g.alchemy.com/v2/OEh2s7PqedaI668F-700S1YmTBhQWprZ'

  const endpoint = useMemo(() => 'https://solana-devnet.g.alchemy.com/v2/OEh2s7PqedaI668F-700S1YmTBhQWprZ', [network])

  const wallets = useMemo(() => [new PhantomWalletAdapter(), new Coin98WalletAdapter()], [network])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
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
