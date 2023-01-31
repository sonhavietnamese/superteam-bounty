import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import Header from '../ui/Header'
import RoleSwitcher from '../components/RoleSwitcher'
import { ReactComponent as SearchIcon } from '../assets/search.svg'
import { useLandingStore } from '../store/landing'
import {
  ModalContainer,
  ModalContentContainer,
  ModalButtonGroup,
  ModalTitle,
  ModalInputContainer,
} from '../ui/Modal.style'
import ClashInput from '../components/ClashInput'
import ClashButton from '../components/ClashButton'
import { EMPTY_STRING, PROFILE_TAG } from '../utils/constants'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import * as anchor from '@project-serum/anchor'
import { Flexin, IDL } from '../utils/flexin'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import { FLEXIN_PROGRAM_ID } from '../utils'
import { useNavigate } from 'react-router-dom'

//#region STYLES
const LandingContainer = styled.div`
  width: 100%;
`

const Left = styled.div`
  flex: 7;
`

const Right = styled.div`
  flex: 5;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const HeroTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 56px;
`

const HeroText = styled.span`
  font-size: 4.167vw;
  font-family: 'Circular-B';
  line-height: 111.5%;
  color: #fff;
`

const HeroDescriptionContainer = styled.div`
  margin-top: 46px;
`

const HeroDescription = styled.span`
  color: #828282;
  font-size: 1.1vw;
`

const HeroImageContainer = styled.div`
  background: blue;
  width: 28.438vw;
  height: 580px;
  border-radius: 20px;
  overflow: hidden;
`

const LaunchAppButtonContainer = styled.div`
  margin-top: 100px;
  display: flex;
  align-items: center;
  gap: 20px;
`

const LaunchAppButton = styled.button`
  color: black;
  padding: 20px 48px;
  border-radius: 12px;
  outline: none;
  font-size: 24px;
  border: none;
  cursor: pointer;
  font-family: 'Circular-B';
  background: #9e9e9e;
  transition: all 0.35s ease;

  :active {
    outline: none;
  }

  :hover {
    background: #cacaca;
  }
`

const Hero = styled.div`
  width: 100%;
  padding: 200px 10.417vw 50px;
  display: flex;
`

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const HeroContainer = styled.section`
  width: 100%;
`

const InputWithIcon = styled.div`
  border-radius: 12px;
  position: relative;
`

const Input = styled.input`
  border-radius: 12px;
  padding: 19px 20px 19px 60px;
  font-size: 24px;
  background: #d9d9d9;
  border: none;
  color: black;
  font-family: 'Circular-M';
  line-height: 30px;
  margin-top: 1px;

  :active {
    outline: none;
  }
`

const InputIcon = styled.div`
  position: absolute;
  top: 50%;
  transform: translate(18px, -40%);
`

const Seperator = styled.span`
  font-size: 24px;
  font-style: italic;
  color: #8a8a8a;
`
//#endregion

