import { useEffect, useState, useRef } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/system';

import * as logos from '../../../src/config/images';

import { AiFillStar } from 'react-icons/ai';
import { Container } from '../../../src/components/Container';
import usePreventBodyScroll from '../../../src/hook/usePreventBodyScroll';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import { LeftArrow, RightArrow } from './arrow';
import { getNetwork } from '../../../src/constants/networks';
import { oracleSocket } from '../../../src/context/socket';
import { PairSelectionModal } from '../Modal/PairSelectionModal';

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

interface ITokenDetails {
  pairIndex: number;
  setPairIndex: (value: number) => void;
  maxOi: any;
  longOi: any;
  shortOi: any;
  openFee: any;
  closeFee: any;
  longAPRHourly: any;
  shortAPRHourly: any;
  maxLev: any;
}

export const TokenDetails = ({
  pairIndex,
  setPairIndex,
  maxOi,
  longOi,
  shortOi,
  openFee,
  closeFee,
  longAPRHourly,
  shortAPRHourly,
  maxLev
}: ITokenDetails) => {
  const [isPairModalOpen, setPairModalOpen] = useState(false);
  const LogoArray = [
    logos.btcLogo,
    logos.ethLogo,
    logos.goldLogo,
    logos.maticLogo,
    logos.linkLogo,
    logos.eurLogo,
    logos.gbpLogo,
    logos.btcLogo, // jpy
    logos.btcLogo, // rub
    logos.btcLogo, // chf
    logos.btcLogo, // cad
    logos.ethLogo, // eth/btc
    logos.xrpLogo,
    logos.bnbLogo,
    logos.adaLogo,
    logos.atomLogo,
    logos.btcLogo, // hbar
    logos.btcLogo, // tron
    logos.solLogo,
    logos.dogeLogo,
    logos.ltcLogo,
    logos.bchLogo,
    logos.btcLogo, // etc
    logos.dotLogo,
    logos.xmrLogo,
    logos.btcLogo, // shib
    logos.avaxLogo,
    logos.uniLogo,
    logos.btcLogo, // xlm
    logos.nearLogo,
    logos.algoLogo,
    logos.btcLogo, // icp
    logos.silverLogo, // xag
    logos.linkLogo, // link/btc
    logos.xmrLogo // xmr/btc
  ];

  useEffect(() => {
    oracleSocket.on('data', (data: any) => {
      setOracleData(data);
    });
  }, []);

  const [oracleData, setOracleData] = useState(Array(35).fill({ price: '0', spread: '0' }));

  const INFOS: any = [
    {
      name: 'Oracle Price',
      value: oracleData[pairIndex]
        ? (parseInt(oracleData[pairIndex].price) / 1e18).toFixed(getNetwork(0).assets[pairIndex].decimals)
        : 'Loading...',
      label: ''
    },
    {
      name: 'Price Spread',
      value:
        oracleData[pairIndex] != null
          ? ((oracleData[pairIndex].spread as unknown as number) / 1e8).toFixed(3) + '%'
          : '0.000%',
      label: ''
    },
    {
      name: 'Long Open Interest',
      value: (longOi / 1e18).toFixed(0) + '/',
      label: maxOi.toString() === '0' ? 'Unlimited' : (maxOi / 1e18).toString()
    },
    {
      name: 'Short Open Interest',
      value: (shortOi / 1e18).toFixed(0) + '/',
      label: maxOi.toString() === '0' ? 'Unlimited' : (maxOi / 1e18).toString()
    },
    { name: 'Opening Fee', value: openFee, label: '' },
    { name: 'Closing Fee', value: closeFee, label: '' },
    {
      name: 'Long Funding Fee',
      value: (longAPRHourly.toFixed(5).replace('NaN', '0').replace('Infinity', 'ထ') as string) + '% Per Hour',
      label: '',
      active: longAPRHourly > 0 ? 2 : 1
    },
    {
      name: 'Short Funding Fee',
      value: (shortAPRHourly.toFixed(5).replace('NaN', '0').replace('Infinity', 'ထ') as string) + '% Per Hour',
      label: '',
      active: shortAPRHourly > 0 ? 2 : 1
    }
  ];

  function onWheel(apiObj: scrollVisibilityApiType, ev: React.WheelEvent): void {
    const isTouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

    if (isTouchpad) {
      ev.stopPropagation();
      return;
    }

    if (ev.deltaY < 0) {
      apiObj.scrollNext();
    } else if (ev.deltaY > 0) {
      apiObj.scrollPrev();
    }
  }
  const { disableScroll, enableScroll } = usePreventBodyScroll();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleTokenClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <TradeContainer>
      <Container>
        <TradeWrapper>
          <KindOfToken onClick={handleTokenClick}>
            <Tokens>
              <img src={LogoArray[pairIndex]} style={{ height: '28px' }} />
              <span className="token-name">{getNetwork(0).assets[pairIndex].name}</span>
              <Box className="multi-value">
                <span>{getNetwork(0).assets[pairIndex].maxLev}X</span>
              </Box>
            </Tokens>
            <AiFillStar />
          </KindOfToken>
          <PairSelectionModal
            state={anchorEl}
            setState={setAnchorEl}
            pairIndex={pairIndex}
            setPairIndex={setPairIndex}
          />
          <DesktopStatusInfos onMouseEnter={disableScroll} onMouseLeave={enableScroll}>
            <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow} onWheel={onWheel}>
              {INFOS.map((item: any, index: number) => (
                <Box className="index-info" key={index}>
                  <p className="title">{item.name}</p>
                  <p
                    className="value"
                    style={{ color: item.active === 1 ? '#26A69A' : item.active === 2 ? '#EF534F' : '#E5E3EC' }}
                  >
                    {item.value}
                    <span>{item.label}</span>
                  </p>
                </Box>
              ))}
            </ScrollMenu>
          </DesktopStatusInfos>
          <MobileStatusInfos>
            {INFOS.map((item: any, index: number) => (
              <Box className="index-info" key={index}>
                <p className="title">{item.name}</p>
                <p
                  className="value"
                  style={{ color: item.active === 1 ? '#26A69A' : item.active === 2 ? '#EF534F' : '#E5E3EC' }}
                >
                  {item.value}
                  <span>{item.label}</span>
                </p>
              </Box>
            ))}
          </MobileStatusInfos>
        </TradeWrapper>
      </Container>
    </TradeContainer>
  );
};

const TradeContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  backgroundColor: '#18191D',
  // height: '63px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}));

const TradeWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  maxWidth: '1440px',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

const KindOfToken = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  padding: '15px 15px 15px 0',
  cursor: 'pointer',
  borderRight: '1px solid #23262F',
  [theme.breakpoints.down('md')]: {
    justifyContent: 'space-between',
    width: '100%',
    borderRight: 'none',
    borderBottom: '1px solid #23262F'
  },
  svg: {
    color: '#FABE3C'
  }
}));

const Tokens = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  '.token-name': {
    color: '#E5E3EC',
    fontWeight: '700',
    fontSize: '18px',
    lineHeight: '32px'
  },
  '.multi-value': {
    borderImage: 'linear-gradient(150deg, #3772FF 10%, #D737FF 100%)',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderRadius: '4px',
    borderImageSlice: 1,
    height: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    span: {
      marginLeft: '4px',
      marginRight: '4px',
      fontWeight: '700',
      fontSize: '11px',
      lineHeight: '9px',
      background: '#FFFFFF',
      backgroundClip: 'text',
      textFillColor: 'transparent'
    }
  }
}));

const DesktopStatusInfos = styled(Box)(({ theme }) => ({
  height: '100%',
  width: 'calc(96vw - 206.2px)',
  [theme.breakpoints.down('md')]: {
    display: 'none'
  },
  '.index-info': {
    padding: '0 11px',
    borderRight: '1px solid #23262F',
    '.title': {
      color: '#D2CEDE',
      fontSize: '10px',
      lineHeight: '12px',
      fontFamily: 'DMSans-Regular',
      whiteSpace: 'nowrap'
    },
    '.value': {
      fontSize: '12px',
      lineHeight: '16px',
      fontFamily: 'DMSans-Regular',
      margin: '3px 0',
      whiteSpace: 'nowrap',
      span: {
        color: 'rgba(229, 227, 236, 0.47)'
      }
    }
  }
}));

const MobileStatusInfos = styled(Box)(({ theme }) => ({
  padding: '15px',
  display: 'none',
  width: '100%',
  gridTemplateColumns: 'auto auto auto',
  [theme.breakpoints.down('md')]: {
    display: 'grid',
    gap: '1rem'
  },
  [theme.breakpoints.down('xs')]: {
    gridTemplateColumns: 'auto auto'
  },
  '.index-info': {
    maxHeight: '35px',
    padding: '0 11px',
    '.title': {
      color: '#D2CEDE',
      fontSize: '10px',
      lineHeight: '12px',
      fontFamily: 'DMSans-Regular',
      whiteSpace: 'nowrap'
    },
    '.value': {
      fontSize: '12px',
      lineHeight: '16px',
      fontFamily: 'DMSans-Regular',
      margin: '3px 0',
      whiteSpace: 'nowrap',
      span: {
        color: 'rgba(229, 227, 236, 0.47)'
      }
    }
  }
}));
