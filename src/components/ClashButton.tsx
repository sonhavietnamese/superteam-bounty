import React from 'react'
import styled from 'styled-components'

const Container = styled.button<{ outline: boolean }>`
  outline: none;
  padding: 9px 24px;
  border: ${(props) => (props.outline ? '1px solid #ffffff' : 'none')};
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

const ClashButton = ({ text, outline = true, onClick }: { text: string; outline?: boolean; onClick: () => void }) => {
  return (
    <Container outline={outline} onClick={onClick}>
      {text}
    </Container>
  )
}

export default ClashButton
