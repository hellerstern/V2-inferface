import { Star, StarBorder } from '@mui/icons-material';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { useEffect, useState } from 'react';
import { ethLogo, linkLogo, xmrLogo } from '../../config/images';
import { getNetwork } from "src/constants/networks";
import { oracleSocket } from 'src/context/socket';

function createData(pair: React.ReactElement, price: number, profit: React.ReactElement, pairIndex: number) {
  return {
    pair,
    price,
    profit,
    pairIndex
  };
}

interface PairFieldProps {
  favor: boolean;
  handleFavoriteToggle: any;
  icon: string;
  name: string;
}
const PairField = ({ favor, handleFavoriteToggle, icon, name }: PairFieldProps) => {

  const handleStarClick = (event: React.MouseEvent, setFav: boolean) => {
    handleFavoriteToggle(name, setFav);
    event.stopPropagation();
  }

  return (
    <PairFieldContainer>
      {favor ? (
        <IconButton onClick={(e) => {
            handleStarClick(e, false)
          }} sx={{padding: '0px'}}>
          <Star sx={{ color: '#FABE3C', width: '20px', height: '20px' }}/>
        </IconButton>
      ) : (
        <IconButton onClick={(e) => {
            handleStarClick(e, true)
          }} sx={{padding: '0px'}}>
          <StarBorder sx={{ width: '20px', height: '20px' }}/>
        </IconButton>
      )}
      <img src={icon} style={{maxHeight: '24px'}}/>
      <CoinName>{name}</CoinName>
    </PairFieldContainer>
  );
};

interface BenefitProps {
  percent: number;
  value: number;
}

const Benefit = ({ percent, value }: BenefitProps) => {
  return (
    <BenefitContainer sx={{ color: percent > 0 ? '#26A69A' : '#EF534F' }}>
      {percent > 0 ? `+${percent}` : percent.toFixed(2)}%<p>{value.toFixed(2)}</p>
    </BenefitContainer>
  );
};

interface Props {
  setPairIndex: any;
  searchQuery: any;
}

interface PriceCellProps {
  setPairIndex: any;
  pairIndex: any;
}

export const PriceCell = ({setPairIndex, pairIndex}: PriceCellProps) => {
  useEffect(() => {
    oracleSocket.on('data', (data: any) => {
      if (data[pairIndex] != null && data[pairIndex].price !== oraclePrice) {
        setOraclePrice(data[pairIndex].price);
      }
    });
  }, []);
  
  const [oraclePrice, setOraclePrice] = useState(0);

  return (
    <>
    <TableCell align="center" sx={{ width: '125px' }} onClick={() => setPairIndex(pairIndex)}>
      {(oraclePrice/1e18).toFixed(getNetwork(0).assets[pairIndex].decimals)}
    </TableCell>
    </>
  )
}

function sortFavorites(a: any, b: any) {
  if (a.pair.props.favor === b.pair.props.favor) {
    return 0;
  }
  if (a.pair.props.favor) {
    return -1;
  }
  return 1;
}

export const BTCPairsTable = ({setPairIndex, searchQuery}: Props) => {

  const [FavPairs, setFavPairs] = useState<string[]>(
    JSON.parse(localStorage.getItem("FavPairs") === null ? '["BTC/USD", "ETH/USD"]' : localStorage.getItem("FavPairs") as string) as string[]
  );

  function handleFavoriteToggle(name: string, setFav: boolean) {
    const favPairs: any = JSON.parse(localStorage.getItem("FavPairs") as string);
    if (setFav) {
      favPairs.push(name);
    } else {
      favPairs.splice(FavPairs.indexOf(name), 1);
    }
    localStorage.setItem("FavPairs", JSON.stringify(favPairs));
    setFavPairs(favPairs);
  }

  const rows = [
    createData(
      <PairField favor={FavPairs.includes('ETH/BTC')} handleFavoriteToggle={handleFavoriteToggle} icon={ethLogo} name={'ETH/BTC'} />,
      0,
      <Benefit percent={0.63} value={110} />,
      11
    ),
    createData(
      <PairField favor={FavPairs.includes('LINK/BTC')} handleFavoriteToggle={handleFavoriteToggle} icon={linkLogo} name={'LINK/BTC'} />,
      0,
      <Benefit percent={0.63} value={110} />,
      33
    ),
    createData(
      <PairField favor={FavPairs.includes('XMR/BTC')} handleFavoriteToggle={handleFavoriteToggle} icon={xmrLogo} name={'XMR/BTC'} />,
      0,
      <Benefit percent={0.63} value={110} />,
      34
    )
  ]
  .sort(sortFavorites)
  .filter(pair => (pair.pair.props.name).includes(searchQuery));

  return (
    <>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: '#777E90', width: '150px' }}>Pair</TableCell>
            <TableCell sx={{ color: '#777E90', width: '125px' }}>Current Price</TableCell>
            <TableCell align="center" sx={{ color: '#777E90' }}>
              24h
            </TableCell>
          </TableRow>
        </TableHead>
      </Table>
      <TbodyContainer>
        <Table sx={{ tableLayout: 'fixed' }}>
          <TableBody>
            {rows.map((row, index) => (
              <CustomTableRow key={index} onClick={() => setPairIndex(row.pairIndex)}>
                <TableCell sx={{ width: '150px' }}>{row.pair}</TableCell>
                <PriceCell setPairIndex={setPairIndex} pairIndex={row.pairIndex}/>
                <TableCell align="center">{row.profit}</TableCell>
              </CustomTableRow>
            ))}
          </TableBody>
        </Table>
      </TbodyContainer>
    </>
  );
};

const PairFieldContainer = styled(Box)({
  display: 'flex',
  gap: '10px',
  alignItems: 'center'
});

const CoinName = styled(Box)({
  fontWeight: 700,
  fontSize: '12px',
  letterSpacing: '1.25px',
  border: '10px solid rgba(0, 0, 0, 0)',
  marginLeft: '-10px'
});

const BenefitContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '3px',
  fontSize: '12px',
  fontWeight: 400
});

const CustomTableRow = styled(TableRow)({
  '&:hover': { backgroundColor: '#1E1F25', cursor: 'pointer' }
});

const TbodyContainer = styled(Box)(({ theme }) => ({
  height: '400px',
  overflowY: 'auto'
}));
