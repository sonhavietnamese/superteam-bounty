import styled from 'styled-components'

const ModalContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: red;
  position: fixed;
  top: 0;
  z-index: 999999;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(12.5px);
  overflow-y: hidden;
`

const ModalContentContainer = styled.div`
  padding: 28px 32px;
  width: 600px;
  display: flex;
  flex-direction: column;
  background: #1d1d1d;
  border-radius: 28px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`

const ModalTitle = styled.span`
  font-size: 24px;
  font-family: 'CD-M';
  color: #fff;
  text-align: center;
`

const ModalInputContainer = styled.div`
  display: flex;
  gap: 32px;
  flex-direction: column;
  margin-top: 32px;
  margin-bottom: 54px;
`

const ModalButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`

export { ModalContainer, ModalContentContainer, ModalTitle, ModalInputContainer, ModalButtonGroup }
