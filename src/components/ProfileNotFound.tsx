import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import ClashButton from './ClashButton'

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`

const NotFoundContainer = styled.div`
  font-family: 'CD-M';
  display: flex;
  align-items: center;
  flex-direction: column;
  color: #fff;
`

const NotFoundProfileName = styled.div`
  font-size: 64px;
  line-height: 79px;
`

const NotFoundText = styled.div`
  font-size: 96px;
  line-height: 118px;
  background: url(/img/notfound-bg.png);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 20px;
`

const ProfileNotFound = ({ profileName }: { profileName: string | undefined }) => {
  const navigate = useNavigate()

  return (
    <Container>
      <NotFoundContainer>
        <NotFoundProfileName>{profileName}</NotFoundProfileName>
        <NotFoundText>not here yet!</NotFoundText>
        <ClashButton text='Back to Flexin' onClick={() => navigate('/', { replace: true })} />
      </NotFoundContainer>
    </Container>
  )
}

export default ProfileNotFound
