import * as anchor from '@project-serum/anchor'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import ClashInput from '../components/ClashInput'
import CustomWalletMultiButton from '../components/CustomWalletMultiButton'
import { Container, LogoText } from '../ui/Common.style'
import { Group, Header } from '../ui/Header.style'
import { ReactComponent as RemoveInputIcon } from '../assets/x-icon.svg'
import ClashButton from '../components/ClashButton'
import Squads, { getIxPDA, getMsPDA } from '@sqds/sdk'
import { publicKey } from '@project-serum/anchor/dist/cjs/utils'
import FullPageLoading from '../components/FullPageLoading'

//#region STYLE
const Content = styled.section`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 150px 0;
  color: #fff;
`

const ProposalContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const ProposalInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const TextWithBackground = styled.div`
  font-size: 32px;
  line-height: 39px;
  background: url(/img/notfound-bg.png);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 20px;
  object-fit: cover;
  font-family: 'CD-B';
`

const CreateTeamContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`

const CreateTeamWrapper = styled.div`
  padding: 20px 32px;
  border-radius: 30px;
  background: #303030;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
`

const CreateTeamBackground = styled.div`
  width: 100vw;
  height: 300px;
  background: url(/img/bounty-bg.png);
  position: absolute;
  top: 100px;
`

const CustomClashInput = styled(ClashInput)`
  width: 100%;
`

const DynamicInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 680px;
`

const InputFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
`

const InputSubTitle = styled.span`
  font-size: 16px;
  color: #fff;
  font-family: 'CD-M';
  margin-left: 24px;
`

const InputFieldWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
`

const InputField = styled.input`
  border: 1px solid #ffffff;
  border: none;
  border-radius: 27px;
  padding: 12px 24px;
  font-size: 20px;
  font-family: 'Circular-M';
  flex: 1;
`

const RemoveInputButton = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #6b6b6b;
  opacity: 0.5;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  cursor: pointer;

  :hover {
    opacity: 1;
    background: #cd4e4e;
  }
`

const AddMore = styled.button`
  width: 100%;
  height: 40px;
  cursor: pointer;
  border-radius: 40px;
  border: none;
  font-size: 16px;
  font-family: 'Circular-M';
  background: #3d3d3d;
  opacity: 1;
  transition: all 0.25s ease;

  :hover {
    background: #5e5e5e;
  }
`

const RangeSlideInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const RangeSlideInput = styled.input`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  background: #555555;
  border-radius: 20px;
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;

  :hover {
    opacity: 1;
  }

  ::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    box-shadow: none;
    border: none;
    background: transparent;
  }

  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #6b50d7;
    cursor: pointer;
  }

  ::-moz-range-thumb {
    width: 22px;
    height: 22px;
    background: #6b50d7;
    cursor: pointer;
  }
`

const RangeLabelContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

const RangeLabel = styled.span`
  padding: 0 7px;
`

const CTAContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-top: 40px;
`

//#endregion

interface DynamicInput {
  address: string
}

const Dashboard = () => {
  const nameRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLInputElement>(null)
  const [ownerList, setOwnerList] = useState<DynamicInput[]>([{ address: '' }])
  const [threshold, setThreshold] = useState(1)
  const [teamAvailable, setTeamAvailable] = useState(false)
  const [loading, setLoading] = useState(false)

  // @ts-ignore
  const squads = Squads.devnet(window.solana)
  const { publicKey } = useWallet()

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target
    const list = [...ownerList]
    // @ts-ignore
    list[index][name] = value
    setOwnerList(list)
  }

  const removeInput = (index: number) => {
    const list = [...ownerList]
    list.splice(index, 1)
    setOwnerList(list)
  }

  const addInput = () => {
    setOwnerList([...ownerList, { address: '' }])
  }

  const createTeamMultisig = async () => {
    if (publicKey) {
      try {
        const multisigAccount = await squads.createMultisig(
          threshold,
          publicKey,
          ownerList.map((owner) => new anchor.web3.PublicKey(owner.address!)),
          nameRef.current?.value,
          descriptionRef.current?.value,
          'https://images.unsplash.com/photo-1611915387288-fd8d2f5f928b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80',
        )
        console.log(multisigAccount)
      } catch (error) {
        console.error(error)
      }
    }
  }

  useEffect(() => {
    const getTeamMultisig = async () => {
      setLoading(true)
      try {
        const [msPDA] = getMsPDA(publicKey!, squads.multisigProgramId)
        const multisigAccount = await squads.getMultisig(msPDA)
        console.log(multisigAccount)
        setTeamAvailable(false)
      } catch (error) {
        setTeamAvailable(true)
        setLoading(false)
      } finally {
        setLoading(false)
      }
    }

    getTeamMultisig()
  }, [publicKey])

  return (
    <Container>
      <Header>
        <div>{/* <SearchIcon /> */} </div>
        <LogoText fontsize='24px'>FLexin</LogoText>
        <Group>
          <CustomWalletMultiButton />
        </Group>
      </Header>
      {loading ? (
        <FullPageLoading />
      ) : (
        <Content>
          <CreateTeamContainer>
            <CreateTeamBackground />
            <CreateTeamWrapper>
              <TextWithBackground>Create Team</TextWithBackground>
              <ProposalContainer>
                <ProposalInputContainer>
                  <CustomClashInput key={0} ref={nameRef} title='Name' placeholder='ex: Flexin Awesome Team' />
                  <CustomClashInput
                    key={1}
                    ref={descriptionRef}
                    title='Description'
                    placeholder="ex: We're group of the craziest bro"
                  />
                  <DynamicInputContainer>
                    <InputSubTitle>Members</InputSubTitle>
                    {ownerList.map((x, i) => {
                      return (
                        <InputFieldContainer key={i}>
                          <InputFieldWrapper>
                            <InputField
                              name='address'
                              placeholder={`ex: ${anchor.web3.Keypair.generate().publicKey}`}
                              value={x.address ? x.address : ''}
                              onChange={(e) => handleInputChange(e, i)}
                            />

                            {ownerList.length !== 1 && (
                              <RemoveInputButton onClick={() => removeInput(i)}>
                                <RemoveInputIcon />
                              </RemoveInputButton>
                            )}
                          </InputFieldWrapper>
                          <div className='btn-box'>
                            {ownerList.length - 1 === i && <AddMore onClick={addInput}>+ Add</AddMore>}
                          </div>
                        </InputFieldContainer>
                      )
                    })}
                  </DynamicInputContainer>
                  {ownerList.length > 1 ? (
                    <RangeSlideInputContainer>
                      <InputSubTitle>Threshold - {threshold}</InputSubTitle>
                      <RangeLabelContainer>
                        <RangeLabel key={0}>1</RangeLabel>
                        <RangeLabel key={1}>{ownerList.length + 1}</RangeLabel>
                      </RangeLabelContainer>
                      <RangeSlideInput
                        type='range'
                        min={1}
                        max={ownerList.length + 1}
                        value={threshold}
                        onChange={(e) => setThreshold(e.target.valueAsNumber)}></RangeSlideInput>
                    </RangeSlideInputContainer>
                  ) : (
                    <></>
                  )}
                </ProposalInputContainer>
              </ProposalContainer>
              <CTAContainer>
                <ClashButton text='Create' onClick={createTeamMultisig} />
              </CTAContainer>
            </CreateTeamWrapper>
          </CreateTeamContainer>
        </Content>
      )}
    </Container>
  )
}

{
  /* <ClashInput
                  key={3}
                  ref={amountRef}
                  type='number'
                  title='Amount (SOL)'
                  placeholder='ex: Winner of the ABC'
                /> */
}

export default Dashboard
