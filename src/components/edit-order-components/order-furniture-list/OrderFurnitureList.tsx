import { Box, Grid2, TextField, Typography } from '@mui/material';

import { Fragment, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useCurrentOrder } from '../../../hooks/useCurrentOrder';
import { AppDispatch } from '../../../store';
import { deleteItem, updateOrderItemColli } from '../../../store/appReducer';
import AddButton from '../../shared/AddButton';
import { AppDialog } from '../../shared/AppDialog';
import { DeleteButton } from '../../shared/DeleteButton';
import { FurnitureDialogContent } from './FurnitureDialogContent';

import { Furniture } from '@umzug-meister/um-core';

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
      <Box sx={{ maxHeight: 'calc(100vh - 350px)', overflowY: 'auto' }}>
        <Grid2 alignItems="center" rowSpacing={0.5} container>
          {curItems.map((item, index) => {
            return (
              <Fragment key={`${item.name}-${index}-${item.selectedCategory}`}>
                <Grid2 size={1}>
                  <DeleteButton onDelete={() => onDelete(item)} />
                </Grid2>
                <Grid2 size={3}>
                  <Typography variant="subtitle2">{item.selectedCategory}</Typography>
                </Grid2>
                <Grid2 size={6}>
                  <Typography>{item.name}</Typography>
                </Grid2>
                <Grid2 size={2} display={'flex'} justifyContent={'end'}>
                  <TextField
                    sx={{
                      width: '60px',
                    }}
                    size="small"
                    value={item.colli}
                    onChange={(ev) => onUpdate({ colli: ev.target.value, item })}
                  />
                </Grid2>
              </Fragment>
            );
          })}
        </Grid2>
      </Box>
    </>
  );
}
