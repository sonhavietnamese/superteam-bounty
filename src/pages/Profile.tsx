import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import Card from '../components/Card'
import { DiscordHandler, SolanaWalletHandler, TelegramHandler, TwitterHandler } from '../components/SocialMediaHandler'
import Header from '../ui/Header'
import { formatUsername, truncateAddress } from '../utils'

const ProfileContainer = styled.div`
  width: 100%;
`

const CoverContainer = styled.section`
  width: 100%;
  height: 400px;
  position: relative;
`

const Cover = styled.img`
  width: 100%;
  height: 320px;
  object-fit: cover;
`

const AvatarContainer = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  overflow: hidden;
  border: 6px solid #ffffff;
  filter: drop-shadow(0px 100px 56px rgba(170, 170, 170, 0.07))
    drop-shadow(0px 64.8148px 32.7963px rgba(170, 170, 170, 0.0531481))
    drop-shadow(0px 38.5185px 17.837px rgba(170, 170, 170, 0.0425185))
    drop-shadow(0px 20px 9.1px rgba(170, 170, 170, 0.035))
    drop-shadow(0px 8.14815px 4.56296px rgba(170, 170, 170, 0.0274815))
    drop-shadow(0px 1.85185px 2.2037px rgba(170, 170, 170, 0.0168519));
`

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const InformationContainer = styled.section`
  /* background: red; */
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ProfileName = styled.span`
  margin-top: 12px;
  font-size: 28px;
`

const BountyTitle = styled.span`
  font-size: 16px;
  margin-top: 2px;
  background: linear-gradient(92.08deg, #ff8fb1 0%, #80499c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`

const SocialMediaContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
`

const SocialMediaText = styled.a`
  color: #7e7e7e;
`

const BountyInformationContainer = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  padding: 16px 100px 24px;
  border: 1px solid #e9e9e9;
  border-radius: 46px;
  align-items: center;
`

const TitleText = styled.span`
  font-size: 16px;
  line-height: 20px;
  color: #a4a4a4;
  text-align: center;
`

const BountyAmount = styled.span`
  font-size: 48px;
  line-height: 61px;
  color: #000000;
  margin-top: 14px;
`

const BadgeInformationContainer = styled.div`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Profile = () => {
  const navigate = useNavigate()
  const { username } = useParams<{ username: string }>()
  const twitterHanlder = 'sonha'
  const discordHandler = 'sonha#7707'
  const telegramHandler = 'sonhaaa'
  const solanaWalletAddress = 'Hb2HDX6tnRfw5j442npy58Z2GBzJA58Nz7ipouWGT63p'

  return (
    <ProfileContainer>
      <Header />
      <CoverContainer>
        <Cover src='https://img.freepik.com/free-photo/3d-abstract-wave-pattern-background_53876-104422.jpg' />
        <AvatarContainer>
          <Avatar src='https://vcdn1-sohoa.vnecdn.net/2021/12/20/bored-ape-nft-accidental-0-728-7234-6530-1639974498.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=C624CYTwi01i3bZb6oNBEg' />
        </AvatarContainer>
      </CoverContainer>
      <InformationContainer>
        <ProfileName>{formatUsername(username)}</ProfileName>
        <BountyTitle>Bounty hunter</BountyTitle>
        <SocialMediaContainer>
          <SolanaWalletHandler walletAddress={solanaWalletAddress} />
          <TwitterHandler handler={twitterHanlder} />
          <TelegramHandler handler={telegramHandler} />
          <DiscordHandler handler={discordHandler} />
        </SocialMediaContainer>
        <BountyInformationContainer>
          <TitleText>Total bounty</TitleText>
          <BountyAmount>10,000 USDC</BountyAmount>
        </BountyInformationContainer>
        <BadgeInformationContainer>
          <TitleText>Badges</TitleText>
          <section className='card-grid'>
            <Card />
            <Card />
            <Card />
            <Card />
          </section>
        </BadgeInformationContainer>
      </InformationContainer>
    </ProfileContainer>
  )
}

export default Profile
