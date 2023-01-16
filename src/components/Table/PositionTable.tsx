import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Input from '@mui/material/Input';
import Box from '@mui/material/Box';
import { styled } from '@mui/system';
import { Close, Edit } from '@mui/icons-material';
import { AiFillEye } from 'react-icons/ai';
import { EditModal } from '../Modal/EditModal';
import { useAccount, useNetwork } from 'wagmi';
import { getNetwork } from "../../../src/constants/networks";
import { ethers } from 'ethers';
import { getShellWallet, getShellAddress, getShellBalance, getShellNonce, unlockShellWallet } from '../../../src/shell_wallet/index';
import { oracleData, oracleSocket } from 'src/context/socket';
import { toast } from 'react-toastify';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#23262F'
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  },
  '.ActionField': {
    visibility: 'hidden'
  },
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#777E90',
    '.MuiTableCell-root': {
      color: '#FFFFFF'
    },
    '.ActionField': {
      visibility: 'visible'
    }
  }
}));

interface IPositionTable {
  tableType: number; // 0 is your market, 1 is your limit, 2 is all
  setPairIndex: any;
  positionData: any;
  isAfterFees: boolean;
}

export const PositionTable = ({ tableType, setPairIndex, positionData, isAfterFees }: IPositionTable) => {

  const [data, setData] = useState<any>(null);
  useEffect(() => {
    oracleSocket.on('data', (data: any) => {
      setData(data);
    })
  }, []);

  const openPositions = positionData.openPositions;
  const limitOrders = positionData.limitOrders;
  const allPositions = positionData.allPositions;

  const { address } = useAccount();
  const { chain } = useNetwork();

  const [forceRerender, setForceRerender] = useState(Math.random());
  useEffect(() => {
    setForceRerender(Math.random());
  }, [positionData]);

  const [clickedPosition, setClickedPosition] = useState<any>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const handleClickEditOpen = (position: any) => {
    setClickedPosition(position);
    setEditModalOpen(true);
  };

  async function getTradingContract() {
    const currentNetwork = getNetwork(chain === undefined ? 0 : chain.id);
    const signer = await getShellWallet();
    return new ethers.Contract(currentNetwork.addresses.trading, currentNetwork.abis.trading, signer);
  }

  function handleClosePositionClick(position: any) {
    closePosition(position);
  }
  async function closePosition(position: any) {
    try {
      const currentNetwork = getNetwork(chain === undefined ? 0 : chain.id);
      const _oracleData: any = oracleData[position.asset];
      const tradingContract = await getTradingContract();
      const gasPriceEstimate = Math.round((await tradingContract.provider.getGasPrice()).toNumber() * 1.5);

      const tx = tradingContract.initiateCloseOrder(
        position.id,
        10000000000,
        [_oracleData.provider, position.asset, _oracleData.price, _oracleData.spread, _oracleData.timestamp, _oracleData.isClosed],
        _oracleData.signature,
        currentNetwork.addresses.tigusdvault,
        currentNetwork.addresses.tigusd,
        address,
        { gasPrice: gasPriceEstimate, gasLimit: currentNetwork.gasLimit, value: 0, nonce: await getShellNonce() }
      );
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
    } catch (err) {
      console.log(err);
    }
  }

  function handleCancelOrderClick(id: number) {
    cancelOrder(id);
  }
  async function cancelOrder(id: number) {
    try {
      const currentNetwork = getNetwork(chain === undefined ? 0 : chain.id);
      const tradingContract = await getTradingContract();
      const gasPriceEstimate = Math.round((await tradingContract.provider.getGasPrice()).toNumber() * 1.5);

      const tx = tradingContract.cancelLimitOrder(
        id,
        address,
        { gasPrice: gasPriceEstimate, gasLimit: currentNetwork.gasLimit, value: 0, nonce: await getShellNonce() }
      );
      const response: any = await toast.promise(
        tx,
        {
          pending: 'Cancelling limit order...',
          success: undefined,
          error: 'Cancelling limit order failed!'
        }
      );
      // eslint-disable-next-line
      setTimeout(async () => {
        const receipt = await tradingContract.provider.getTransactionReceipt(response.hash);
        if (receipt.status === 0) {
          toast.error(
            'Cancelling limit order failed!'
          );
        }
      }, 1000);
    } catch (err) {
      console.log(err);
    }
  }

  function handleUpdateTPSLChange(position: any, isTP: boolean, limitPrice: string) {
    updateTPSL(position, isTP, limitPrice);
  }
  async function updateTPSL(position: any, isTP: boolean, limitPrice: string) {
    try {
      const currentNetwork = getNetwork(chain === undefined ? 0 : chain.id);
      const _oracleData: any = oracleData[position.asset];
      const tradingContract = await getTradingContract();
      const gasPriceEstimate = Math.round((await tradingContract.provider.getGasPrice()).toNumber() * 1.5);
      const price = ethers.utils.parseEther(parseFloat(limitPrice).toString());

      if (isTP) {
        if (position.direction) {
          if (parseFloat(price.toString()) < parseFloat(_oracleData.price) && parseFloat(price.toString()) !== 0) {
            toast.warning("Take profit too low");
            setForceRerender(Math.random());
            return;
          }
        } else {
          if (parseFloat(price.toString()) > parseFloat(_oracleData.price) && parseFloat(price.toString()) !== 0) {
            toast.warning("Take profit too high");
            setForceRerender(Math.random());
            return;
          }
        }
      } else {
        if (position.direction) {
          if (parseFloat(price.toString()) > parseFloat(_oracleData.price) && parseFloat(price.toString()) !== 0) {
            toast.warning("Stop loss too high");
            setForceRerender(Math.random());
            return;
          }
          if (parseFloat(price.toString()) < parseFloat(position.liqPrice) && parseFloat(price.toString()) !== 0) {
            toast.warning("Stop loss past liquidation price!");
            setForceRerender(Math.random());
            return;
          }
        } else {
          if (parseFloat(price.toString()) < parseFloat(_oracleData.price) && parseFloat(price.toString()) !== 0) {
            toast.warning("Stop loss too low!");
            setForceRerender(Math.random());
            return;
          }
          if (parseFloat(price.toString()) > parseFloat(position.liqPrice) && parseFloat(price.toString()) !== 0) {
            toast.warning("Stop loss past liquidation price!");
            setForceRerender(Math.random());
            return;
          }
        }
      }

      const tx = tradingContract.updateTpSl(
        isTP,
        position.id,
        price,
        [_oracleData.provider, position.asset, _oracleData.price, _oracleData.spread, _oracleData.timestamp, _oracleData.isClosed],
        _oracleData.signature,
        address,
        { gasPrice: gasPriceEstimate, gasLimit: currentNetwork.gasLimit, value: 0, nonce: await getShellNonce() }
      );
      const response: any = await toast.promise(
        tx,
        {
          pending: isTP ? 'Updating take profit...' : 'Updating stop loss...',
          success: undefined,
          error: isTP ? 'Updating take profit failed!' : 'Updating stop loss failed!'
        }
      );
      // eslint-disable-next-line
      setTimeout(async () => {
        const receipt = await tradingContract.provider.getTransactionReceipt(response.hash);
        if (receipt.status === 0) {
          toast.error(
            isTP ? 'Updating take profit failed!' : 'Updating stop loss failed!'
          );
        }
      }, 1000);
    } catch (err) {
      console.log(err);
    }
  }

  function pnlPercent(position: any, cPrice: any, isAfterFees: any) {

    const interest = position.accInterest/1e18;
    const leverage = position.leverage/1e18;
    const margin = position.margin/1e18;
    const openPrice = position.price/1e18;
  
    let fee:any;
    if (isAfterFees) {
        fee = (margin*leverage*cPrice/openPrice) * 0.001;
    } else {
        fee = 0;
    }
  
    const payoutAfterFee:number = position.direction ? (margin + (cPrice/openPrice-1)*leverage*margin+interest-fee) : (margin + (openPrice/cPrice-1)*leverage*margin+interest-fee);
  
    let pnlPercent = ((payoutAfterFee)/margin-1)*100;
    if (pnlPercent > 500) {
        pnlPercent = 500;
    }
    return (
      <div style={{color: pnlPercent >= 0 ? '#26a69a' : '#EF5350'}}>
      {payoutAfterFee.toFixed(2) + " (" + pnlPercent.toFixed(2) + "%)"}
      </div>
    );
  }

  return (
    <TableContainer>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>L/S</TableCell>
            <TableCell>Pair</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Margin</TableCell>
            <TableCell>Leverage</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>PnL</TableCell>
            <TableCell>Take Profit</TableCell>
            <TableCell>Stop Loss</TableCell>
            <TableCell>Liq</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <CustomTableBody key={forceRerender}>
          {(tableType === 0 ? openPositions : limitOrders).map((position: any) => (
            <StyledTableRow key={position.id} onClick={() => setPairIndex(position.asset)}>
              <TableCell>
                <TableCellContainer>
                  <VisibilityBox>
                    <AiFillEye style={{ fontSize: '12px', marginLeft: '0.5px' }} />
                  </VisibilityBox>{' '}
                  {position.trader.slice(0, 6)}
                </TableCellContainer>
              </TableCell>
              <TableCell style={{ color: position.direction ? '#26a69a' : '#EF5350' }}>{position.direction ? "Long" : "Short"}</TableCell>
              <TableCell>{getNetwork(chain?.id).assets[position.asset].name}</TableCell>
              <TableCell>{((position.margin / 1e18) * (position.leverage / 1e18)).toFixed(2)}</TableCell>
              <TableCell>{(position.margin / 1e18).toFixed(2)}</TableCell>
              <TableCell>{(position.leverage / 1e18).toFixed(2)}x</TableCell>
              <TableCell>{(position.price / 1e18).toPrecision(6)}</TableCell>
              <TableCell style={{width: '135px'}}>{(data[position.asset]?.price) ? pnlPercent(position, data[position.asset].price/1e18, isAfterFees) : "Loading..."}</TableCell>
              <TableCell>
                <InputStore
                  handleUpdateTPSLChange={handleUpdateTPSLChange}
                  position={position}
                  isTP={true}
                />
              </TableCell>
              <TableCell>
                <InputStore
                  handleUpdateTPSLChange={handleUpdateTPSLChange}
                  position={position}
                  isTP={false}
                />
              </TableCell>
              <TableCell>{(position.liqPrice / 1e18).toPrecision(7)}</TableCell>
              <TableCell>
                <ActionContainer className="ActionField">
                  {
                  tableType === 0 ?
                  <EditButton onClick={(e) => {
                    handleClickEditOpen(position);
                    e.stopPropagation();
                  }}>
                    <SmallText>Edit</SmallText>
                    <Edit sx={{ fontSize: '18px' }} />
                  </EditButton>
                  :
                  <></>
                  }
                  <CloseButton onClick={(e) => {
                    tableType === 0 ? handleClosePositionClick(position) : handleCancelOrderClick(position.id);
                    e.stopPropagation();
                  }}>
                    {tableType === 0 ? "Close" : "Cancel"}
                    <Close sx={{ fontSize: '18px' }} />
                  </CloseButton>
                </ActionContainer>
              </TableCell>
            </StyledTableRow>
          ))}
        </CustomTableBody>
      </Table>
      <EditModal isState={isEditModalOpen} setState={setEditModalOpen} position={clickedPosition}/>
    </TableContainer>
  );
};