const Landing = () => {
  const role = useLandingStore((state) => state.role)
  const usernameRef = useRef<HTMLInputElement>(null)
  const twitterRef = useRef<HTMLInputElement>(null)
  const telegramRef = useRef<HTMLInputElement>(null)
  const discordRef = useRef<HTMLInputElement>(null)
  const githubRef = useRef<HTMLInputElement>(null)
  const linkedinRef = useRef<HTMLInputElement>(null)
  const [openModal, setOpenModal] = useState(false)
  const navigate = useNavigate()

  const { publicKey } = useWallet()
  const { connection } = useConnection()
  const provider = new anchor.AnchorProvider(connection, window.solana, anchor.AnchorProvider.defaultOptions())

  const loadProgram = async () => new anchor.Program<Flexin>(IDL, FLEXIN_PROGRAM_ID, provider)

  const createProfile = async () => {
    if (publicKey) {
      try {
        const program = await loadProgram()

        const username = usernameRef.current?.value || EMPTY_STRING
        const twitter = twitterRef.current?.value || EMPTY_STRING
        const telegram = telegramRef.current?.value || EMPTY_STRING
        const discord = discordRef.current?.value || EMPTY_STRING
        const github = githubRef.current?.value || EMPTY_STRING
        const linkedin = linkedinRef.current?.value || EMPTY_STRING

        const [profilePDA] = anchor.web3.PublicKey.findProgramAddressSync(
          [anchor.utils.bytes.utf8.encode(PROFILE_TAG), publicKey.toBuffer()],
          FLEXIN_PROGRAM_ID,
        )

        await program.methods
          .createProfile(username, twitter, telegram, discord, github, linkedin)
          .accounts({
            profile: profilePDA,
            signer: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc()

        setOpenModal(false)
        navigate(`/${username}`, { replace: true })
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <LandingContainer>
      <Header />
      <HeroContainer>
        <Hero>
          <Left>
            <RoleSwitcher />
            {role === 'provider' ? (
              <>
                <HeroTitle content={['Reward swag', 'To your awesome', 'Community']} />
                <LaunchAppButtonContainer>
                  <LaunchAppButton>Launch App</LaunchAppButton>
                </LaunchAppButtonContainer>
              </>
            ) : (
              <>
                <HeroTitle content={['Shi*t, ser!', `You're the`, 'best Hunter']} />
                {/* <HeroDesc content='Securely manage your treasury, program upgrades\n and tokens with your Squad.' /> */}
                <LaunchAppButtonContainer>
                  {role === 'hunter' ? (
                    <>
                      <InputWithIcon>
                        <InputIcon>
                          <SearchIcon />
                        </InputIcon>
                        <Input placeholder='View a hunter profile' />
                      </InputWithIcon>
                      <Seperator>or</Seperator>
                    </>
                  ) : null}
                  <LaunchAppButton onClick={() => setOpenModal(true)}>Create Yours</LaunchAppButton>
                </LaunchAppButtonContainer>
              </>
            )}
          </Left>
          <Right>
            <HeroImageContainer>
              <HeroImage src='https://media1.giphy.com/media/5GYOM3j7f9Df7Gmq1T/giphy.gif?cid=ecf05e474xqdnxqvy8r2hbyqchx443ds9tdwkyezj5pcvsu7&rid=giphy.gif&ct=g'></HeroImage>
            </HeroImageContainer>
          </Right>
        </Hero>
      </HeroContainer>
      {openModal ? (
        <ModalContainer>
          <ModalContentContainer>
            <ModalTitle>Edit profile</ModalTitle>
            <ModalInputContainer>
              <ClashInput
                key={1}
                ref={usernameRef}
                title='Username'
                placeholder='ex: flexin'
                counter
                maximumWords={15}
              />
              <ClashInput key={2} ref={twitterRef} title='Twitter' placeholder='ex: flexin-offical' />
              <ClashInput key={3} ref={telegramRef} title='Telegram' placeholder='ex: flexin' />
              <ClashInput key={4} ref={discordRef} title='Discord' placeholder='ex: flexin#0351' />
              <ClashInput key={5} ref={githubRef} title='Github' placeholder='ex: https://github.com/flexin/' />
              <ClashInput
                key={6}
                ref={linkedinRef}
                title='Linkedin'
                placeholder='ex: https://linkedin.com/in/flexin/'
              />
            </ModalInputContainer>
            <ModalButtonGroup>
              <ClashButton key={1} onClick={() => setOpenModal(false)} outline={false} text='Cancel' />
              <ClashButton key={2} onClick={createProfile} text='Done' />
            </ModalButtonGroup>
          </ModalContentContainer>
        </ModalContainer>
      ) : (
        <></>
      )}
    </LandingContainer>
  )
}

const HeroTitle = ({ content }: { content: string[] }) => {
  return (
    <HeroTitleContainer>
      <div>
        <HeroText>{content[0]}</HeroText>
      </div>
      <div>
        <HeroText>{content[1]}</HeroText>
      </div>
      <div>
        <HeroText> — {content[2]}</HeroText>
      </div>
    </HeroTitleContainer>
  )
}

const HeroDesc = ({ content }: { content: string }) => {
  return (
    <HeroDescriptionContainer>
      <HeroDescription>{`Securely manage your treasury, program upgrades\n and tokens with your Squad.`}</HeroDescription>
    </HeroDescriptionContainer>
  )
}

export default Landing
