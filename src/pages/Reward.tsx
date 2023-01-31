import * as anchor from '@project-serum/anchor'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import Squads, { getMsPDA } from '@sqds/sdk'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import { ReactComponent as RemoveInputIcon } from '../assets/x-icon.svg'
import ClashButton from '../components/ClashButton'
import ClashInput from '../components/ClashInput'
import CustomWalletMultiButton from '../components/CustomWalletMultiButton'
import FullPageLoading from '../components/FullPageLoading'
import { Container, LogoText } from '../ui/Common.style'
import { Group, Header } from '../ui/Header.style'
import { truncateAddress } from '../utils'
import { SquadsMpl } from '../utils/squads_mpl'
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

const TeamInformationContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const TeamInformationWrapper = styled.div`
  padding: 40px 56px;
  background: #303030;
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const InformationGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const InformationSubtitle = styled.span`
  font-size: 16px;
  line-height: 20px;
  color: #858585;
  font-family: 'Circular-M';
`

const OwnerGroupContainer = styled.div`
  display: flex;
  gap: 12px;
  overflow: auto;
  width: 80vw;
`

const OwnerInformationContainer = styled.div`
  background: #262626;
  border: 1px solid #646464;
  border-radius: 12px;
  padding: 12px 18px;
`

const OwnerAddress = styled.span`
  font-size: 16px;
  line-height: 20px;
  color: #fff;
`

const ThresholdInformation = styled.span`
  font-size: 24px;
  line-height: 30px;
  color: #ffffff;
`

const AddRewardButton = styled.button`
  background: linear-gradient(180deg, rgba(133, 109, 233, 0.7) 0%, rgba(90, 66, 183, 0.7) 100%);
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-family: 'Circular-M';
  font-size: 16px;
  padding: 12px;
  transition: all 0.25s ease;

  :hover {
    background: linear-gradient(180deg, rgba(133, 109, 233, 1) 0%, rgba(90, 66, 183, 1) 100%);
    box-shadow: 0px 24px 70px rgba(57, 40, 135, 0.39), 0px 15.5556px 40.9954px rgba(57, 40, 135, 0.296111),
      0px 9.24444px 22.2963px rgba(57, 40, 135, 0.236889), 0px 4.8px 11.375px rgba(57, 40, 135, 0.195),
      0px 1.95556px 5.7037px rgba(57, 40, 135, 0.153111), 0px 0.444444px 2.75463px rgba(57, 40, 135, 0.0938889);
  }
`

const RewardHistoryContainer = styled.div`
  margin-top: 8px;
  width: 100%;
  height: 600px;
  overflow: auto;
`

const RewardHistory = styled.div`
  background: #202020;
  border-radius: 12px;
  padding: 16px 28px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 8px;
  position: relative;
`

const RewardTitle = styled.span`
  font-size: 20px;
  line-height: 25px;
  color: #fff;
  font-family: 'CD-M';
  margin-bottom: 6px;
`

const RewardStatus = styled.span<{ color: string }>`
  font-family: 'Circular-M';
  color: ${(props) => props.color};
  font-size: 20px;
  line-height: 15px;
`

const Back = styled.span`
  color: #fff;
  font-size: 20px;
  cursor: pointer;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`

// const ButtonGroup = styled.button
//#endregion

const Reward = () => {
  const [loading, setLoading] = useState(true)
  const [transaction, setTransaction] = useState<any>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [address, setAddress] = useState<string>('')

  const { publicKey } = useWallet()
  // @ts-ignore
  const squads = Squads.devnet(window.solana)

  useEffect(() => {
    const getTransaction = async () => {
      setLoading(true)
      if (searchParams.get('address')) {
        try {
          const transactionAccount = await squads.getTransaction(
            new anchor.web3.PublicKey(searchParams.get('address')!),
          )

          setTransaction(transactionAccount)
          setAddress(searchParams.get('address')!)
        } catch (error) {
          console.error(error)
        } finally {
          setLoading(false)
        }
      }
    }

    getTransaction()
  }, [publicKey])

  const approveTransaction = async () => {
    await squads.approveTransaction(new anchor.web3.PublicKey(address))
  }

  const executeTransaction = async () => {
    await squads.executeTransaction(new anchor.web3.PublicKey(address))
  }

  const rejectTransaction = async () => {
    await squads.rejectTransaction(new anchor.web3.PublicKey(address))
  }

  return (
    <Container>
      <Header>
        <div>
          <Back onClick={() => navigate('/dashboard', { replace: true })}>{`Back`}</Back>{' '}
        </div>
        <LogoText fontsize='24px'>FLexin</LogoText>
        <Group>
          <CustomWalletMultiButton />
        </Group>
      </Header>
      {loading ? (
        <FullPageLoading />
      ) : (
        <>
          <Content>
            <TeamInformationContainer>
              <TeamInformationWrapper>
                <TextWithBackground>{transaction?.publicKey.toString()}</TextWithBackground>
                <InformationGroup>
                  <InformationSubtitle>Status</InformationSubtitle>
                  <RewardStatus
                    color={
                      Object.keys(transaction.status)[0] === 'executed'
                        ? '#4BC657'
                        : Object.keys(transaction.status)[0] === 'executeReady'
                        ? '#C6AB4B'
                        : '#4B7CC6'
                    }>
                    {Object.keys(transaction.status)[0] === 'executed'
                      ? 'Executed'
                      : Object.keys(transaction.status)[0] === 'executeReady'
                      ? 'Ready for reward'
                      : 'Draft'}
                  </RewardStatus>
                </InformationGroup>
                <InformationGroup>
                  <InformationSubtitle>Action</InformationSubtitle>
                  <ButtonGroup>
                    {Object.keys(transaction.status)[0] === 'active' ? (
                      <>
                        <ClashButton text='Reject reward' outline={false} onClick={rejectTransaction} />
                        <ClashButton text='Approve reward' onClick={approveTransaction} />
                      </>
                    ) : Object.keys(transaction.status)[0] === 'executeReady' ? (
                      <ClashButton text='Execute reward' onClick={executeTransaction} />
                    ) : (
                      <></>
                    )}
                  </ButtonGroup>
                </InformationGroup>
              </TeamInformationWrapper>
            </TeamInformationContainer>
          </Content>
        </>
      )}
    </Container>
  )
}

export default Reward
