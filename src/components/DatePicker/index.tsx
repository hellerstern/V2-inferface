import { Dayjs } from 'dayjs';
import { TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled } from '@mui/system';

interface DatePickerProps {
  value: Dayjs | null;
  setValue: (value: Dayjs | null) => void;
}

export const TigrisDatePicker = (props: DatePickerProps) => {
  const { value, setValue } = props;
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
        }}
        renderInput={(params) => <CustomTextField {...params} />}
      />
    </LocalizationProvider>
  );
};

const CustomTextField = styled(TextField)(({ theme }) => ({
  width: '130px',
  height: '20px',
  backgroundColor: '#222630',
  '& .MuiInputBase-root': {
    height: '20px',
    border: 'none'
  },
  '& .MuiInputBase-input': {
    padding: '4px 5px',
    border: 'none',
    fontSize: '12px',
    textTransform: 'uppercase'
  },
  svg: {
    width: '12px',
    height: '12px'
  }
}));
