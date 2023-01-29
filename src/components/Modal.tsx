import React, { useRef } from 'react'
import styled from 'styled-components'
import { useAppStore } from '../store/app'
import ClashButton from './ClashButton'
import ClashInput from './ClashInput'

//#region s
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
//#endregion

const Modal = ({ title }: { title: string }) => {
  const usernameRef = useRef<HTMLInputElement>(null)
  const twitterRef = useRef<HTMLInputElement>(null)
  const telegramRef = useRef<HTMLInputElement>(null)
  const discordRef = useRef<HTMLInputElement>(null)
  const githubRef = useRef<HTMLInputElement>(null)

  const [isModalOpen, changeIsModalOpen] = useAppStore((state) => [state.isModalOpen, state.changeIsModalOpen])

  const submit = () => {
    console.log('submit')
  }

  return (
    <>
      {isModalOpen ? (
        <ModalContainer>
          <ModalContentContainer>
            <ModalTitle>{title}</ModalTitle>
            <ModalInputContainer>
              <ClashInput ref={usernameRef} title='Username' placeholder='s0nhAthehAnz' counter maximumWords={15} />
              <ClashInput ref={twitterRef} title='Twitter' placeholder='s0nhAthehAnz' />
              <ClashInput ref={telegramRef} title='Telegram' placeholder='s0nhAthehAnz' />
              <ClashInput ref={discordRef} title='Discord' placeholder='s0nhAthehAnz' />
              <ClashInput ref={githubRef} title='Github' placeholder='s0nhAthehAnz' />
            </ModalInputContainer>
            <ModalButtonGroup>
              <ClashButton onClick={() => changeIsModalOpen(false)} outline={false} text='Cancel' />
              <ClashButton onClick={submit} text='Done' />
            </ModalButtonGroup>
          </ModalContentContainer>
        </ModalContainer>
      ) : (
        <></>
      )}
    </>
  )
}

export default Modal
