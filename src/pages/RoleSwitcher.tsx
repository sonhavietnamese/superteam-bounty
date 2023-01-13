import React from 'react'
import styled from 'styled-components'
import { useLandingStore } from '../store/landing'

const SwitcherContainer = styled.div`
  /* margin-top: 94px; */
`

const SwitcherListContainer = styled.ul`
  display: flex;
  list-style: none;
  gap: 24px;
`

const SwitcherListItem = styled.li<{ active: boolean }>`
  font-family: 'Circular-B';
  font-size: 16px;
  cursor: pointer;
  color: ${(props) => (props.active ? 'black' : 'grey')};
`

const RoleSwitcher = () => {
  const [role, changeRole] = useLandingStore((state) => [state.role, state.changeRole])

  return (
    <SwitcherContainer>
      <SwitcherListContainer>
        <SwitcherListItem active={role === 'provider'} onClick={() => changeRole('provider')}>
          For Provider
        </SwitcherListItem>
        <div>|</div>
        <SwitcherListItem active={role === 'hunter'} onClick={() => changeRole('hunter')}>
          For Hunter
        </SwitcherListItem>
      </SwitcherListContainer>
    </SwitcherContainer>
  )
}

export default RoleSwitcher
