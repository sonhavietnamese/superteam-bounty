import React, { useEffect } from 'react'
import styled from 'styled-components'
import { ReactComponent as SearchIcon } from '../assets/search-icon.svg'
import { ReactComponent as EditProfileIcon } from '../assets/edit-profile.svg'
import ClashButton from '../components/ClashButton'
import { DiscordHandler, TwitterHandler } from '../components/SocialMediaHandlerV2'
import Marquee from 'react-fast-marquee'
import { formatAmount, formatUsername } from '../utils'
import Card from '../components/Card'
import { useParams } from 'react-router-dom'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey } from '@solana/web3.js'
import { AnchorProvider, Program } from '@project-serum/anchor'
import idl from '../utils/idl.json'

//#region STYLES
const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #202020;
`

const Header = styled.header`
  width: 100%;
  padding: 32px 72px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  z-index: 999;
  backdrop-filter: blur(10px);
`

const LogoText = styled.span`
  font-size: 24px;
  font-family: 'HB';
  color: #fff;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  mix-blend-mode: difference;
`

const Group = styled.div`
  gap: 20px;
  display: flex;
`

const Content = styled.section`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
`

const UserProfileContainer = styled.div`
  width: 100%;
  padding: 130px 0 0 0;
`

const ProfileBackground = styled.div`
  height: 440px;
  border-radius: 300px;
  background: url(/img/profile-bg.png);
  object-fit: contain;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`

const ProfileNameContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`

const ProfileUsername = styled.span`
  font-size: 128px;
  font-family: 'CD-M';
  line-height: 157px;
`

const StyledEditProfileIcon = styled(EditProfileIcon)`
  cursor: pointer;
  transition: all 0.25s ease;

  :hover {
    circle {
      fill: white;
    }

    g path {
      stroke: #000;
      z-index: 99;
    }
  }
`

const SocialMedia = styled.div`
  display: flex;
  gap: 40px;
`

const ProfileTitle = styled.span`
  font-size: 20px;
  font-family: 'Circular-M';
  text-transform: uppercase;
  color: #fff;
  letter-spacing: 0.035em;
  margin-right: 40px;
  padding: 6px;
`

const TotalBountyContainer = styled.div`
  width: 100vw;
  padding: 40px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: url(/img/bounty-bg.png);
  background-blend-mode: hard-light, normal;
  margin-top: 40px;
`

const SubTitle = styled.span`
  font-size: 24px;
  color: #898989;
`

const TotalBountyAmount = styled.span`
  font-size: 64px;
  line-height: 81px;
  color: #fff;
  margin-top: 16px;
`

const BadgeInformationContainer = styled.div`
  margin-top: 54px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  overflow: hidden;
`

const CustomWalletMultiButton = styled(WalletMultiButton)`
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
//#endregion

const ProfileV2 = () => {
  const { username } = useParams<{ username: string }>()
  const { publicKey } = useWallet()
  const { connection } = useConnection()
  const twitterHanlder = 'sonha'
  const discordHandler = 'sonha#7707'
  const telegramHandler = 'sonhaaa'
  const solanaWalletAddress = 'Hb2HDX6tnRfw5j442npy58Z2GBzJA58Nz7ipouWGT63p'
  const profileTitle = 'Bounty hunter'
  const programID = 'YMtiQhF9Go7D86CcWbY34qTYtx6ptAxeXXxHRKzHx5H'
  let counterPubkey

  // ;[counterPubkey] = await anchor.web3.PublicKey.findProgramAddress([counterSeed], program.programId)

  const fetchAll = async () => {
    const program = await getProgram()

    console.log(program)

    // const account = await program.account..fetch(publicKey!)

    // console.log(account)

    // console.log(a)
  }

  const getProvider = () => {
    const provider = new AnchorProvider(connection, window.solana, {
      preflightCommitment: 'processed',
    })
    return provider
  }

  const getProgram = async () => {
    console.log(getProvider())
    const idl = await Program.fetchIdl(programID, getProvider())
    console.log(idl)

    return new Program(idl, programID, getProvider())
  }

  useEffect(() => {
    console.log(getProgram())
  }, [])

  console.log(publicKey?.toString())

  return (
    <Container>
      <Header>
        <SearchIcon />
        <LogoText>FLexin</LogoText>
        <Group>
          <ClashButton text='Share profile' />
          <button onClick={fetchAll}>click</button>
          {/* <ClashButton text='Connect wallet' /> */}
          <CustomWalletMultiButton />
        </Group>
      </Header>
      <Content>
        <UserProfileContainer>
          <ProfileBackground>
            <ProfileNameContainer>
              <ProfileUsername>{formatUsername(username)}</ProfileUsername>
              <StyledEditProfileIcon />
            </ProfileNameContainer>
            <SocialMedia>
              <TwitterHandler handler='sonha' />
              <DiscordHandler handler='sonha' />
            </SocialMedia>
          </ProfileBackground>
        </UserProfileContainer>
        <Marquee gradient={false} className='custom-marquee'>
          {Array(15)
            .fill(0)
            .map(() => (
              <ProfileTitle>{profileTitle}</ProfileTitle>
            ))}
        </Marquee>
        <TotalBountyContainer>
          <SubTitle>Total bounty</SubTitle>
          <TotalBountyAmount>{formatAmount(1000000)} USDC</TotalBountyAmount>
        </TotalBountyContainer>
        <BadgeInformationContainer>
          <SubTitle>Badges</SubTitle>
          <div className='card-grid'>
            <Card />
            <Card />
            <Card />
            <Card />
          </div>
        </BadgeInformationContainer>
      </Content>
    </Container>
  )
}

export default ProfileV2
