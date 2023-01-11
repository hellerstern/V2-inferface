import { useState, useEffect } from 'react';
import { Box, Divider, IconButton, Avatar, Badge } from '@mui/material';
import { styled } from '@mui/system';
import { Container } from 'src/components/Container';
import './css/profile.css';
import './css/loading.css';
import { TraderProfile, getProfileData } from 'src/context/profile';

export const Profile = () => {
  const [avatar, setAvatar] = useState(TraderProfile().profilePicture);
  const handleChange = (event: any) => {
    if (event.target.files.length > 0) {
      const choosenImg = URL.createObjectURL(event.target.files[0]);
      setAvatar(choosenImg);
    }
  };

  const [isLoading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  useEffect(() => {
    const x = async () => {
      let _profile = await getProfileData();
      if (_profile === "NoProfile") {
        _profile = TraderProfile();
      }
      setProfile(_profile);
      setLoading(false);
    }
    x();
  }, [])

  return (
    <>
      {
        isLoading ? 
        <div className="loading">
          <div className="loading-spinner"></div>
          <div className="loading-background"></div>
        </div>
        :
        <div style={{background: 'linear-gradient(#9198e5, #e66465)', height: window.innerHeight}}>
          <Container>
            <ProfileContainer>
              <Wrapper>
                <ProfileSection>
                  <SectionContent>
                    <AvatarUpload>
                      <label htmlFor="upload">
                        <IconButton color="primary" aria-label="upload picture" component="span">
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          >
                            <Avatar
                              id="avatar"
                              src={avatar}
                              style={{
                                width: '150px',
                                height: '150px'
                              }}
                            />
                          </Badge>
                        </IconButton>
                      </label>
                      <label htmlFor="avatar" />
                    </AvatarUpload>
                    <UserDetail>
                      <UserName>{profile.username}</UserName>
                      <UserDescription>{profile.description}</UserDescription>
                    </UserDetail>
                  </SectionContent>
                </ProfileSection>
                <OverviewSection>
                  <OverviewWrapper>
                    <OverviewContent>
                      <OverviewSeparator>
                        <OverviewItem title={'Total PNL ($)'} value="12300.45" colorValue="rgba(255, 255, 255, 0.6)" />
                        <OverviewItem title={'Biggest win ($)'} value="6000.23" colorValue="rgba(255, 255, 255, 0.6)" />
                        <OverviewItem title={'Biggest win %'} value="453.15%" colorValue="rgba(255, 255, 255, 0.6)" />
                        <OverviewItem title={'Total trades'} value="1243" colorValue="rgba(255, 255, 255, 0.6)" />
                        <OverviewItem title={'Winrate %'} value="52.7%" colorValue="rgba(255, 255, 255, 0.6)" />
                      </OverviewSeparator>
                      <ResponsiveDevider1 />
                      <ResponsiveDevider2 />
                      <OverviewSeparator>
                        <OverviewItem title={'Take profit price'} value="0.34789247" colorValue="#58BD7D" />
                        <OverviewItem title={'Entry price'} value="0.29039402" colorValue="rgba(255, 255, 255, 0.6)" />
                        <OverviewItem title={'Exit Price'} value="0.4598948585" colorValue="rgba(255, 255, 255, 0.6)" />
                        <OverviewItem title={'Stop limit price'} value="0.4590594" colorValue="rgba(255, 255, 255, 0.6)" />
                        <OverviewItem title={'Liq price'} value="0.3840934804" colorValue="#D33535" />
                        <ResponsiveDevider2 />
                        <OverviewItem title={'Total volume traded'} value="8,3million" colorValue="#777E90" />
                        <OverviewItem title={'Number of trades'} value="Number of trades" colorValue="#777E90" />
                      </OverviewSeparator>
                    </OverviewContent>
                  </OverviewWrapper>
                </OverviewSection>
              </Wrapper>
            </ProfileContainer>
          </Container>
        </div>
      }
    </>
  );
};

const ProfileContainer = styled(Box)(({ theme }) => ({
  padding: '70px 0',
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center'
}));

const Wrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  gap: '12px',
  maxWidth: '960px'
}));

const ProfileSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
}));

const OverviewSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%'
}));

const SectionContent = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: '22px 27px',
  background: 'rgba(0, 0, 0, 0.25)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
  borderRadius: '10px'
}));

const AvatarUpload = styled(Box)(({ theme }) => ({}));

const UserDetail = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}));

const UserName = styled(Box)(({ theme }) => ({
  fontSize: '30px'
}));

const UserDescription = styled(Box)(({ theme }) => ({
  fontSize: '13px'
}));

const ItemTitle = styled(Box)(({ theme }) => ({
  color: '#FFFFFF',
  fontSize: '12px',
  lineHeight: '20px'
}));

const ItemValue = styled(Box)(({ theme }) => ({
  fontSize: '12px',
  lineHeight: '20px'
}));

interface OverviewItemProps {
  title: string;
  value: string | number;
  colorValue: string;
}

const OverviewItem = (props: OverviewItemProps) => {
  const { title, value, colorValue } = props;
  return (
    <OverviewItemContainer>
      <ItemTitle>{title}</ItemTitle>
      <ItemValue sx={{ color: colorValue }}>{value}</ItemValue>
    </OverviewItemContainer>
  );
};

const OverviewItemContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}));

const OverviewWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  minWidth: '310px'
}));

const OverviewContent = styled(Box)(({ theme }) => ({
  padding: '22px 27px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.25)',
  [theme.breakpoints.down(1440)]: {
    flexDirection: 'row'
  },
  [theme.breakpoints.down(768)]: {
    flexDirection: 'column'
  },
  borderRadius: '10px'
}));

const OverviewSeparator = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  width: '100%'
}));

const ResponsiveDevider1 = styled(Box)(({ theme }) => ({
  width: '1px',
  backgroundColor: '#343538',
  [theme.breakpoints.down(768)]: {
    display: 'none'
  }
}));

const ResponsiveDevider2 = styled(Divider)(({ theme }) => ({
  [theme.breakpoints.down(1440)]: {
    display: 'none'
  }
}));
