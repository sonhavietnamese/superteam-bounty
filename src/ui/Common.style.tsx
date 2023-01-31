import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #202020;
`

const LogoText = styled.span<{ fontsize: string }>`
  font-size: ${(props) => props.fontsize};
  font-family: 'HB';
  color: #fff;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  mix-blend-mode: difference;
`

export { Container, LogoText }
