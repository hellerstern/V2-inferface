import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/system';
import { InputField } from '../Input';
import { IconDropDownMenu } from '../Dropdown/IconDrop';
import { OnlyLogo } from 'src/config/images';
import { CommonDropDown } from '../Dropdown';
import { useAccount } from 'wagmi';

const partialArr = [
  {
    icon: OnlyLogo,
    name: 'tigUSD'
  },
  {
    icon: OnlyLogo,
    name: 'btcUSD'
  },
  {
    icon: OnlyLogo,
    name: 'bscUSD'
  },
  {
    icon: OnlyLogo,
    name: 'ethUSD'
  }
];

const marginArr = ['Add', 'Duplicate', 'Archive', 'More'];

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle
      sx={{ m: 0, p: '24px', textTransform: 'uppercase', fontSize: '14px', letterSpacing: '0.1em' }}
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

interface EditModalProps {
  isState: boolean;
  setState: (value: boolean) => void;
}

export const EditModal = (props: EditModalProps) => {
  const { isConnected } = useAccount();
  const { isState, setState } = props;
  const handleClose = () => {
    setState(false);
  };

  const initialState = {
    stopLoss: '',
    profit: '',
    partial: {
      icon: OnlyLogo,
      name: 'tigUSD'
    },
    addMenu: {
      icon: OnlyLogo,
      name: 'tigUSD'
    },
    partialPro: '',
    addNum: '',
    addDrop: 'Add',
    posDrop: {
      icon: OnlyLogo,
      name: 'tigUSD'
    },
    position: ''
  };

  const [editState, setEditState] = React.useState(initialState);

  const isChanged = JSON.stringify(editState) === JSON.stringify(initialState);

  React.useEffect(() => {
    console.log('isChanged: ', isChanged);
  }, [editState]);

  const handleEditState = (prop: string, value: string | number | boolean) => {
    setEditState({ ...editState, [prop]: value });
  };

  return (
    <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={isState}>
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        Edit Position
      </BootstrapDialogTitle>
      <EditDialogContent>
        <FeeLabelGroup>
          <FeeLabel>
            <TextLabel>Payout after fees</TextLabel>
            <FeeLabelValue>$15.01</FeeLabelValue>
          </FeeLabel>
          <FeeLabel>
            <TextLabel>Payout after fees</TextLabel>
            <FeeLabelValue>$15.01</FeeLabelValue>
          </FeeLabel>
        </FeeLabelGroup>
        <EditField>
          <TextLabel>Stop loss</TextLabel>
          <StopLossAction>
            <InputField name="stopLoss" type="number" value={editState.stopLoss} setValue={handleEditState} />
            {isConnected ? (
              <>
                <ApplyButton disabled={editState.stopLoss === ''} variant="contained">
                  Apply
                </ApplyButton>
                <CancelButton>Cancel</CancelButton>
              </>
            ) : (
              ''
            )}
          </StopLossAction>
        </EditField>
        <EditField>
          <FieldLabel>
            <TextLabel>Take profit</TextLabel>
            <PrimaryLabel>Edit</PrimaryLabel>
          </FieldLabel>
          <FieldAction>
            <Box sx={{ width: '100%', gridColumn: '1 / 4' }}>
              <InputField
                name="profit"
                type="number"
                placeholder="2.48309480"
                value={editState.profit}
                setValue={handleEditState}
              />
            </Box>
          </FieldAction>
        </EditField>
        <EditField>
          <FieldLabel>
            <TextLabel>Partial closing</TextLabel>
          </FieldLabel>
          <FieldAction>
            <IconDropDownMenu
              arrayData={partialArr}
              name="partial"
              state={editState.partial}
              setState={handleEditState}
            />
            <InputField
              name="profitPro"
              type="number"
              placeholder="100%"
              value={editState.partialPro}
              setValue={handleEditState}
            />
            <ClosePositionButton>Close Position</ClosePositionButton>
          </FieldAction>
        </EditField>
        <EditField>
          <FieldLabel>
            <TextLabel>Add/remove margin</TextLabel>
          </FieldLabel>
          <FieldAction>
            <IconDropDownMenu
              arrayData={partialArr}
              name="addMenu"
              state={editState.addMenu}
              setState={handleEditState}
            />
            <CommonDropDown arrayData={marginArr} name="addDrop" state={editState.addDrop} setState={handleEditState} />
            <InputFieldContainer>
              <InputField
                name="addNum"
                type="number"
                placeholder="5"
                value={editState.addNum}
                setValue={handleEditState}
              />
            </InputFieldContainer>
          </FieldAction>
        </EditField>
        <FieldLabel>
          <TextLabel>New margin</TextLabel>
          <SecondaryLabel>20.00</SecondaryLabel>
        </FieldLabel>
        <FieldLabel>
          <TextLabel>New leverage</TextLabel>
          <SecondaryLabel>100.00</SecondaryLabel>
        </FieldLabel>
        <AddMarginButton variant="outlined">Add margin</AddMarginButton>
        <EditField>
          <FieldLabel>
            <TextLabel>Add to position</TextLabel>
          </FieldLabel>
          <FieldAction>
            <IconDropDownMenu
              arrayData={partialArr}
              name="posDrop"
              state={editState.posDrop}
              setState={handleEditState}
            />
            <InputField
              name="position"
              type="number"
              placeholder="0"
              value={editState.position}
              setValue={handleEditState}
            />
            <OpenButton variant="outlined">Open</OpenButton>
          </FieldAction>
        </EditField>
        <FieldLabel>
          <TextLabel>New margin</TextLabel>
          <SecondaryLabel>$20.00</SecondaryLabel>
        </FieldLabel>
        <FieldLabel>
          <TextLabel>New position size</TextLabel>
          <SecondaryLabel>$2000.00</SecondaryLabel>
        </FieldLabel>
        <FieldLabel>
          <TextLabel>New open price</TextLabel>
          <SecondaryLabel>$19,177.42</SecondaryLabel>
        </FieldLabel>
      </EditDialogContent>
      <DialogActions>
        <SaveChangeButton disabled={isChanged} variant="contained" onClick={handleClose}>
          Save changes
        </SaveChangeButton>
      </DialogActions>
    </BootstrapDialog>
  );
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: '0 24px',
    width: '100%'
  },
  '& .MuiDialogActions-root': {
    padding: '24px'
  },
  '& .MuiPaper-root': {
    backgroundImage: 'none',
    backgroundColor: '#18191D'
  }
}));

