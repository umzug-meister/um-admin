import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import MultipleStopOutlinedIcon from '@mui/icons-material/MultipleStopOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import { Grid2, IconButton, Stack, Typography } from '@mui/material';

import React from 'react';
import { useDispatch } from 'react-redux';

import { useCurrentOrder } from '../../../hooks/useCurrentOrder';
import { AppDispatch } from '../../../store';
import { updateOrderProps } from '../../../store/appReducer';
import { GridItem } from '../../shared/GridItem';
import { AddressForm } from './AddressForm';

export function Addresses() {
  const order = useCurrentOrder();

  const dispatch = useDispatch<AppDispatch>();

  if (!order) {
    return null;
  }

  const { showSecondaryFrom, showSecondaryTo } = order;

  const handleSwitchAddress = (path: 'showSecondaryFrom' | 'showSecondaryTo') => {
    return function () {
      const nextValue = !order[path];
      dispatch(updateOrderProps({ path: [path], value: !order[path] }));
      if (nextValue === false) {
        dispatch(
          updateOrderProps({
            path: [path === 'showSecondaryFrom' ? 'secondaryFrom' : 'secondaryTo'],
            value: undefined,
          }),
        );
      }
    };
  };

  const handleExchangeAdresses = (path: 'from' | 'to') => {
    return function () {
      const from = order.from;
      const to = order.to;
      const secondaryFrom = order.secondaryFrom;
      const secondaryTo = order.secondaryTo;

      if (path === 'from') {
        dispatch(updateOrderProps({ path: ['from'], value: secondaryFrom }));
        dispatch(updateOrderProps({ path: ['secondaryFrom'], value: from }));
      } else {
        dispatch(updateOrderProps({ path: ['to'], value: secondaryTo }));
        dispatch(updateOrderProps({ path: ['secondaryTo'], value: to }));
      }
    };
  };

  return (
    <Grid2 container spacing={2}>
      <GridItem size={12}></GridItem>
      <GridItem size={3}>
        <AddressForm
          full
          path="from"
          title={
            <CardTitle
              title="1. Auszugsadresse"
              icon={showSecondaryFrom ? <RemoveOutlinedIcon color="error" /> : <AddOutlinedIcon />}
              onClick={handleSwitchAddress('showSecondaryFrom')}
            />
          }
        />
      </GridItem>
      {showSecondaryFrom && (
        <GridItem size={3}>
          <AddressForm
            path="secondaryFrom"
            full
            title={
              <CardTitle
                icon={<MultipleStopOutlinedIcon />}
                onClick={handleExchangeAdresses('to')}
                title="2. Einzugsadresse"
              />
            }
          />
        </GridItem>
      )}
      <GridItem size={3}>
        <AddressForm
          path="to"
          title={
            <CardTitle
              title="1. Einzugsadresse"
              icon={showSecondaryTo ? <RemoveOutlinedIcon color="error" /> : <AddOutlinedIcon />}
              onClick={handleSwitchAddress('showSecondaryTo')}
            />
          }
        />
      </GridItem>
      {showSecondaryTo && (
        <GridItem size={3}>
          <AddressForm
            path="secondaryTo"
            title={
              <CardTitle
                icon={<MultipleStopOutlinedIcon />}
                onClick={handleExchangeAdresses('to')}
                title="2. Einzugsadresse"
              />
            }
          />
        </GridItem>
      )}
    </Grid2>
  );
}

interface CardTitleProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const CardTitle = ({ title, icon, onClick }: CardTitleProps) => {
  return (
    <Stack direction="row" justifyContent={'space-between'} alignItems={'center'}>
      <Typography color={'primary'} variant="h6">
        {title}
      </Typography>
      <IconButton onClick={onClick}>{icon}</IconButton>
    </Stack>
  );
};
