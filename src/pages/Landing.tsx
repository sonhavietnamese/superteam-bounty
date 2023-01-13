import React from 'react'
import styled from 'styled-components'
// import { ReactComponent as HeroText } from '../assets/provider-hero-text.svg'

//#region STYLES
const LandingContainer = styled.div`
  width: 100vw;
  background: grey;
  /* padding: 60px 240px; */
`

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`

const LogoText = styled.span`
  font-size: 36px;
  font-family: 'Circular-B';
`

const Content = styled.div`
  width: 100%;
  /* background: green; */
`

const Hero = styled.section`
  width: 100%;
  display: flex;
`

const Left = styled.div`
  flex: 7;
  /* background: pink; */
`

const Right = styled.div`
  flex: 5;
  background: orchid;
`

const SwitcherContainer = styled.div`
  /* background: red; */
  margin-top: 94px;
`

const SwitcherListContainer = styled.ul`
  display: flex;
  list-style: none;
  gap: 24px;
`

const SwitcherListItem = styled.li`
  font-family: 'Circular-B';
  font-size: 16px;
  cursor: pointer;
`

const HeroTextContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const HeroText = styled.span`
  font-size: 80px;
  font-family: 'Circular-B';
  line-height: 111.5%;
`

const HeroDescription = styled.span``

const HeroImageContainer = styled.div`
  background: blue;
  width: 546px;
  height: 549px;
`

const LaunchAppButtonContainer = styled.div``

const LaunchAppButton = styled.button``

const NavigationContainer = styled.nav``

const ListContainer = styled.ul`
  list-style: none;
  display: flex;
  margin-left: 72px;
  gap: 20px;
`

const ListItem = styled.li`
  cursor: pointer;
  opacity: 0.5;
  transition: all 0.25s ease;

  :hover {
    opacity: 1;
  }
`

//#endregion

const Landing = () => {
  return (
    <LandingContainer>
      {/* <HeaderContainer>
        <LogoText>flexin</LogoText>
        <NavigationContainer>
          <ListContainer>
            <ListItem>SuperteamVN</ListItem>
            <ListItem>SuperteamVN</ListItem>
          </ListContainer>
        </NavigationContainer>
      </HeaderContainer>
      <Content>
        <Hero>
          <Left>
            <SwitcherContainer>
              <SwitcherListContainer>
                <SwitcherListItem>For Provider</SwitcherListItem>
                <div></div>
                <SwitcherListItem>For Hunter</SwitcherListItem>
              </SwitcherListContainer>
            </SwitcherContainer>
            <HeroTextContainer>
              <div>
                <HeroText>Reward swag</HeroText>
              </div>
              <div>
                <HeroText>To your awesome</HeroText>
              </div>
              <div>
                <HeroText>Community</HeroText>
              </div>
            </HeroTextContainer>
            <HeroDescription>
              <span>Securely manage your treasury, program upgrades and tokens with your Squad.</span>
            </HeroDescription>
            <LaunchAppButtonContainer>
              <LaunchAppButton>Launch App</LaunchAppButton>
            </LaunchAppButtonContainer>
          </Left>
          <Right>
            <HeroImageContainer></HeroImageContainer>
          </Right>
        </Hero>
      </Content> */}
    </LandingContainer>
  )
}

export default Landing