const SaveChangeButton = styled(Button)(({ theme }) => ({
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

const EditDialogContent = styled(DialogContent)(({ theme }) => ({
  width: '500px',
  display: 'flex',
  gap: '24px',
  flexDirection: 'column'
}));

const FeeLabelGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '14px',
  lineHeight: '12px',
  fontWeight: '400'
}));

const FeeLabel = styled(Box)(({ theme }) => ({
  minWidth: '160px',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  [theme.breakpoints.down(400)]: {
    minWidth: '60px'
  }
}));

const TextLabel = styled(Box)(({ theme }) => ({
  fontSize: '12px',
  lineHeight: '12px',
  color: '#D2CEDE'
}));

const FeeLabelValue = styled(Box)(({ theme }) => ({
  fontSize: '14px',
  lineHeight: '16px',
  fontWeight: '700',
  color: '#E5E3EC'
}));

const EditField = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: '8px'
}));

const StopLossAction = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  gap: '5px',
  alignItems: 'center'
}));

const FieldAction = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  width: '100%',
  gap: '5px',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)'
  }
}));

const ApplyButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#3772FF',
  borderRadius: '2px',
  color: '#FFF',
  height: '36px',
  width: '150px',
  textTransform: 'none'
}));

const CancelButton = styled(Box)(({ theme }) => ({
  color: '#FFF',
  backgroundColor: 'none',
  height: '36px',
  width: '45px',
  fontSize: '12px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  paddingLeft: '10px'
}));

const FieldLabel = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between'
}));

const PrimaryLabel = styled(Box)(({ theme }) => ({
  fontSize: '12px',
  lineHeight: '12px',
  color: '#3772FF',
  cursor: 'pointer'
}));

const SecondaryLabel = styled(Box)(({ theme }) => ({
  fontSize: '12px',
  lineHeight: '12px',
  color: 'rgba(255, 255, 255, 0.45)',
  cursor: 'pointer'
}));

const ClosePositionButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'none',
  width: '100%',
  fontSize: '12px',
  borderRadius: '2px',
  border: '1px solid #fa6060',
  textTransform: 'none',
  '&:hover': {
    background: 'none'
  },
  [theme.breakpoints.down('sm')]: {
    gridColumn: '1 / 3',
    marginTop: '18px'
  }
}));

const AddMarginButton = styled(Button)(({ theme }) => ({
  width: '100%',
  textTransform: 'none',
  border: '1px solid #3772FF',
  '&:hover': {
    border: '1px solid #3772FF'
  }
}));

const OpenButton = styled(Button)(({ theme }) => ({
  width: '100%',
  textTransform: 'none',
  border: '1px solid #3772FF',
  '&:hover': {
    border: '1px solid #3772FF'
  },
  [theme.breakpoints.down('sm')]: {
    gridColumn: '1 / 3',
    marginTop: '18px'
  }
}));

const InputFieldContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    gridColumn: '1 / 3',
    marginTop: '10px'
  }
}));
