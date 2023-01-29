import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  position: absolute;
  z-index: 99;
  background: black;

  ::-webkit-scrollbar {
    display: none;
  }
`

const Text = styled.span`
  font-family: 'CD-M';
  color: #fff;
  font-size: 20px;
`

const FullPageLoading = () => {
  return (
    <Container>
      <Text>Loading...</Text>
    </Container>
  )
}

export default FullPageLoading
