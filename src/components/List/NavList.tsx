import { Box, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { styled } from '@mui/system';
import { GovernanceSvg, TradeSvg, VaultSvg, ReferralSvg, Indicator } from '../../../src/config/images';
import { useStore } from '../../../src/context/StoreContext';

export const NavList = () => {
  const { setPage } = useStore();
  return (
    <List component="nav" sx={{ paddingY: '1.5rem' }}>
      <ListItemButton sx={{ paddingX: '1.5rem' }} onClick={() => setPage(0)}>
        <ListItemIcon sx={{ minWidth: 30 }}>
          <Img src={TradeSvg} alt="trade-svg" />
        </ListItemIcon>
        <ListItemText primary={'Trade'} />
      </ListItemButton>
      <ListItemButton sx={{ paddingX: '1.5rem' }} onClick={() => setPage(1)}>
        <ListItemIcon sx={{ minWidth: 30 }}>
          <Img src={VaultSvg} alt="Vault-svg" />
        </ListItemIcon>
        <ListItemText primary={'Vault'} />
      </ListItemButton>
      <ListItemButton sx={{ paddingX: '1.5rem' }} onClick={() => setPage(2)}>
        <ListItemIcon sx={{ minWidth: 30 }}>
          <Img src={GovernanceSvg} alt="Governance-svg" />
        </ListItemIcon>
        <ListItemText primary={'Governance'} />
      </ListItemButton>
      <ListItemButton sx={{ paddingX: '1.5rem' }} onClick={() => setPage(3)}>
        <ListItemIcon sx={{ minWidth: 30 }}>
          <Img src={ReferralSvg} alt="Referral-svg" />
        </ListItemIcon>
        <ListItemText primary={'Referral'} />
      </ListItemButton>
      <ListItemButton sx={{ paddingX: '1.5rem' }} onClick={() => setPage(4)}>
        <ListItemIcon sx={{ minWidth: 30 }}>
          <Img src={Indicator} alt="Referral-svg" />
        </ListItemIcon>
        <ListItemText primary={'Faucet'} />
      </ListItemButton>
    </List>
  );
};

const Img = styled('img')(({ theme }) => ({
  width: '15px',
  height: '15px'
}));

const SubFix = styled('img')({
  marginTop: '-10px'
});
