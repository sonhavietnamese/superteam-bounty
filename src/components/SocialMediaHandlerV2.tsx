import { Tooltip as ReactTooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import styled from 'styled-components'
import { truncateAddress } from '../utils'
import { ReactComponent as LinkArrow } from '../assets/link-arrow.svg'

const Text = styled.a`
  color: #000000;
  cursor: pointer;
  text-decoration: none;
  font-size: 20px;
  font-family: 'Circular-M';
  color: white;
`

const Container = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const SolanaWalletHandler = ({ walletAddress }: { walletAddress: string | undefined }) => {
  const copyWalletAddress = async () => {
    if ('clipboard' in navigator && walletAddress) {
      return await navigator.clipboard.writeText(walletAddress)
    } else {
      return document.execCommand('copy', true, walletAddress)
    }
  }

  return (
    <>
      {walletAddress ? (
        <>
          <Text onClick={copyWalletAddress} id='wallet-handler'>
            {truncateAddress(walletAddress)}
          </Text>
          <ReactTooltip anchorId='wallet-handler' place='top' content='Copy' />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

const TelegramHandler = ({ handler }: { handler: string | undefined }) => {
  return (
    <>
      {handler ? (
        <Container>
          <Text target='_blank' href={`https://t.me/${handler}`}>
            TELEGRAM
          </Text>
          <LinkArrow />
        </Container>
      ) : (
        <></>
      )}
    </>
  )
}

const TwitterHandler = ({ handler }: { handler: string | undefined }) => {
  return (
    <>
      {handler ? (
        <Container>
          <Text target='_blank' href={`https://twitter.com/${handler}`}>
            TWITTER
          </Text>
          <LinkArrow />
        </Container>
      ) : (
        <></>
      )}
    </>
  )
}

const GithubHandler = ({ handler }: { handler: string | undefined }) => {
  return (
    <>
      {handler ? (
        <Container>
          <Text target='_blank' href={`https://github.com/${handler}`}>
            GITHUB
          </Text>
          <LinkArrow />
        </Container>
      ) : (
        <></>
      )}
    </>
  )
}

const LinkedinHandler = ({ handler }: { handler: string | undefined }) => {
  return (
    <>
      {handler ? (
        <Container>
          <Text target='_blank' href={`https://linkedin.com/me/${handler}`}>
            LINKEDIN
          </Text>
          <LinkArrow />
        </Container>
      ) : (
        <></>
      )}
    </>
  )
}

const DiscordHandler = ({ handler }: { handler: string | undefined }) => {
  const copyDiscordHandler = async () => {
    if ('clipboard' in navigator && handler) {
      return await navigator.clipboard.writeText(handler)
    } else {
      return document.execCommand('copy', true, handler)
    }
  }

  return (
    <>
      {handler ? (
        <Container>
          <Text onClick={copyDiscordHandler} id='discord-handler'>
            DISCORD
          </Text>
          <LinkArrow />

          <ReactTooltip anchorId='discord-handler' place='top' content='Copy' />
        </Container>
      ) : (
        <></>
      )}
    </>
  )
}

export { TelegramHandler, TwitterHandler, DiscordHandler, SolanaWalletHandler, GithubHandler, LinkedinHandler }
