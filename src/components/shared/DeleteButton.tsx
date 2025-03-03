import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import { IconButton } from '@mui/material';

interface Props {
  onDelete(): void;
}

export function DeleteButton({ onDelete }: Readonly<Props>) {
  return (
    <IconButton onClick={onDelete} color="error">
      <DeleteOutlined />
    </IconButton>
  );
}
