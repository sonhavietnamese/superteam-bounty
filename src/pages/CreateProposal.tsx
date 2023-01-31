import React, { useMemo, useRef, useState } from 'react'
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
import { Connection, LAMPORTS_PER_SOL, SystemProgram } from '@solana/web3.js'
import Squads, { getIxPDA, getMsPDA } from '@sqds/sdk'
import { useNavigate } from 'react-router-dom'
import { LOG_REWARD_TAG } from '../utils/constants'

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
  width: 100%;
  gap: 20px;
`

const ProposalInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const NFTBuilderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
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

const CreateTeamContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`

const CreateTeamWrapper = styled.div`
  padding: 20px 32px;
  width: 700px;
  border-radius: 30px;
  background: #303030;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
`

const InputFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
`

const InputSubTitle = styled.span`
  font-size: 16px;
  color: #fff;
  font-family: 'CD-M';
  margin-left: 24px;
`

const InputField = styled.input`
  border: 1px solid #ffffff;
  border: none;
  border-radius: 27px;
  padding: 12px 24px;
  font-size: 20px;
  font-family: 'Circular-M';
  flex: 1;
`

const CTAContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-top: 40px;
`

const TextWithBackground = styled.div`
  font-size: 32px;
  line-height: 39px;
  background: url(/img/notfound-bg.png);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 20px;
  object-fit: cover;
  font-family: 'CD-B';
`

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`

const InputTitle = styled.span`
  font-size: 16px;
  color: #fff;
  font-family: 'CD-M';
  margin-left: 24px;
