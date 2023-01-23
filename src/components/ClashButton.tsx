import React from 'react'
import styled from 'styled-components'

const Container = styled.button`
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

const ClashButton = ({ text }: { text: string }) => {
  return <Container>{text}</Container>
}

export default ClashButton
