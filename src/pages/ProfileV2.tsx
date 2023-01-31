import { getParsedNftAccountsByOwner, getSolanaMetadataAddress } from '@nfteyez/sol-rayz'
import * as anchor from '@project-serum/anchor'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import { useEffect, useRef, useState } from 'react'
import Marquee from 'react-fast-marquee'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { ReactComponent as EditProfileIcon } from '../assets/edit-profile.svg'
import { ReactComponent as SearchIcon } from '../assets/search-icon.svg'
import Card from '../components/Card'
import ClashButton from '../components/ClashButton'
import ClashInput from '../components/ClashInput'
import CustomWalletMultiButton from '../components/CustomWalletMultiButton'
import FullPageLoading from '../components/FullPageLoading'
import ProfileNotFound from '../components/ProfileNotFound'
import {
  DiscordHandler,
  GithubHandler,
  LinkedinHandler,
  SolanaWalletHandler,
  TelegramHandler,
  TwitterHandler,
} from '../components/SocialMediaHandlerV2'
import { Container, LogoText } from '../ui/Common.style'
import { Group, Header } from '../ui/Header.style'
import {
  ModalButtonGroup,
  ModalContainer,
  ModalContentContainer,
  ModalInputContainer,
  ModalTitle,
} from '../ui/Modal.style'
import { formatAmount, formatUsername } from '../utils'
import { EMPTY_STRING, PROFILE_TAG } from '../utils/constants'
import { Flexin, IDL } from '../utils/flexin'
import idl from '../utils/flexin.json'
import axios, { isCancel, AxiosError } from 'axios'

window.Buffer = Buffer

//#region STYLES

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
  z-index: 2;
