import React from 'react'
import styled from 'styled-components'
import Header from '../ui/Header'
import RoleSwitcher from '../components/RoleSwitcher'
import { ReactComponent as SearchIcon } from '../assets/search.svg'
import { useLandingStore } from '../store/landing'

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
  background: #d9d9d9;

  :active {
    outline: none;
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
                <HeroDesc content='Securely manage your treasury, program upgrades\n and tokens with your Squad.' />
                <LaunchAppButtonContainer>
                  <LaunchAppButton>Launch App</LaunchAppButton>
                </LaunchAppButtonContainer>
              </>
            ) : (
              <>
                <HeroTitle content={['Shi*t, ser!', `You're the`, 'best Hunter']} />
                <HeroDesc content='Securely manage your treasury, program upgrades\n and tokens with your Squad.' />
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
                  <LaunchAppButton>Create Yours</LaunchAppButton>
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
