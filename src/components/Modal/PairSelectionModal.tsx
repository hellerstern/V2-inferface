import { Modal, Box, Menu } from '@mui/material';
import { styled } from '@mui/system';
import { PairSelectionTable } from '../PairSelectionTable';

interface PairModalProps {
  // isModalOpen: boolean;
  // setModalOpen: (value: boolean) => void;
  state: null | HTMLElement;
  setState: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  pairIndex: number;
  setPairIndex: (value: number) => void;
}

export const PairSelectionModal = (props: PairModalProps) => {
  const { state, setState, setPairIndex } = props;
  const isOpen = Boolean(state);
  const style = { outline: '0' };
  const handleClose = () => {
    setState(null);
  };
  return (
    <Menu
      anchorEl={state}
      id="account-menu"
      open={isOpen}
      onClose={handleClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <PairTableContainer sx={style}>
        <PairSelectionTable isMobile={true} onClose={handleClose} setPairIndex={setPairIndex} />
      </PairTableContainer>
    </Menu>
  );
};

const PairTableContainer = styled(Box)(({ theme }) => ({
  width: '400px',
  minHeight: '560px',
  overflow: 'auto',
  [theme.breakpoints.down(400)]: {
    maxWidth: '100%',
    minHeight: '100%'
  }
}));
