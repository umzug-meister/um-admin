import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import MultipleStopOutlinedIcon from '@mui/icons-material/MultipleStopOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import { ButtonProps, Grid2, IconButton, Stack, Typography } from '@mui/material';

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
      <GridItem size={2.7}>
        <AddressForm
          full
          path="from"
          title={
            <CardTitle
              title="1. Auszug"
              disabled={showSecondaryFrom}
              icon={<AddOutlinedIcon />}
              onClick={handleSwitchAddress('showSecondaryFrom')}
            />
          }
        />
      </GridItem>
      {showSecondaryFrom && (
        <>
          <GridItem size={0.6} alignContent={'center'} display={'flex'}>
            <ExchangeButton onClick={handleExchangeAdresses('from')} />
          </GridItem>
          <GridItem size={2.7}>
            <AddressForm
              path="secondaryFrom"
              full
              title={
                <CardTitle
                  title="2. Auszug"
                  icon={<RemoveOutlinedIcon color="error" />}
                  onClick={handleSwitchAddress('showSecondaryFrom')}
                />
              }
            />
          </GridItem>
        </>
      )}
      <GridItem size={2.7}>
        <AddressForm
          path="to"
          title={
            <CardTitle
              title="1. Einzug"
              disabled={showSecondaryTo}
              icon={<AddOutlinedIcon />}
              onClick={handleSwitchAddress('showSecondaryTo')}
            />
          }
        />
      </GridItem>
      {showSecondaryTo && (
        <>
          <GridItem size={0.6} alignContent={'center'} display={'flex'}>
            <ExchangeButton onClick={handleExchangeAdresses('to')} />
          </GridItem>
          <GridItem size={2.7}>
            <AddressForm
              path="secondaryTo"
              title={
                <CardTitle
                  title="2. Einzug"
                  icon={<RemoveOutlinedIcon color="error" />}
                  onClick={handleSwitchAddress('showSecondaryTo')}
                />
              }
            />
          </GridItem>
        </>
      )}
    </Grid2>
  );
}

const ExchangeButton = ({ onClick }: Pick<ButtonProps, 'onClick'>) => {
  return (
    <IconButton sx={{ margin: 'auto' }} onClick={onClick} color="primary">
      <MultipleStopOutlinedIcon />
    </IconButton>
  );
};

interface CardTitleProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

const CardTitle = ({ title, icon, onClick, disabled }: CardTitleProps) => {
  return (
    <Stack direction="row" justifyContent={'space-between'} alignItems={'center'}>
      <Typography color={'primary'} variant="h6">
        {title}
      </Typography>
      <IconButton disabled={disabled} onClick={onClick}>
        {icon}
      </IconButton>
    </Stack>
  );
};
