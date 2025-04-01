import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import { Box, Chip, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, AppState } from '../../store';
import { addSearchResults } from '../../store/searchReducer';
import { Loading } from '../shared/Loading';
import OrderSearchBar from '../shared/search/OrderSearchBar';
import { searchOrder } from '../shared/search/search-order-fn';
import { SearchResult } from './SearchResult';

import { Order } from '@umzug-meister/um-core';

export function OrderSearchDialogContent({ onClose }: Readonly<{ onClose: () => void }>) {
  const [results, setResults] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const onSearchFn = searchOrder(() => setLoading(false));
  const dispatch = useDispatch<AppDispatch>();

  const onSearch = (searchValue: string) => {
    if (searchValue) {
      setLoading(true);
      onSearchFn(searchValue).then((results) => {
        setResults(results);
        dispatch(addSearchResults({ searchValue }));
      });
    }
  };

  const appSearch = useSelector<AppState, string[]>((s) => s.search.all);

  const onClear = () => {
    if (results.length > 0) {
      setResults([]);
    } else {
      onClose();
    }
  };

  return (
    <>
      <DialogTitle>
        <OrderSearchBar onSearch={onSearch} onClear={onClear} />
      </DialogTitle>
      <DialogContent>
        <Loading open={loading} />
        <Box display="flex" flexDirection={'column'} gap={1}>
          {results.length === 0 && (
            <Stack direction="row" spacing={2}>
              {appSearch.map((searchValue) => (
                <Chip
                  color="primary"
                  variant="outlined"
                  size="small"
                  label={searchValue}
                  key={searchValue}
                  icon={<HistoryOutlinedIcon />}
                  onClick={() => onSearch(searchValue)}
                />
              ))}
            </Stack>
          )}
          <Box>
            {results.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                Keine Ergebnisse
              </Typography>
            )}
            <Box display="flex" flexDirection={'column'} gap={1}>
              {results.map((order) => (
                <SearchResult key={order.id} order={order} />
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </>
  );
}
