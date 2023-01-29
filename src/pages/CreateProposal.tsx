import React, { useRef } from 'react'
import { Group, Header, LogoText } from '../ui/Header.style'
import { ReactComponent as SearchIcon } from '../assets/search-icon.svg'
import ClashButton from '../components/ClashButton'
import CustomWalletMultiButton from '../components/CustomWalletMultiButton'
import { Container } from '../ui/Common.style'
import styled from 'styled-components'
import FullPageLoading from '../components/FullPageLoading'
import ClashInput from '../components/ClashInput'

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
//#endregion

const CreateProposal = () => {
  const linkRef = useRef<HTMLInputElement>(null)
  const titleRef = useRef<HTMLInputElement>(null)
  const winnerRef = useRef<HTMLInputElement>(null)
  const amountRef = useRef<HTMLInputElement>(null)

  return (
    <Container>
      <Header>
        <div>{/* <SearchIcon /> */}</div>
        <LogoText>FLexin</LogoText>
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
            <ClashInput key={3} ref={amountRef} type='number' title='Amount' placeholder='ex: Winner of the ABC' />
          </ProposalInputContainer>
        </ProposalContainer>
      </Content>
      {/* <FullPageLoading /> */}
    </Container>
  )
}

export default CreateProposal
