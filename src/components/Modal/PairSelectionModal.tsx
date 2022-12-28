import { Modal, Box } from '@mui/material';
import { styled } from '@mui/system';
import { PairSelectionTable } from '../PairSelectionTable';

interface PairModalProps {
  isModalOpen: boolean;
  setModalOpen: (value: boolean) => void;
  pairIndex: number;
  setPairIndex: (value: number) => void;
}

export const PairSelectionModal = (props: PairModalProps) => {
  const { isModalOpen, setModalOpen, setPairIndex } = props;
  const style = {};
  return (
    <Modal
      keepMounted
      open={isModalOpen}
      onClose={() => setModalOpen(false)}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
    >
      <PairTableContainer sx={style}>
        <PairSelectionTable isMobile={true} onClose={() => setModalOpen(false)} setPairIndex={setPairIndex} />
      </PairTableContainer>
    </Modal>
  );
};

const PairTableContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '0',
  left: '0',
  width: '400px',
  minHeight: '560px',
  overflow: 'auto',
  [theme.breakpoints.down(400)]: {
    maxWidth: '320px'
  }
}));
