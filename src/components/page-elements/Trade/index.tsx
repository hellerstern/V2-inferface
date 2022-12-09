import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/system';

import { BtcImg } from 'src/config/images';

import { AiFillStar } from 'react-icons/ai';
import { Container } from 'src/components/Container';
import usePreventBodyScroll from 'src/hook/usePreventBodyScroll';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import { LeftArrow, RightArrow } from './arrow';

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

const INFOS: any = [
  { name: 'Price', value: '$44,44k', label: '' },
  { name: 'Daily Change', value: '+2.22%', label: '', active: true },
  { name: '24h Volume', value: '$300,000.0', label: '' },
  { name: 'Avg. 1h Funding Rate', value: '0.0006% (4.96%)', label: '' },
  { name: 'Open Interest', value: '1.234.45 BTC', label: '' },
  { name: 'Long Funding Fee', value: '0,456472% Per Hour', label: '' },
  { name: 'Short Funding Fee', value: '0,456472% Per Hour', label: '' },
  { name: 'Opening', value: '0% ($0.00)', label: '' },
  { name: 'Closing', value: '0.6% ($0.00)', label: '' },
  { name: 'Long Open interest', value: '0/ ', label: 'Unlimited' },
  { name: 'Short Open interest', value: '0/ ', label: 'Unlimited' }
];

export const Trade = () => {
  function onWheel(apiObj: scrollVisibilityApiType, ev: React.WheelEvent): void {
    const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

    if (isThouchpad) {
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
  // const visibility = React.useContext(VisibilityContext);

  return (
    <TradeContainer>
      <Container>
        <TradeWrapper>
          <KindOfToken>
            <Tokens>
              <img src={BtcImg} alt="btc-img" />
              <span className="token-name">BTC/USDT</span>
              <Box className="multi-value">
                <span>20X</span>
              </Box>
            </Tokens>
            <AiFillStar />
          </KindOfToken>
          <DesktopStatusInfos onMouseEnter={disableScroll} onMouseLeave={enableScroll}>
            <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow} onWheel={onWheel}>
              {INFOS.map((item: any, index: number) => (
                <Box className="index-info" key={index}>
                  <p className="title">{item.name}</p>
                  <p className="value" style={{ color: item.active === true ? '#6FCF97' : '#E5E3EC' }}>
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
                <p className="value" style={{ color: item.active === true ? '#6FCF97' : '#E5E3EC' }}>
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
  width: '1440px',
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
    border: '1px solid #3772FF',
    borderRadius: '4px',
    width: '30px',
    height: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    span: {
      fontWeight: '700',
      fontSize: '12px',
      lineHeight: '9px',
      background: 'linear-gradient(180deg, #D737FF 0%, #3772FF 100%)',
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
      fontWeight: '400',
      fontSize: '10px',
      lineHeight: '12px',
      fontFamily: 'DMSans-Regular',
      whiteSpace: 'nowrap'
    },
    '.value': {
      fontWeight: '700',
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
  height: '100%',
  gridTemplateColumns: 'auto auto auto',
  [theme.breakpoints.down('md')]: {
    display: 'grid',
    gap: '1rem'
  },
  [theme.breakpoints.down('xs')]: {
    gridTemplateColumns: 'auto auto'
  },
  '.index-info': {
    padding: '0 11px',
    '.title': {
      color: '#D2CEDE',
      fontWeight: '400',
      fontSize: '10px',
      lineHeight: '12px',
      fontFamily: 'DMSans-Regular',
      whiteSpace: 'nowrap'
    },
    '.value': {
      fontWeight: '700',
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
