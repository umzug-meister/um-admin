import { Box, Chip, DialogContent, Typography } from '@mui/material';
import OrderSearchBar from '../shared/search/OrderSearchBar';
import { useCallback } from 'react';
import { useOrderSearch } from '../shared/search/orderSearchQuery';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, AppState } from '../../store';
import { addSearchResults, AppSearch } from '../../store/searchReducer';

export function OrderSearchDialogContent() {
  const onFinally = () => {};
  const onSearchFn = useOrderSearch(onFinally);

  const dispatch = useDispatch<AppDispatch>();

  const onSearch = useCallback(
    (searchValue: string) => {
      onSearchFn(searchValue).then((results) => {
        dispatch(addSearchResults({ results, searchValue }));
      });
    },
    [onSearchFn, dispatch],
  );

  const appSearch = useSelector<AppState, AppSearch>((s) => s.search);

  const lastSeatch = Object.keys(appSearch);

  return (
    <DialogContent>
      <Box display="flex" flexDirection={'column'} gap={2}>
        <Box>
          <OrderSearchBar onSearch={onSearch} />
        </Box>
        <Box>
          <Typography variant="overline" color="secondary">
            Zuletzt gesucht:
          </Typography>
          <Box display="flex">
            {lastSeatch.map((key) => (
              <Chip label={key}></Chip>
            ))}
          </Box>
        </Box>
        <Box>
          <Typography variant="overline" color="secondary">
            Ergebnisse:
          </Typography>
        </Box>
      </Box>
    </DialogContent>
  );
}
