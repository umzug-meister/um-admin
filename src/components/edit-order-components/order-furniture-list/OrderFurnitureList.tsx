import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { Box, Grid, IconButton, TextField, Typography } from '@mui/material';

import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useCurrentOrder } from '../../../hooks/useCurrentOrder';
import { AppDispatch } from '../../../store';
import { deleteItem, updateOrderItemColli } from '../../../store/appReducer';
import AddButton from '../../shared/AddButton';
import { AppDialog } from '../../shared/AppDialog';
import { FurnitureDialogContent } from './FurnitureDialogContent';

import { Furniture } from 'um-types';

export function OrderFurnitureList() {
  const dispatch = useDispatch<AppDispatch>();

  const [open, setOpen] = useState(false);

  const order = useCurrentOrder();

  const curItems = [...(order?.items || [])];

  const onDelete = useCallback(
    (item: Furniture) => {
      dispatch(deleteItem({ item }));
    },
    [dispatch],
  );

  const onUpdate = useCallback(
    ({ colli, item }: any) => {
      dispatch(updateOrderItemColli({ colli, item }));
    },
    [dispatch],
  );

  return (
    <>
      <AppDialog
        title="Hinzufügen"
        open={open}
        onRequestClose={() => {
          setOpen(false);
        }}
      >
        <FurnitureDialogContent />
      </AppDialog>
      <Box mb={2}>
        <AddButton
          onClick={() => {
            setOpen(true);
          }}
        />
      </Box>
      <Box sx={{ maxHeight: 'calc(100vh - 400px)', overflowY: 'auto' }}>
        <Grid alignItems="center" rowSpacing={0.5} container>
          {curItems.map((item, index) => {
            return (
              <React.Fragment key={`${item.name}-${index}-${item.selectedCategory}`}>
                <Grid item xs={1}>
                  <IconButton color="error" onClick={() => onDelete(item)}>
                    <ClearOutlinedIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={3}>
                  <Typography color="HighlightText">{item.selectedCategory}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>{item.name}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    sx={{
                      width: '60px',
                      '& .MuiInputBase-input': {
                        padding: '3px',
                      },
                    }}
                    inputProps={{
                      'data-hj-allow': '',
                    }}
                    size="small"
                    value={item.colli}
                    onChange={(ev) => onUpdate({ colli: ev.target.value, item })}
                  />
                </Grid>
              </React.Fragment>
            );
          })}
        </Grid>
      </Box>
    </>
  );
}