`

const ProfileNameContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  z-index: 2;
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
  z-index: 2;
  background: #0000004b;
  padding: 8px 20px;
  border-radius: 40px;
  backdrop-filter: blur(10px);
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
  color: #e7e7e7;
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

//#endregion

type UserProfile = {
  username: string
  twitter: string
  telegram: string
  discord: string
  github: string
  linkedin: string
  walletAddress: string
}

const ProfileV2 = () => {
  const usernameRef = useRef<HTMLInputElement>(null)
  const twitterRef = useRef<HTMLInputElement>(null)
  const telegramRef = useRef<HTMLInputElement>(null)
  const discordRef = useRef<HTMLInputElement>(null)
  const githubRef = useRef<HTMLInputElement>(null)
  const linkedinRef = useRef<HTMLInputElement>(null)

  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const { publicKey } = useWallet()
  const { connection } = useConnection()

  const profileTitle = 'Bounty hunter'
  const programID = new PublicKey(idl.metadata.address)
  const provider = new anchor.AnchorProvider(connection, window.solana, anchor.AnchorProvider.defaultOptions())

  const [openModal, setOpenModal] = useState(false)
  const [transactionPending, setTransactionPending] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>()
  const [isOwner, setIsOwner] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [certificateMetadata, setCertificateMetadata] = useState<any[]>()
  const [totalBounty, setTotalBounty] = useState(0)

  const updateProfile = async () => {
    if (publicKey) {
      try {
        const program = await loadProgram()

        setTransactionPending(true)
        const username = usernameRef.current?.value || EMPTY_STRING
        const twitter = twitterRef.current?.value || EMPTY_STRING
        const telegram = telegramRef.current?.value || EMPTY_STRING
        const discord = discordRef.current?.value || EMPTY_STRING
        const github = githubRef.current?.value || EMPTY_STRING
        const linkedin = linkedinRef.current?.value || EMPTY_STRING

        const [profilePDA] = anchor.web3.PublicKey.findProgramAddressSync(
          [anchor.utils.bytes.utf8.encode(PROFILE_TAG), publicKey.toBuffer()],
          programID,
        )

        await program.methods
          .updateProfile(username, twitter, telegram, discord, github, linkedin)
          .accounts({
            profile: profilePDA,
            signer: publicKey,
            systemProgram: SystemProgram.programId,
          })
          // .instruction()
          .rpc()

        setOpenModal(false)
        navigate(`/${username}`, { replace: true })
      } catch (error) {
        console.error(error)
      } finally {
        setTransactionPending(false)
      }
    }
  }

  const loadProgram = async () => new anchor.Program<Flexin>(IDL, programID, provider)

  useEffect(() => {
    setIsLoading(true)
    const fetchAccountByUsername = async () => {
      console.log('fetchAccountByUsername')

      try {
        const program = await loadProgram()

        const allProfiles = await program.account.profile.all()
        console.log(allProfiles)

        const filteredProfile = allProfiles.filter((profile) => {
          if (profile.account.username === username) return profile.account
        })

        console.log(filteredProfile[0])

        const nftArray = await getParsedNftAccountsByOwner({
          publicAddress: filteredProfile[0]?.account.walletAddress!,
          connection,
        })
        let arr = []
        let amount = 0
        for (let i = 0; i < nftArray.length; i++) {
          console.log(nftArray[i].data.uri)
          let val = await (await axios.get(nftArray[i].data.uri)).data
          if (
            val.attributes &&
            val.attributes.length >= 2 &&
            val.attributes[1].value &&
            val.attributes[1].value === 'SuperteamVN'
          ) {
            console.log(val.attributes[0].value.split(' ')[0], parseFloat(val.attributes[0].value.split(' ')[0]))

            amount += parseFloat(val.attributes[0].value.split(' ')[0])
            arr.push(val)
          }
        }
        console.log(arr)
        setTotalBounty(amount)
        setUserProfile(filteredProfile[0].account)
        setCertificateMetadata(arr)
      } catch (error) {
        console.error(error)
        // setIsLoading(false)
      } finally {
        if (!publicKey) {
          setIsLoading(false)
        }
      }
    }

    fetchAccountByUsername()
  }, [username])

  useEffect(() => {
    const checkIsProfileOwner = async () => {
      console.log('checkIsProfileOwner')
      if (publicKey && userProfile) {
        console.log('inside')

        try {
          const program = await loadProgram()

          const [userPDA] = anchor.web3.PublicKey.findProgramAddressSync(
            [anchor.utils.bytes.utf8.encode('PROFILE'), publicKey.toBuffer()],
            programID,
          )

          const user = await program.account.profile.fetch(userPDA)
          console.log(userProfile)
          console.log(publicKey.toString())
          console.log(userProfile.walletAddress === publicKey.toString())

          setIsOwner(user && userProfile.walletAddress === publicKey.toString())
        } catch (error) {
          setIsOwner(false)
          setIsLoading(false)
        } finally {
          setIsLoading(false)
        }
      }
    }

    checkIsProfileOwner()
  }, [publicKey, userProfile])

  useEffect(() => {
    if (
      userProfile &&
      twitterRef.current &&
      telegramRef.current &&
      discordRef.current &&
      githubRef.current &&
      linkedinRef.current
    ) {
      twitterRef.current.placeholder = userProfile?.twitter || ''
      telegramRef.current.placeholder = userProfile?.telegram || ''
      discordRef.current.placeholder = userProfile?.discord || ''
      githubRef.current.placeholder = userProfile?.github || ''
      linkedinRef.current.placeholder = userProfile?.linkedin || ''
    }
  }, [userProfile])

  return (
    <Container>
      {isLoading ? <FullPageLoading /> : <></>}
      <Header>
        <SearchIcon />
        <LogoText fontsize='24px'>FLexin</LogoText>
        <Group>
          <ClashButton key={0} onClick={() => {}} text='Share profile' />
          <CustomWalletMultiButton />
        </Group>
      </Header>
      {userProfile ? (
        <Content>
          <UserProfileContainer>
            <ProfileBackground>
              <ProfileNameContainer>
                <ProfileUsername>{formatUsername(username)}</ProfileUsername>
                {isOwner ? <StyledEditProfileIcon onClick={() => setOpenModal(true)} /> : <></>}
              </ProfileNameContainer>
              <SocialMedia>
                <TwitterHandler handler={userProfile.twitter} />
                <TelegramHandler handler={userProfile.discord} />
                <DiscordHandler handler={userProfile.discord} />
                <GithubHandler handler={userProfile.github} />
                <LinkedinHandler handler={userProfile.linkedin} />
                <SolanaWalletHandler walletAddress={userProfile.walletAddress} />
              </SocialMedia>
            </ProfileBackground>
          </UserProfileContainer>
          <Marquee gradient={false} className='custom-marquee'>
            {Array(15)
              .fill(0)
              .map((_, index) => (
                <ProfileTitle key={index}>
                  {certificateMetadata && certificateMetadata?.length === 0
                    ? 'NEWBIE'
                    : certificateMetadata?.length < 3
                    ? 'JUNIOR HUNTER'
                    : 'BOUNTY HUNTER'}
                </ProfileTitle>
              ))}
          </Marquee>
          <TotalBountyContainer>
            <SubTitle>Total bounty</SubTitle>
            <TotalBountyAmount>{formatAmount(totalBounty)} SOL</TotalBountyAmount>
          </TotalBountyContainer>
          <BadgeInformationContainer>
            <SubTitle>Badges</SubTitle>
            <div className='card-grid'>
              {certificateMetadata && certificateMetadata.length > 0 ? (
                <>
                  {certificateMetadata.map((cert, i) => (
                    <Card key={i} imageUri={cert.image} />
                  ))}
                </>
              ) : (
                <></>
              )}
            </div>
          </BadgeInformationContainer>
        </Content>
      ) : (
        <ProfileNotFound profileName={formatUsername(username)} />
      )}

      {openModal ? (
        <ModalContainer>
          <ModalContentContainer>
            <ModalTitle>Edit profile</ModalTitle>
            <ModalInputContainer>
              <ClashInput
                key={1}
                ref={usernameRef}
                title='Username'
                placeholder={userProfile?.username ? userProfile.username : 'ex: flexin'}
                counter
                maximumWords={15}
              />
              <ClashInput
                key={2}
                ref={twitterRef}
                title='Twitter'
                placeholder={userProfile?.twitter ? userProfile.twitter : 'ex: flexin-offical'}
              />
              <ClashInput
                key={3}
                ref={telegramRef}
                title='Telegram'
                placeholder={userProfile?.telegram ? userProfile.telegram : 'ex: flexin'}
              />
              <ClashInput
                key={4}
                ref={discordRef}
                title='Discord'
                placeholder={userProfile?.discord ? userProfile.discord : 'ex: flexin#1234'}
              />
              <ClashInput
                key={5}
                ref={githubRef}
                title='Github'
                placeholder={userProfile?.github ? userProfile.github : 'ex: https://github.com/flexin/'}
              />
              <ClashInput
                key={6}
                ref={linkedinRef}
                title='Linkedin'
                placeholder={userProfile?.linkedin ? userProfile.linkedin : 'ex: https://linkedin.com/in/flexin/'}
              />
            </ModalInputContainer>
            <ModalButtonGroup>
              <ClashButton key={1} onClick={() => setOpenModal(false)} outline={false} text='Cancel' />
              <ClashButton key={2} onClick={updateProfile} text='Done' />
            </ModalButtonGroup>
          </ModalContentContainer>
        </ModalContainer>
      ) : (
        <></>
      )}
    </Container>
  )
}

export default ProfileV2
