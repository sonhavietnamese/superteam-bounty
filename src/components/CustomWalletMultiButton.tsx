import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import styled from 'styled-components'

const Custom = styled(WalletMultiButton)`
  font-family: 'CD-M';
  border-radius: 50px;
  outline: none;
  padding: 9px 24px;
  border: 1px solid #ffffff;
  border-radius: 32px;
  background: transparent;
  font-family: 'CD-M';
  font-size: 16px;
  cursor: pointer;
  transition: all 0.25s ease;
  color: #fff;

  :hover {
    color: #000;
    background: #fff;
  }
`

const CustomWalletMultiButton = () => {
  return <Custom />
}

export default CustomWalletMultiButton