interface IInputStore {
  handleUpdateTPSLChange: any;
  position: any;
  isTP: boolean;
}
const InputStore = ({ handleUpdateTPSLChange, position, isTP }: IInputStore) => {

  const [tpsl, setTpsl] = useState(((isTP ? position.tpPrice : position.slPrice) / 1e18).toPrecision(7));

  return (
    <Input
      sx={{
        fontSize: '12px',
        width: '60px',
        color: 'inherit'
      }}
      type="text"
      disableUnderline={true}
      placeholder={"None"}
      value={parseFloat(tpsl) === 0 ? "" : tpsl}
      onChange={(e: any) => {
        setTpsl(e.currentTarget.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1').replace(/^0[^.]/, '0'));
      }}
      onKeyDown={(key) => {
        if (key.code === "Enter" && (isTP ? position.tpPrice : position.slPrice) !== tpsl) {
          handleUpdateTPSLChange(position, isTP, tpsl === "" ? "0" : tpsl);
        }
      }}
    />
  );

};

const TableContainer = styled(Box)(({ theme }) => ({
  fontSize: '12px',
  overflowX: 'auto',
  '.MuiTableCell-root': {
    fontSize: '12px',
    padding: '2.5px 10px !important'
  }
}));

const CustomTableBody = styled(TableBody)(({ theme }) => ({
  '.MuiTableCell-root': {
    color: '#B1B5C3'
  }
}));

const ActionContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '10px'
}));

const EditButton = styled(Box)(({ theme }) => ({
  background: 'transparent',
  color: '#FFF',
  textTransform: 'none',
  cursor: 'pointer',
  display: 'flex',
  gap: '6px',
  alignItems: 'center'
}));

const SmallText = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}));

const CloseButton = styled(Box)(({ theme }) => ({
  color: '#FA6060',
  background: 'transparent',
  textTransform: 'none',
  cursor: 'pointer',
  display: 'flex',
  gap: '6px',
  alignItems: 'center'
}));

const VisibilityBox = styled(Box)(({ theme }) => ({
  minWidth: '14px',
  maxWidth: '14px',
  minHeight: '14px',
  maxHeight: '14px',
  backgroundColor: 'rgba(225, 225, 225, 0.18)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}));

const TableCellContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '8px'
}));
