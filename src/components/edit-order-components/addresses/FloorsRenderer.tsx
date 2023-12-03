import { Chip, Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import { Order } from 'um-types';
import { AppState } from '../../../store';

interface Props {
  path: 'from' | 'to';
}

export const FloorsRenderer = ({ path }: Props) => {
  const order = useSelector<AppState, Order | null>((s) => s.app.current);

  if (order == null) {
    return null;
  }

  if (order[path]?.stockwerke) {
    return (
      <Stack direction="row" spacing={2}>
        {order[path]?.stockwerke?.map((s) => <Chip key={s} label={s} />)}
      </Stack>
    );
  }
  return null;
};
