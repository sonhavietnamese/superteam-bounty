import React, { useMemo, useRef } from 'react'
import { Group, Header } from '../ui/Header.style'
import ClashButton from '../components/ClashButton'
import CustomWalletMultiButton from '../components/CustomWalletMultiButton'
import { Container, LogoText } from '../ui/Common.style'
import styled from 'styled-components'
import FullPageLoading from '../components/FullPageLoading'
import ClashInput from '../components/ClashInput'
import NFTBg1 from '../assets/nft-bg-1.jpg'
import NFTBg2 from '../assets/nft-bg-2.jpg'
import { ReactComponent as StarIcon } from '../assets/star-icon.svg'
import {
  FLEXIN_PROGRAM_ID,
  formatAmount,
  generateMetadata,
  getMasterEdition,
  getMetadata,
  TOKEN_METADATA_PROGRAM_ID,
  truncateAddress,
} from '../utils'
import * as htmlToImage from 'html-to-image'
import { create } from 'ipfs-http-client'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import {
  getAssociatedTokenAddressSync,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
} from '@solana/spl-token'
import * as anchor from '@project-serum/anchor'
import { Flexin, IDL } from '../utils/flexin'

//#region STYLE
const Content = styled.section`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 150px 0;
  color: #fff;
`

const PageTitle = styled.h1``

const ProposalContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const ProposalInputContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const NFTBuilderContainer = styled.div`
  display: flex;
  flex-direction: column;
`
const NFTBuilderWrapper = styled.div`
  border-radius: 12px;
  overflow: hidden;
  /* background: red; */
  /* display: flex; */
  /* position: absolute; */
`
const NFTBuilder = styled.div`
  width: 480px;
  height: 720px;
  /* border-radius: 12px; */
  overflow: hidden;
  position: relative;
`

const NFTBackground = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const NFTHeader = styled.div`
  display: flex;
  position: absolute;
  width: calc(100% - 24px * 2);
  top: 16px;
  z-index: 1;
  margin: 0 24px;
  justify-content: space-between;
`

const HeaderText = styled.span<{ fontFamily: string }>`
  font-size: 12px;
  font-family: ${(props) => props.fontFamily};
  color: #fff;
`

const NFTTitleContainer = styled.div`
  width: 360px;
  position: absolute;
  top: 68px;
  margin-left: 24px;
`

const NFTTitle = styled.span`
  font-family: 'Circular-M';
  font-size: 45px;
  line-height: 57px;
`

const WinnerContainer = styled.div`
  position: absolute;
  right: 24px;
  bottom: 152px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`

const AmountContainer = styled.div`
  position: absolute;
  right: 24px;
  bottom: 32px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`

const Winner = styled.span`
  font-size: 20px;
  line-height: 32px;
  color: #000000;
  font-family: 'CD-M';
  border-radius: 40px;
  padding: 2px 16px;
  background: #fff;
`

const SubtitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const Subtitle = styled.span`
  color: #fff;
  font-size: 16px;
  font-family: 'Circular-M';
  margin-top: 3px;
  margin-right: 28px;
`

const Amount = styled.span`
  font-size: 40px;
  line-height: 55px;
  color: #403737;
  font-family: 'CD-B';
  border: 1px #fff solid;
  padding: 8px 28px;
  background: #fff;
  border-radius: 40px;
  /* mix-blend-mode: darken; */
`
//#endregion

const auth =
  'Basic ' +
  Buffer.from(import.meta.env.VITE_INFURA_PROJECT_ID + ':' + import.meta.env.VITE_INFURA_API_KEY).toString('base64')

const ipfs = create({
  host: import.meta.env.VITE_INFURA_HOST,
  port: import.meta.env.VITE_INFURA_PORT,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
})

