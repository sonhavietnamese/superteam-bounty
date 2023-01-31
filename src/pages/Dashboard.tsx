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
  transition: all 0.25s ease;
  cursor: pointer;

  :hover {
    background: #484848;
  }
`

const RewardTitle = styled.span`
  font-size: 20px;
  line-height: 25px;
  color: #fff;
  font-family: 'CD-M';
  margin-bottom: 6px;
`

const RewardInformation = styled.span`
  font-size: 14px;
  line-height: 18px;
  color: #757575;
  font-family: 'Circular-M';
`

const RewardStatus = styled.span<{ color: string }>`
  font-family: 'Circular-M';
  color: ${(props) => props.color};
  font-size: 12px;
  line-height: 15px;
  border: 2px solid ${(props) => props.color};
  border-radius: 6px;
  position: absolute;
  padding: 4px 8px;
  top: 8px;
  right: 8px;
`
//#endregion

interface DynamicInput {
  address: string
}

interface TeamMultisign {
  createKey: anchor.web3.PublicKey
  publicKey: anchor.web3.PublicKey
  keys: anchor.web3.PublicKey[]
  threshold: number
}

const Dashboard = () => {
  const nameRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLInputElement>(null)
  const [ownerList, setOwnerList] = useState<DynamicInput[]>([{ address: '' }])
  const [threshold, setThreshold] = useState(1)
  const [teamAvailable, setTeamAvailable] = useState(false)
  const [loading, setLoading] = useState(true)
  const [teamMultisign, setTeamMultisign] = useState<TeamMultisign>()
  const [transactions, setTransactions] = useState<any[]>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const { publicKey } = useWallet()
  const { connection } = useConnection()
  // @ts-ignore
  const provider = new anchor.AnchorProvider(connection, window.solana, { commitment: 'confirmed' })
  // @ts-ignore
  const squads = Squads.devnet(window.solana)

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

        const squadsProgram = (await anchor.Program.at(
          'SMPLecH534NA9acpos4G6x7uf3LWbCAwZQE9e8ZekMu',
          provider,
        )) as anchor.Program<SquadsMpl>

        const all = await squadsProgram.account.msTransaction.all([
          { memcmp: { offset: 8, bytes: publicKey?.toBase58()! } },
        ])
        setTransactions(all)
        setTeamMultisign(multisigAccount)
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
      {loading ? <FullPageLoading /> : <></>}
      <Header>
        <div>{/* <SearchIcon /> */} </div>
        <LogoText fontsize='24px'>FLexin</LogoText>
        <Group>
          <CustomWalletMultiButton />
        </Group>
      </Header>
      {!loading && teamAvailable && !teamMultisign ? (
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
      ) : (
        <Content>
          <TeamInformationContainer>
            <TeamInformationWrapper>
              <TextWithBackground>{teamMultisign?.publicKey.toString()}</TextWithBackground>
              <InformationGroup>
                <InformationSubtitle>Owners</InformationSubtitle>
                <OwnerGroupContainer>
                  {teamMultisign?.keys.map((address) => (
                    <OwnerInformationContainer key={address.toString()}>
                      <OwnerAddress>{truncateAddress(address.toString())}</OwnerAddress>
                    </OwnerInformationContainer>
                  ))}
                </OwnerGroupContainer>
              </InformationGroup>
              <InformationGroup>
                <InformationSubtitle>Threshold</InformationSubtitle>
                <ThresholdInformation>{teamMultisign?.threshold}</ThresholdInformation>
              </InformationGroup>
              <InformationGroup>
                <InformationSubtitle>Rewarded</InformationSubtitle>
                <AddRewardButton onClick={() => navigate('/create-proposal')}>+ New rewarding</AddRewardButton>
                <RewardHistoryContainer>
                  {transactions && transactions?.length > 0 ? (
                    <>
                      {transactions?.map((transaction) => (
                        <RewardHistory
                          key={transaction.publicKey.toString()}
                          onClick={() => {
                            navigate(`/reward?address=${transaction.publicKey.toString()}`)
                            // setSearchParams({ address: transaction.publicKey.toString() })
                          }}>
                          <RewardTitle>{truncateAddress(transaction.publicKey.toString())}</RewardTitle>

                          <RewardStatus
                            color={
                              Object.keys(transaction.account.status)[0] === 'executed'
                                ? '#4BC657'
                                : Object.keys(transaction.account.status)[0] === 'executeReady'
                                ? '#C6AB4B'
                                : '#4B7CC6'
                            }>
                            {Object.keys(transaction.account.status)[0] === 'executed'
                              ? 'Executed'
                              : Object.keys(transaction.account.status)[0] === 'executeReady'
                              ? 'Ready for reward'
                              : 'Draft'}
                          </RewardStatus>
                        </RewardHistory>
                      ))}
                    </>
                  ) : (
                    <></>
                  )}
                </RewardHistoryContainer>
              </InformationGroup>
            </TeamInformationWrapper>
          </TeamInformationContainer>
        </Content>
      )}
    </Container>
  )
}

export default Dashboard
