import * as React from 'react';
import Button from '@mui/material/Button';
import { styled, useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/system';
import { Divider, useMediaQuery } from '@mui/material';
import { VaultInput } from '../Input';
import { TigUsDMax } from 'src/pages/Vault';
import { LockOutlined } from '@mui/icons-material'

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle
      sx={{ m: 0, textTransform: 'uppercase', fontSize: '14px', letterSpacing: '0.1em' }}
      {...other}
    >
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

interface ClaimModalProps {
  isState: boolean;
  setState: (value: boolean) => void;
}

export const ClaimModal = (props: ClaimModalProps) => {
  const { isState, setState } = props;
  const theme = useTheme();
  const isFullScreen = useMediaQuery(theme.breakpoints.down(390));
  const handleClose = () => {
    setState(false);
  };

  const [editState, setEditState] = React.useState({
    stakingPeriod: 30,
    stakingAmount: 0.7894

  });
  const handleEditState = (prop: string, value: string | number | boolean) => {
    setEditState({ ...editState, [prop]: value });
  };

  return (
    <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={isState} fullScreen={isFullScreen} >
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        Deposit
      </BootstrapDialogTitle>
      <ClaimDialogContent>
        <LockPeriodCard>
            <PerioudCardItem>
                <MyLock>My Lock</MyLock>
                <LockPeriod status="open" />
            </PerioudCardItem>
            <Divider />
            <PerioudCardItem>
                <PendingReward>Pending reward</PendingReward>
                <RewardValue>0.453984%</RewardValue>
            </PerioudCardItem>
        </LockPeriodCard>
        <ClaimRewardButton variant='outlined'>Claim rewards</ClaimRewardButton>
        <ExtendPeriodSection>
            <ExtendItem>
                <ItemText>Extend Period</ItemText>
                <ExtendItemContent>
                    <ExtendItemLabel>
                        <ItemText>Staking period</ItemText>
                        <ItemText2>30 days | <span style={{ color: "#777E90" }}>Ends in 4 days </span></ItemText2>
                    </ExtendItemLabel>
                    <VaultInputWrapper>
                        <VaultInput type="number" name="stakingPeriod" placeholder="0" value={editState.stakingPeriod} setValue={handleEditState} component={<Max>Max</Max>} />
                    </VaultInputWrapper>
                </ExtendItemContent>
            </ExtendItem>
            <ExtendItem>
                <ItemText>Extend Amount</ItemText>
                <ExtendItemContent>
                    <ExtendItemLabel>
                        <ItemText>Staking amount</ItemText>
                        <ItemText2>0.7894 tig USD</ItemText2>
                    </ExtendItemLabel>
                    <VaultInputWrapper>
                        <VaultInput type="number" name="stakingAmount" placeholder="0" value={editState.stakingAmount} setValue={handleEditState} component={<TigUsDMax />} />
                    </VaultInputWrapper>
                </ExtendItemContent>
            </ExtendItem>
        </ExtendPeriodSection>
      </ClaimDialogContent>
      <DialogActions>
        <SaveChangeButton variant="contained" onClick={handleClose} disabled={true}>
          Save changes
        </SaveChangeButton>
        <ReleaseLockButton variant="outlined" onClick={handleClose} disabled={true}>
            <LockOutlined />
            Release the lock
        </ReleaseLockButton>
      </DialogActions>
    </BootstrapDialog>
  );
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: '0 20px',
    width: '100%'
  },
  '& .MuiPaper-root': {
    backgroundImage: 'none',
    backgroundColor: '#18191D'
  }
}));

const SaveChangeButton = styled(Button)(({ theme }) => ({
  minWidth: '185px',
  backgroundColor: '#3772FF',
  borderRadius: '4px',
  color: '#FFF',
  height: '40px',
  width: '100%',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#3772FF'
  }
}));

const ClaimDialogContent = styled(DialogContent)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  gap: '24px',
  flexDirection: 'column',
  justifyContent: 'center'
}));

const LockPeriodCard = styled(Box)(({ theme }) => ({
    borderRadius: '5px',
    backgroundColor: "#141416",
    width: '100%',
    padding: '12px 15px',
    display: 'flex',
    flexDirection: 'column',
    gap: "12px"
}))

const PerioudCardItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
}))

const MyLock = styled(Box)(({ theme }) => ({
    fontSize: '13px',
    lineHeight: '24px',
    fontWeight: '400'
}))

const RewardValue = styled(Box)(({ theme }) => ({
    fontSize: '14px',
    lineHeight: '24px',
    color: "rgba(255, 255, 255, 0.45)"
}))

const PendingReward = styled(Box)(({ theme }) => ({
    fontSize: '12px',
    lineHeight: '20px',
    color: "#B1B5C3"
}))

interface LockPeriodProps {
    status: string;
}
 
const LockPeriod = (props: LockPeriodProps) => {
    const { status } = props;
    return(
        <LockPeriodContainer status={status}>
            {status === 'open' ? "Lock period is open" : "Lock period is over"}
        </LockPeriodContainer>
    )
}

const LockPeriodContainer = styled(Box)<LockPeriodProps>(({ theme, status }) => ({
    width: '140px',
    height: "24px",
    borderRadius: '3px',
    backgroundColor: status === 'open' ? "rgba(88, 189, 125, 0.09)" : "rgba(250, 96, 96, 0.09)",
    color: status === 'open' ? "#58BD7D" : "#D33535",
    fontSize: '13px',
    lineHeight: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}))

const ClaimRewardButton = styled(Button)(({ theme }) => ({
    width: '100%',
    height: "35px",
    borderRadius: '3px',
    border: '1px solid #3772FF',
    color: "#FFFFFF",
    backgroundColor: "none",
    textTransform: 'none',
    "&: hover": {
        backgroundColor: "none",
        border: '1px solid #3772FF'
    }
}))

const ExtendPeriodSection = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
}))

const ExtendItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: "9px"
}))

const ItemText = styled(Box)(({ theme }) => ({
    fontSize: '12px',
    lineHeight: '12px',
    color: "#D2CEDE"
}))

const ExtendItemContent = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    gap: '28px',
    [theme.breakpoints.down(640)]: {
        flexDirection: 'column'
    }
}))

const ExtendItemLabel = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
}))

const ItemText2 = styled(Box)(({ theme }) => ({
    fontSize: '14px',
    lineHeight: '16px',
    color: "#E5E3EC",
    fontWeight: '700'
}))

const VaultInputWrapper = styled(Box)(({ theme }) => ({
    width: '312px',
    [theme.breakpoints.down(640)]: {
        width: '100%'
    }
}))

const Max = styled(Box)(({ theme }) => ({
    minWidth: '70px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#18191D',
    borderRadius: '2px',
    fontSize: '12px',
    lineHeight: '20px',
    color: "#777E90",
    cursor: 'pointer'
}))

const ReleaseLockButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'none',
  minWidth: '185px',
  borderRadius: '4px',
  color: '#FFFFFF',
  height: '40px',
  width: '100%',
  border: "1px solid #3772FF",
  textTransform: 'none',
  display: 'flex',
  gap: '14px',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: 'none',
    border: "1px solid #3772FF"
  }
}))

const DialogActions = styled(Box)(({ theme }) => ({
    padding: '24px',
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    [theme.breakpoints.down(490)]: {
       flexDirection : "column"
    }
}))