import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Box, Button, ButtonProps } from '@mui/material';

export default function AddButton(props: ButtonProps) {
  return (
    <Box display={'flex'} flexGrow={1}>
      <Button variant="contained" disableElevation {...props}>
        <AddOutlinedIcon />
      </Button>
    </Box>
  );
}
