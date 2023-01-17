import { Tooltip as ReactTooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import styled from 'styled-components'
import { truncateAddress } from '../utils'

const Text = styled.a`
  color: #000000;
  opacity: 0.7;
  cursor: pointer;
  text-decoration: none;
  transition: opacity 0.25s ease;

  :hover {
    opacity: 1;
  }
`

const SolanaWalletHandler = ({ walletAddress }: { walletAddress: string }) => {
  const copyWalletAddress = async () => {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(walletAddress)
    } else {
      return document.execCommand('copy', true, walletAddress)
    }
  }

  return (
    <>
      <Text onClick={copyWalletAddress} id='wallet-handler'>
        {truncateAddress(walletAddress)}
      </Text>
      <ReactTooltip anchorId='wallet-handler' place='top' content='Copy' />
    </>
  )
}

const TelegramHandler = ({ handler }: { handler: string }) => {
  return (
    <Text target='_blank' href={`https://t.me/${handler}`}>
      Telegram
    </Text>
  )
}

const TwitterHandler = ({ handler }: { handler: string }) => {
  return (
    <Text target='_blank' href={`https://twitter.com/${handler}`}>
      Twitter
    </Text>
  )
}

const DiscordHandler = ({ handler }: { handler: string }) => {
  const copyDiscordHandler = async () => {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(handler)
    } else {
      return document.execCommand('copy', true, handler)
    }
  }

  return (
    <>
      <Text onClick={copyDiscordHandler} id='discord-handler'>
        Discord
      </Text>
      <ReactTooltip anchorId='discord-handler' place='top' content='Copy' />
    </>
  )
}

export { TelegramHandler, TwitterHandler, DiscordHandler, SolanaWalletHandler }
