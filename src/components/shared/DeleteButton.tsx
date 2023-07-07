import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import { IconButton } from '@mui/material';

interface Props {
  onDelete(): void;
}

export function DeleteButton({ onDelete }: Props) {
  return (
    <IconButton onClick={onDelete} color="error">
      <DeleteOutlined />
    </IconButton>
  );
}