`

const Back = styled.span`
  color: #fff;
  font-size: 20px;
  cursor: pointer;
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
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  const [winner, setWinner] = useState('')
  const [amount, setAmount] = useState(0)

  const nftRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const { connection } = useConnection()
  const { publicKey } = useWallet()
  // @ts-ignore
  const provider = new anchor.AnchorProvider(connection, window.solana, anchor.AnchorProvider.defaultOptions())
  const flexinProgram = new anchor.Program<Flexin>(IDL, FLEXIN_PROGRAM_ID, provider)
  // @ts-ignore
  const squads = Squads.devnet(window.solana)
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
        'Bounty Certificate',
        'CERT',
        'For talent Bounty hunter',
        publicKey?.toString()!,
        imageUri ||
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKr5wT7rfkjkGvNeqgXjBmarC5ZNoZs-H2uMpML8O7Q4F9W-IlUQibBT6IPqyvX45NOgw&usqp=CAU',
        'https://vn.superteam.fun/bounties',
        amount,
      )
      const fileMetadata = new Blob([JSON.stringify(metadata)], { type: 'application/json' })
      const metadataUri = await uploadToIPFS(fileMetadata)
      console.log('metadata uri: ', metadataUri)
      await mintNFT(metadataUri!, 'Bounty Certificate')
    } catch (error) {
      console.error('Mint NFT failed!', error)
    }
  }

  const transferNFTToIx = async (from: string, destinationAddress: string) => {
    const nftTokenAccount = getAssociatedTokenAddressSync(nftMintKey.publicKey, new anchor.web3.PublicKey(from), true)
    console.log('NFT token account:', nftTokenAccount)

    const destination = new anchor.web3.PublicKey(destinationAddress)
    console.log('destination', destination)
    console.log('mintKey.publicKey', nftMintKey.publicKey)
    const destinationATA = getAssociatedTokenAddressSync(nftMintKey.publicKey, destination, true)
    console.log('destinationATA', destinationATA)

    const mint_tx_2 = new anchor.web3.Transaction().add(
      createAssociatedTokenAccountInstruction(publicKey!, destinationATA, destination, nftMintKey.publicKey),
    )

    // @ts-ignore
    await flexinProgram.provider.sendAndConfirm(mint_tx_2, [])
    return await flexinProgram.methods
      .transferToken()
      .accounts({
        tokenProgram: TOKEN_PROGRAM_ID,
        from: nftTokenAccount,
        fromAuthority: new anchor.web3.PublicKey(from),
        to: destinationATA,
      })
      .instruction()
  }

  const createTransferAmountAndMintNFTTx = async () => {
    if (publicKey) {
      try {
        await uploadAndMint()
        const [msPDA] = getMsPDA(publicKey!, squads.multisigProgramId)
        const authorityPDA = squads.getAuthorityPDA(msPDA, 1)
        console.log('authorityPDA: ', authorityPDA.toString())

        const moveNFTToMsPDATx = await createBlankTransaction(squads.connection, publicKey!)
        const moveNFTToMsPDAIx = await transferNFTToIx(publicKey?.toString()!, authorityPDA.toString())
        const moveFundsToMsPDAIx = await createTestTransferTransaction(
          publicKey!,
          authorityPDA,
          LAMPORTS_PER_SOL * amount,
        )

        moveNFTToMsPDATx.add(moveNFTToMsPDAIx)
        moveNFTToMsPDATx.add(moveFundsToMsPDAIx)
        await provider.sendAndConfirm(moveNFTToMsPDATx)

        const destination = new anchor.web3.PublicKey(winner)
        const mintNFTIx = await transferNFTToIx(authorityPDA.toString(), destination.toString())
        const transferIx = await createTestTransferTransaction(authorityPDA, destination)

        let txState = await squads.createTransaction(msPDA, 1)
        await squads.addInstruction(txState.publicKey, mintNFTIx)
        await squads.addInstruction(txState.publicKey, transferIx)
        console.log(txState.publicKey.toString())

        await squads.activateTransaction(txState.publicKey)
        await squads.approveTransaction(txState.publicKey)
      } catch (error) {
        console.error('createTransferAmountAndMintNFTTx:', error)
      }
    }
  }

  return (
    <Container>
      <Header>
        <div>
          <Back onClick={() => navigate('/dashboard', { replace: true })}>{`Back`}</Back>
        </div>
        <LogoText fontsize='24px'>FLexin</LogoText>
        <Group>
          <CustomWalletMultiButton />
        </Group>
      </Header>
      <Content>
        <CreateTeamContainer>
          <CreateTeamWrapper>
            <TextWithBackground>New Rewarding</TextWithBackground>
            <ProposalContainer>
              <ProposalInputContainer>
                <InputContainer>
                  <InputTitle>Link</InputTitle>
                  <InputFieldContainer>
                    <InputField
                      value={link}
                      type='text'
                      onChange={(e) => setLink(e.target.value)}
                      placeholder='ex: https://vn.superteam.fun/bounties/random-bounty'
                    />
                  </InputFieldContainer>
                </InputContainer>
                <InputContainer>
                  <InputTitle>Title</InputTitle>
                  <InputFieldContainer>
                    <InputField
                      value={title}
                      type='text'
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder='ex: Random Bounty'
                    />
                  </InputFieldContainer>
                </InputContainer>
                <InputContainer>
                  <InputTitle>Winner</InputTitle>
                  <InputFieldContainer>
                    <InputField
                      value={winner}
                      type='text'
                      onChange={(e) => setWinner(e.target.value)}
                      placeholder='ex: Hb2HDX6tnRfw5j442npy58Z2GBzJA58Nz7ipouWGT63p'
                    />
                  </InputFieldContainer>
                </InputContainer>
                <InputContainer>
                  <InputTitle>Amount (SOL)</InputTitle>
                  <InputFieldContainer>
                    <InputField
                      value={amount}
                      type='number'
                      min={0}
                      onChange={(e) => setAmount(e.target.valueAsNumber)}
                      placeholder='ex: 1000'
                    />
                  </InputFieldContainer>
                </InputContainer>
              </ProposalInputContainer>
              <NFTBuilderContainer>
                <div style={{ width: '100%' }}>
                  <InputSubTitle>Certificate NFT</InputSubTitle>
                </div>
                <NFTBuilderWrapper>
                  <NFTBuilder ref={nftRef}>
                    <NFTBackground src={NFTBg1} />
                    <NFTHeader>
                      <HeaderText fontFamily='HB'>FLexin</HeaderText>
                      <HeaderText fontFamily='Circular-M'>BOUNTY</HeaderText>
                      <HeaderText fontFamily='Circular-M'>SuperteamVN</HeaderText>
                    </NFTHeader>
                    <NFTTitleContainer>
                      <NFTTitle>{title}</NFTTitle>
                    </NFTTitleContainer>
                    <WinnerContainer>
                      <SubtitleContainer>
                        <StarIcon />
                        <Subtitle>WINNER</Subtitle>
                      </SubtitleContainer>
                      <Winner> {winner.length > 12 ? truncateAddress(winner) : ''}</Winner>
                    </WinnerContainer>
                    <AmountContainer>
                      <SubtitleContainer>
                        <StarIcon />
                        <Subtitle>AMOUNT</Subtitle>
                      </SubtitleContainer>
                      <Amount>{amount && amount === 0 ? 0 : formatAmount(amount)} SOL</Amount>
                    </AmountContainer>
                  </NFTBuilder>
                </NFTBuilderWrapper>
              </NFTBuilderContainer>
            </ProposalContainer>
            <CTAContainer>
              <ClashButton text='Create' onClick={createTransferAmountAndMintNFTTx} />
            </CTAContainer>
          </CreateTeamWrapper>
        </CreateTeamContainer>
      </Content>
    </Container>
  )
}

export const createTestTransferTransaction = async (
  authority: anchor.web3.PublicKey,
  recipient: anchor.web3.PublicKey,
  amount = 500000000,
) => {
  return anchor.web3.SystemProgram.transfer({
    fromPubkey: authority,
    lamports: amount,
    toPubkey: recipient,
  })
}

export const createBlankTransaction = async (connection: Connection, feePayer: anchor.web3.PublicKey) => {
  const { blockhash } = await connection.getLatestBlockhash()
  const lastValidBlockHeight = await connection.getBlockHeight()

  return new anchor.web3.Transaction({
    blockhash,
    lastValidBlockHeight,
    feePayer,
  })
}

export default CreateProposal
