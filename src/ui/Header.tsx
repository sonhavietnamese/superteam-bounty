import { WalletConnectButton } from '@solana/wallet-adapter-react-ui'
import styled from 'styled-components'

const HeaderContainer = styled.div`
  padding: 40px 9.375vw;
  display: flex;
  position: fixed;
  width: 100vw;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  z-index: 99;
`

const LogoText = styled.span`
  font-size: 32px;
  font-family: 'Circular-B';
  /* mix-blend-mode: difference; */
`

const NavigationContainer = styled.nav`
  display: flex;
  align-items: flex-start;
`

const ListContainer = styled.ul`
  list-style: none;
  display: flex;
  margin-left: 72px;
  gap: 40px;
  font-family: 'Circular-B';
  align-items: flex-end;
  justify-content: flex-end;
`

const ListItem = styled.li`
  cursor: pointer;
  opacity: 0.5;
  transition: all 0.25s ease;

  :hover {
    opacity: 1;
  }
`

const LeftSide = styled.div`
  display: flex;
`

const RightSide = styled.div`
  display: flex;
`

const Header = () => {
  return (
    <HeaderContainer>
      <LeftSide>
        <LogoText>flexin</LogoText>
        <NavigationContainer>
          <ListContainer>
            <ListItem>SuperteamVN</ListItem>
            <ListItem>SuperteamVN</ListItem>
          </ListContainer>
        </NavigationContainer>
      </LeftSide>
      <RightSide>
        <WalletConnectButton />
      </RightSide>
    </HeaderContainer>
  )
}

export default Header
