import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Box, Grid, IconButton, Typography } from '@mui/material';

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { useFurnitureSuggestions } from '../../../hooks/useFurnitureSuggestions';
import { pushItem } from '../../../store/appReducer';

import { Furniture } from '@umzug-meister/um-core';

export function FurnitureDialogContent() {
  const suggestions = useFurnitureSuggestions();

  const dispatch = useDispatch();

  const onAdd = useCallback(
    (item: Furniture) => {
      dispatch(pushItem({ item }));
    },
    [dispatch],
  );

  return (
    <Box p={2} sx={{ width: '600px' }}>
      <Box display={'flex'} gap={1} flexDirection={'column'}>
        {suggestions.map((f) => {
          return (
            <Grid container spacing={1} key={f.id}>
              <Grid size={4}>
                <Typography variant="subtitle2">{f.selectedCategory}</Typography>
              </Grid>
              <Grid size={6}>
                <Typography>{f.name}</Typography>
              </Grid>
              <Grid size={2} display={'flex'} justifyContent={'flex-end'}>
                <IconButton color="success" onClick={() => onAdd(f)}>
                  <AddCircleOutlineOutlinedIcon />
                </IconButton>
              </Grid>
            </Grid>
          );
        })}
      </Box>
    </Box>
  );
}
