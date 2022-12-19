import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right'
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0'
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5)
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
        // backgroundColor: 'none'
      }
    }
  }
}));

interface TokenDropProps {
  state: string;
  setState: (value: string) => void;
}

export const TokenDropMenu = (props: TokenDropProps) => {
  const { state, setState } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClicked = (e: React.MouseEvent<HTMLElement>) => {
    handleClose();
    setState(e.currentTarget.innerText);
  };

  //   const handleMenu = (func: () => void) => {
  //     func();
  //     handleClose();
  //   }

  return (
    <>
      <Dropdown
        id="demo-customized-button"
        aria-controls={isOpen ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
      >
        {state}
      </Dropdown>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button'
        }}
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <CustomMenuItem onClick={handleMenuClicked}>ETH/USDT</CustomMenuItem>
        <CustomMenuItem onClick={handleMenuClicked}>ADA/USDT</CustomMenuItem>
        <CustomMenuItem onClick={handleMenuClicked}>ALGO/USD</CustomMenuItem>
        <CustomMenuItem onClick={handleMenuClicked}>ATOM/USD</CustomMenuItem>
        <CustomMenuItem onClick={handleMenuClicked}>AVAX/USD</CustomMenuItem>
        <CustomMenuItem onClick={handleMenuClicked}>BCH/USD</CustomMenuItem>
        <CustomMenuItem onClick={handleMenuClicked}>BNB/USD</CustomMenuItem>
        <CustomMenuItem onClick={handleMenuClicked}>BNB/USD</CustomMenuItem>
        <CustomMenuItem onClick={handleMenuClicked}>DOGE/USD</CustomMenuItem>
      </StyledMenu>
    </>
  );
};

const Dropdown = styled(Button)({
  background: 'none',
  fontSize: '12px',
  color: '#FFFFFF',
  textTransform: 'none',
  paddingLeft: '0',
  '&:hover': {
    background: 'none'
  }
});

const CustomMenuItem = styled(MenuItem)(({ theme }) => ({
  fontSize: '12px'
}));
