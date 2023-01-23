import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import React from 'react'
import styled from 'styled-components'

const CustomButton = styled(WalletMultiButton)`
  font-family: 'CD-M';
`

const CustomWalletMultiButton = () => {
  return <CustomButton />
}

export default CustomWalletMultiButton
