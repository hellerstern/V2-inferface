import { Star, StarBorder } from '@mui/icons-material';
import { Avatar, Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { styled } from '@mui/system';
import { BitcoinSvg, EtherLogoSvg, LunaLogoSvg, MinexLogo, XrpLogoSvg } from '../../config/images';

interface PairFieldProps {
  favor: boolean;
  icon: string;
  name: string;
}

function createData(pair: React.ReactElement, price: number, profit: React.ReactElement) {
  return {
    pair,
    price,
    profit
  };
}

const PairField = ({ favor, icon, name }: PairFieldProps) => {
  return (
    <PairFieldContainer>
      {favor ? (
        <Star sx={{ color: '#FABE3C', width: '20px', height: '20px' }} />
      ) : (
        <StarBorder sx={{ width: '20px', height: '20px' }} />
      )}
      <IconBox>
        <Avatar src={icon} sx={{ width: 15, height: 15 }} />
      </IconBox>
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
    <BenefitContainer sx={{ color: percent > 0 ? '#58BD7D' : '#D33535' }}>
      {percent > 0 ? `+${percent}` : percent.toFixed(2)}%<p>{value.toFixed(2)}</p>
    </BenefitContainer>
  );
};

const rows = [
  createData(
    <PairField favor={true} icon={MinexLogo} name={'BTC/USDT'} />,
    17810,
    <Benefit percent={0.63} value={110} />
  ),
  createData(
    <PairField favor={false} icon={BitcoinSvg} name={'BTC/USDT'} />,
    846,
    <Benefit percent={-6.62} value={-60.0} />
  ),
  createData(
    <PairField favor={false} icon={EtherLogoSvg} name={'ETH/USDT'} />,
    71729000,
    <Benefit percent={-1.95} value={-1421000} />
  ),
  createData(
    <PairField favor={false} icon={XrpLogoSvg} name={'XRP/USDT'} />,
    180,
    <Benefit percent={-12.08} value={-25} />
  ),
  createData(
    <PairField favor={false} icon={LunaLogoSvg} name={'LUNA/BNB'} />,
    3465,
    <Benefit percent={6.62} value={60.0} />
  ),
  createData(
    <PairField favor={false} icon={EtherLogoSvg} name={'ETH/USDT'} />,
    71729000,
    <Benefit percent={-1.95} value={-1421000} />
  ),
  createData(
    <PairField favor={false} icon={XrpLogoSvg} name={'XRP/USDT'} />,
    180,
    <Benefit percent={-12.08} value={-25.0} />
  ),
  createData(
    <PairField favor={false} icon={LunaLogoSvg} name={'LUNA/BNB'} />,
    3465,
    <Benefit percent={6.62} value={60.0} />
  )
];

export const USDPairsTable = () => {
  return (
    <Table aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell sx={{ color: '#777E90' }}>Pair</TableCell>
          <TableCell sx={{ color: '#777E90' }}>Current Price</TableCell>
          <TableCell align="center" sx={{ color: '#777E90' }}>
            24h
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, index) => (
          <CustomTableRow key={index}>
            <TableCell>{row.pair}</TableCell>
            <TableCell align="center">{row.price}</TableCell>
            <TableCell align="center">{row.profit}</TableCell>
          </CustomTableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const PairFieldContainer = styled(Box)({
  display: 'flex',
  gap: '10px',
  alignItems: 'center'
});

const IconBox = styled(Box)({
  width: '24px',
  height: '24px',
  borderRadius: '100px',
  backgroundColor: '#FFFFFF',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
});

const CoinName = styled(Box)({
  fontWeight: 700,
  fontSize: '12px',
  letterSpacing: '1.25px'
});

const BenefitContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '3px',
  fontSize: '12px',
  fontWeight: 400
});

const CustomTableRow = styled(TableRow)({
  '&:hover': { backgroundColor: '#1E1F25' }
});
