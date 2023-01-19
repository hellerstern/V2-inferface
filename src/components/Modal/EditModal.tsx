import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/system';
import { TigrisInput } from '../Input';
import { IconDropDownMenu } from '../Dropdown/IconDrop';
import { tigusdLogo, daiLogo, usdtLogo } from '../../../src/config/images';
import { CommonDropDown } from '../Dropdown';
import { useAccount, useNetwork } from 'wagmi';
import { ethers } from 'ethers';
import { getNetwork } from 'src/constants/networks';
import { getShellWallet, getShellNonce } from 'src/shell_wallet';
import { toast } from 'react-toastify';
import { oracleData } from 'src/context/socket';

declare const window: any
const { ethereum } = window;

const marginArr = ['Add', 'Remove'];

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
  position: any;
}

export const EditModal = (props: EditModalProps) => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { isState, setState, position } = props;
  const partialArr = getNetwork(chain === undefined ? 0 : chain.id).marginAssets;
  const initialState = {
    stopLoss: '',
    profit: '',
    partial: partialArr[0],
    addMenu: partialArr[0],
    partialPro: '100',
    addNum: '',
    addDrop: 'Add',
    posDrop: partialArr[0],
    position: ''
  };
  const [editState, setEditState] = React.useState(initialState);
  const handleClose = () => {
    setState(false);
  };

  React.useEffect(() => {
    if (isState) {
      setEditState({
        ...editState,
        'stopLoss': position?.slPrice === "0" ? '' : (parseFloat(position?.slPrice)/1e18).toPrecision(7),
        'profit': position?.tpPrice === "0" ? '' : (parseFloat(position?.tpPrice)/1e18).toPrecision(7),
        'partialPro': '100',
        'addNum': '',
        'partial': partialArr[0],
        'addMenu': partialArr[0],
        'posDrop': partialArr[0],
        'position': ''
      });      
    }
  }, [isState]);

  const handleEditState = (prop: string, value: string | number | boolean) => {
    setEditState({ ...editState, [prop]: value });
  };

  const handleEditSL = (value: any) => {
    setEditState({ ...editState, 'stopLoss': value });
  };

  const handleEditTP = (value: any) => {
    setEditState({ ...editState, 'profit': value });
  };

  const handleEditPartialPro = (value: any) => {
    setEditState({ ...editState, 'partialPro': value });
  };

  const handleEditAddNum = (value: any) => {
    setEditState({ ...editState, 'addNum': value });
  };

  const handleEditPosition = (value: any) => {
    setEditState({ ...editState, 'position': value });
  };

  // =======
  // TRADING
  // =======
  async function getTradingContract() {
    const currentNetwork = getNetwork(chain === undefined ? 0 : chain.id);
    const signer = await getShellWallet();
    return new ethers.Contract(currentNetwork.addresses.trading, currentNetwork.abis.trading, signer);
  }

  function handleUpdateSL() {
    updateSL();
  }
  async function updateSL() {
    const currentNetwork = getNetwork(chain === undefined ? 0 : chain.id);
    const slInput = ethers.utils.parseEther(editState.stopLoss === '' ? "0" : editState.stopLoss);

    const _oracleData: any = oracleData[position.asset];

    const priceData = [
      _oracleData.provider,
      position.asset,
      _oracleData.price,
      _oracleData.spread,
      _oracleData.timestamp,
      _oracleData.isClosed
    ];

    if (position.direction && parseInt(slInput.toString()) > parseInt(_oracleData.price) && parseInt(slInput.toString()) !== 0) {
      toast.warn(
        "Stop loss too high"
      );
      return;
    } else if (!position.direction && parseInt(slInput.toString()) < parseInt(_oracleData.price) && parseInt(slInput.toString()) !== 0) {
      toast.warn(
        "Stop loss too low"
      );
      return;
    }
		
    const tradingContract = await getTradingContract();
    const gasPriceEstimate = Math.round((await tradingContract.provider.getGasPrice()).toNumber() * 2);
    const tx = tradingContract.updateTpSl(false, position.id, slInput, priceData, _oracleData.signature, address, {gasPrice: gasPriceEstimate, gasLimit: currentNetwork.gasLimit, nonce: await getShellNonce()});
    setState(false);
    const response: any = await toast.promise(
      tx,
      {
        pending: 'Updating stop loss...',
        success: undefined,
        error: 'Updating stop loss failed!'
      }
    );
    // eslint-disable-next-line
    setTimeout(async () => {
      const receipt = await tradingContract.provider.getTransactionReceipt(response.hash);
      if (receipt.status === 0) {
        toast.error(
          'Updating stop loss failed!'
        );
      }
    }, 1000);
	}

  function handleUpdateTP() {
    updateTP();
  }
  async function updateTP() {
    const currentNetwork = getNetwork(chain === undefined ? 0 : chain.id);
    const tpInput = ethers.utils.parseEther(editState.profit === '' ? "0" : editState.profit);

    const _oracleData: any = oracleData[position.asset];

    const priceData = [
      _oracleData.provider,
      position.asset,
      _oracleData.price,
      _oracleData.spread,
      _oracleData.timestamp,
      _oracleData.isClosed
    ];

    if (position.direction && parseInt(tpInput.toString()) < parseInt(_oracleData.price) && parseInt(tpInput.toString()) !== 0) {
      toast.warn(
        "Take profit too low"
      );
      return;
    } else if (!position.direction && parseInt(tpInput.toString()) > parseInt(_oracleData.price) && parseInt(tpInput.toString()) !== 0) {
      toast.warn(
        "Take profit too high"
      );
      return;
    }
		
    const tradingContract = await getTradingContract();
    const gasPriceEstimate = Math.round((await tradingContract.provider.getGasPrice()).toNumber() * 2);
    const tx = tradingContract.updateTpSl(true, position.id, tpInput, priceData, _oracleData.signature, address, {gasPrice: gasPriceEstimate, gasLimit: currentNetwork.gasLimit, nonce: await getShellNonce()});
    setState(false);
    const response: any = await toast.promise(
      tx,
      {
        pending: 'Updating take profit...',
        success: undefined,
        error: 'Updating take profit failed!'
      }
    );
    // eslint-disable-next-line
    setTimeout(async () => {
      const receipt = await tradingContract.provider.getTransactionReceipt(response.hash);
      if (receipt.status === 0) {
        toast.error(
          'Updating take profit failed!'
        );
      }
    }, 1000);
	}

  function handlePartialClose() {
    partialClose();
  }
  async function partialClose() {
    const currentNetwork = getNetwork(chain === undefined ? 0 : chain.id);
    const _oracleData: any = oracleData[position.asset];
    if (_oracleData.isClosed) {
      toast.warn(
        "Cannot trade while market is closed"
      );
    }

    const priceData = [
      _oracleData.provider,
      position.asset,
      _oracleData.price,
      _oracleData.spread,
      _oracleData.timestamp,
      _oracleData.isClosed
    ];
		
    const tradingContract = await getTradingContract();
    const gasPriceEstimate = Math.round((await tradingContract.provider.getGasPrice()).toNumber() * 2);
		const tx = tradingContract.initiateCloseOrder(position.id, parseFloat(editState.partialPro)*1e8, priceData, _oracleData.signature, editState.partial.stablevault, editState.partial.address, address, {gasPrice: gasPriceEstimate, gasLimit: currentNetwork.gasLimit, nonce: await getShellNonce()});
    setState(false);
    const response: any = await toast.promise(
      tx,
      {
        pending: 'Closing position...',
        success: undefined,
        error: 'Closing position failed!'
      }
    );
    // eslint-disable-next-line
    setTimeout(async () => {
      const receipt = await tradingContract.provider.getTransactionReceipt(response.hash);
      if (receipt.status === 0) {
        toast.error(
          'Closing position failed!'
        );
      }
    }, 1000);
	}

  function handleModifyMargin() {
    editState.addDrop === "Add" ? addMargin() : removeMargin();
  }
  async function addMargin() {
    const currentNetwork = getNetwork(chain === undefined ? 0 : chain.id);
    const addMarginInput = ethers.utils.parseEther(editState.addNum === '' ? "0" : editState.addNum);
		
    const tradingContract = await getTradingContract();
    const gasPriceEstimate = Math.round((await tradingContract.provider.getGasPrice()).toNumber() * 2);
		const tx = tradingContract.addMargin(position.id, editState.addMenu.address, editState.addMenu.stablevault, addMarginInput, [0, 0, 0, ethers.constants.HashZero, ethers.constants.HashZero, false], address, {gasPrice: gasPriceEstimate, gasLimit: currentNetwork.gasLimit, nonce: await getShellNonce()});
    setState(false);
    const response: any = await toast.promise(
      tx,
      {
        pending: 'Adding margin...',
        success: undefined,
        error: 'Adding margin failed!'
      }
    );
    // eslint-disable-next-line
    setTimeout(async () => {
      const receipt = await tradingContract.provider.getTransactionReceipt(response.hash);
      if (receipt.status === 0) {
        toast.error(
          'Adding margin failed!'
        );
      }
    }, 1000);
	}
  async function removeMargin() {
    const currentNetwork = getNetwork(chain === undefined ? 0 : chain.id);
    const removeMarginInput = ethers.utils.parseEther(editState.addNum === '' ? "0" : editState.addNum);

    const _oracleData: any = oracleData[position.asset];

    const priceData = [
      _oracleData.provider,
      position.asset,
      _oracleData.price,
      _oracleData.spread,
      _oracleData.timestamp,
      _oracleData.isClosed
    ];
		
    const tradingContract = await getTradingContract();
    const gasPriceEstimate = Math.round((await tradingContract.provider.getGasPrice()).toNumber() * 2);
		const tx = tradingContract.removeMargin(position.id, editState.addMenu.stablevault, editState.addMenu.address, removeMarginInput, priceData, _oracleData.signature, address, {gasPrice: gasPriceEstimate, gasLimit: currentNetwork.gasLimit, nonce: await getShellNonce()});
    setState(false);
    const response: any = await toast.promise(
      tx,
      {
        pending: 'Removing margin...',
        success: undefined,
        error: 'Removing margin failed!'
      }
    );
    // eslint-disable-next-line
    setTimeout(async () => {
      const receipt = await tradingContract.provider.getTransactionReceipt(response.hash);
      if (receipt.status === 0) {
        toast.error(
          'Removing margin failed!'
        );
      }
    }, 1000);
	}

  return (
    <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={isState}>
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        Edit Position
      </BootstrapDialogTitle>
      <EditDialogContent>
        <FeeLabelGroup>
          <FeeLabel>
            <TextLabel>Payout before fees</TextLabel>
            <FeeLabelValue>$15.01</FeeLabelValue>
          </FeeLabel>
          <FeeLabel>
            <TextLabel>Payout after fees</TextLabel>
            <FeeLabelValue>$15.01</FeeLabelValue>
          </FeeLabel>
          <FeeLabel>
            <TextLabel>Funding fees paid</TextLabel>
            <FeeLabelValue>{(-parseFloat(position?.accInterest)/1e18).toFixed(2)}</FeeLabelValue>
          </FeeLabel>
        </FeeLabelGroup>
        <EditField>
          <TextLabel>Stop loss</TextLabel>
          <StopLossAction>
            <TigrisInput label="Stop Loss" placeholder="-" value={editState.stopLoss} setValue={handleEditSL} />
            {isConnected ? (
              <>
                <ApplyButton disabled={
                  editState.stopLoss === '' && position?.slPrice === "0" ? true :
                  editState.stopLoss === (parseFloat(position?.slPrice)/1e18).toPrecision(7)
                  }
                  variant="contained"
                  onClick={() => handleUpdateSL()}
                  >
                  Apply
                </ApplyButton>
              </>
            ) : (
              ''
            )}
          </StopLossAction>
        </EditField>
        <EditField>
          <TextLabel>Take profit</TextLabel>
          <StopLossAction>
            <TigrisInput label="Take Profit" placeholder="-" value={editState.profit} setValue={handleEditTP} />
            {isConnected ? (
              <>
                <ApplyButton disabled={
                  editState.profit === '' && position?.tpPrice === "0" ? true :
                  editState.profit === (parseFloat(position?.tpPrice)/1e18).toPrecision(7)
                  }
                  variant="contained"
                  onClick={() => handleUpdateTP()}
                  >
                  Apply
                </ApplyButton>
              </>
            ) : (
              ''
            )}
          </StopLossAction>
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
            <TigrisInput
              label="%"
              value={editState.partialPro}
              setValue={handleEditPartialPro}
            />
            <ClosePositionButton onClick={() => handlePartialClose()}>Close Position</ClosePositionButton>
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
            <TigrisInputContainer>
              <TigrisInput
                label="Margin"
                placeholder="-"
                value={editState.addNum}
                setValue={handleEditAddNum}
              />
            </TigrisInputContainer>
          </FieldAction>
        </EditField>
        <FieldLabel>
          <TextLabel>New margin</TextLabel>
          <SecondaryLabel>
          {
            isState ?
              editState.addNum !== "" ? 
                (editState.addDrop === "Add" ? (parseFloat(position.margin)/1e18 + parseFloat(editState.addNum)) : (parseFloat(position.margin)/1e18 - parseFloat(editState.addNum))).toFixed(2)
              :
                (parseFloat(position.margin)/1e18).toFixed(2)
            :
              ""
          }
          </SecondaryLabel>
        </FieldLabel>
        <FieldLabel>
          <TextLabel>New leverage</TextLabel>
          <SecondaryLabel>
          {
            isState ?
              editState.addNum !== "" ? 
                (editState.addDrop === "Add" ?
                  ((parseFloat(position.margin)/1e18)*(parseFloat(position.leverage)/1e18)/((parseFloat(position.margin)/1e18)+parseFloat(editState.addNum))).toFixed(2)
                    :
                  ((parseFloat(position.margin)/1e18)*(parseFloat(position.leverage)/1e18)/((parseFloat(position.margin)/1e18)-parseFloat(editState.addNum))).toFixed(2)
                )
              :
                (parseFloat(position.leverage)/1e18).toFixed(2)
            :
              ""
          }
          </SecondaryLabel>
        </FieldLabel>
        <AddMarginButton variant="outlined" onClick={() => handleModifyMargin()}>{editState.addDrop + " margin"}</AddMarginButton>
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
            <TigrisInput
              label="Margin"
              placeholder="-"
              value={editState.position}
              setValue={handleEditPosition}
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
    </BootstrapDialog>
  );
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: '0 24px',
    width: '100%',
    paddingBottom: '24px'
  },
  '& .MuiDialogActions-root': {
    padding: '24px'
  },
  '& .MuiPaper-root': {
    backgroundImage: 'none',
    backgroundColor: '#18191D'
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

const TigrisInputContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    gridColumn: '1 / 3',
    marginTop: '10px'
  }
}));
