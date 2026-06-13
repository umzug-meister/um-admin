import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { IconButton, IconButtonProps } from '@mui/material';

export default function AddButton(props: IconButtonProps) {
  return (
    <IconButton color="primary" sx={{ alignSelf: 'flex-start' }} {...props}>
      <AddCircleOutlineOutlinedIcon />
    </IconButton>
  );
}
