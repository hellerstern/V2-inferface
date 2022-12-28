import { Modal } from '@mui/material';
import { Box } from '@mui/system';
import { PairSelectionTable } from '../PairSelectionTable';

interface PairModalProps {
  isModalOpen: boolean;
  setModalOpen: (value: boolean) => void;
  pairIndex: number;
  setPairIndex: (value: number) => void;
}

export const PairSelectionModal = (props: PairModalProps) => {
  const { isModalOpen, setModalOpen, setPairIndex } = props;
  const style = {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '400px',
    minHeight: '560px',
    overflow: 'auto'
  };
  return (
    <Modal
      keepMounted
      open={isModalOpen}
      onClose={() => setModalOpen(false)}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
    >
      <Box sx={style}>
        <PairSelectionTable isMobile={true} onClose={() => setModalOpen(false)} setPairIndex={setPairIndex} />
      </Box>
    </Modal>
  );
};