const CreateProposal = () => {
  const linkRef = useRef<HTMLInputElement>(null)
  const titleRef = useRef<HTMLInputElement>(null)
  const winnerRef = useRef<HTMLInputElement>(null)
  const amountRef = useRef<HTMLInputElement>(null)

  const nftRef = useRef<HTMLDivElement>(null)

  const { connection } = useConnection()
  const { publicKey } = useWallet()
  // @ts-ignore
  const provider = new anchor.AnchorProvider(connection, window.solana, anchor.AnchorProvider.defaultOptions())
  const flexinProgram = new anchor.Program<Flexin>(IDL, FLEXIN_PROGRAM_ID, provider)
  const nftMintKey = useMemo(() => anchor.web3.Keypair.generate(), [])

  const uploadToIPFS = async (blob: string | Blob) => {
    try {
      const uploadedFIle = await ipfs.add(blob)
      const url = `https://flexin.infura-ipfs.io/ipfs/${uploadedFIle.path}`
      return url
    } catch (error) {
      console.error('Upload failed!', error)
      return null
    }
  }

  const mintNFT = async (uri: string, title: string) => {
    const nftTokenAccount = getAssociatedTokenAddressSync(nftMintKey.publicKey, publicKey!, true)

    const lamports: number = await flexinProgram.provider.connection.getMinimumBalanceForRentExemption(MINT_SIZE)

    const mintTx = new anchor.web3.Transaction().add(
      anchor.web3.SystemProgram.createAccount({
        fromPubkey: publicKey!,
        newAccountPubkey: nftMintKey.publicKey,
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
        lamports,
      }),
      createInitializeMintInstruction(nftMintKey.publicKey, 0, publicKey!, publicKey),
      createAssociatedTokenAccountInstruction(publicKey!, nftTokenAccount, publicKey!, nftMintKey.publicKey),
    )

    // @ts-ignore
    const res = await flexinProgram.provider.sendAndConfirm(mintTx, [nftMintKey])
    console.log(await flexinProgram.provider.connection.getParsedAccountInfo(nftMintKey.publicKey))

    console.log('Account: ', res)
    console.log('Mint key: ', nftMintKey.publicKey.toString())
    console.log('User: ', publicKey!.toString())
    console.log('NFT token account:', nftTokenAccount)

    const metadataAddress = await getMetadata(nftMintKey.publicKey)
    const masterEdition = await getMasterEdition(nftMintKey.publicKey)

    console.log('Metadata address: ', metadataAddress.toBase58())
    console.log('MasterEdition: ', masterEdition.toBase58())

    const tx = await flexinProgram.methods
      .mintNft(nftMintKey.publicKey, uri, title)
      .accounts({
        mintAuthority: publicKey!,
        mint: nftMintKey.publicKey,
        tokenAccount: nftTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        metadata: metadataAddress,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        payer: publicKey!,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        masterEdition: masterEdition,
      })
      .rpc()
    console.log('Your transaction signature', tx)
  }

  const uploadAndMint = async () => {
    try {
      const imageBase64 = await htmlToImage.toPng(nftRef.current!)
      const imageBlob = await (await fetch(imageBase64)).blob()
      const imageUri = await uploadToIPFS(imageBlob)
      const metadata = generateMetadata(
        'Certificate',
        'CERT',
        'For winner',
        publicKey?.toString()!,
        imageUri ||
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKr5wT7rfkjkGvNeqgXjBmarC5ZNoZs-H2uMpML8O7Q4F9W-IlUQibBT6IPqyvX45NOgw&usqp=CAU',
      )
      const fileMetadata = new Blob([JSON.stringify(metadata)], { type: 'application/json' })
      const metadataUri = await uploadToIPFS(fileMetadata)
      console.log('metadata uri: ', metadataUri)
      await mintNFT(metadataUri!, 'Random Certificate')
    } catch (error) {
      console.error('Mint NFT failed!', error)
    }
  }

  return (
    <Container>
      <Header>
        <div>{/* <SearchIcon /> */}</div>
        <LogoText fontsize='24px'>FLexin</LogoText>
        <Group>
          <CustomWalletMultiButton />
        </Group>
      </Header>
      <Content>
        <PageTitle>Create Proposal</PageTitle>

        <ProposalContainer>
          <span>Bounty Information</span>
          <ProposalInputContainer>
            <ClashInput key={0} ref={linkRef} title='Link' placeholder='ex: Winner of the ABC' />
            <ClashInput key={1} ref={titleRef} title='Title' placeholder='ex: Winner of the ABC' />
            <ClashInput key={2} ref={winnerRef} title='Winner' placeholder='ex: Winner of the ABC' />
            <ClashInput
              key={3}
              ref={amountRef}
              type='number'
              title='Amount (SOL)'
              placeholder='ex: Winner of the ABC'
            />
          </ProposalInputContainer>
          <input type='range' min={1} max={3}></input>
          <NFTBuilderContainer>
            <NFTBuilderWrapper>
              <NFTBuilder ref={nftRef}>
                <NFTBackground src={NFTBg2} />
                <NFTHeader>
                  <HeaderText fontFamily='HB'>FLexin</HeaderText>
                  <HeaderText fontFamily='Circular-M'>BOUNTY</HeaderText>
                  <HeaderText fontFamily='Circular-M'>SuperteamVN</HeaderText>
                </NFTHeader>
                <NFTTitleContainer>
                  <NFTTitle>Tool for Superteam to log grant & bounty proof-of-work on-chain</NFTTitle>
                </NFTTitleContainer>
                <WinnerContainer>
                  <SubtitleContainer>
                    <StarIcon />
                    <Subtitle>WINNER</Subtitle>
                  </SubtitleContainer>
                  <Winner>{truncateAddress('3vcQRPwNfoQ4m7LHNusbs9KxLWY2bhqDsHf6NTCuT3sb')}</Winner>
                </WinnerContainer>
                <AmountContainer>
                  <SubtitleContainer>
                    <StarIcon />
                    <Subtitle>AMOUNT</Subtitle>
                  </SubtitleContainer>
                  <Amount>{formatAmount(3000)} SOL</Amount>
                </AmountContainer>
              </NFTBuilder>
            </NFTBuilderWrapper>
          </NFTBuilderContainer>
        </ProposalContainer>
      </Content>
      {/* <ClashButton text='Upload to IPFS' onClick={onCapture} /> */}
      <ClashButton text='Mint' onClick={uploadAndMint} />

      {/* <FullPageLoading /> */}
    </Container>
  )
}

export default CreateProposal
