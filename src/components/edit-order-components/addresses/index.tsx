import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import MultipleStopOutlinedIcon from '@mui/icons-material/MultipleStopOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import { ButtonProps, Grid2, IconButton, Stack, Tooltip, Typography } from '@mui/material';

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
    <Grid2 container spacing={2} alignItems={'stretch'}>
      <GridItem>
        <Grid2 container alignItems={'stretch'}>
          <GridItem size={showSecondaryFrom ? 5.5 : 12}>
            <AddressForm
              full
              path="from"
              title={
                <CardTitle
                  color="error"
                  title={showSecondaryFrom ? '1. Beladestelle' : 'Beladestelle'}
                  disabled={showSecondaryFrom}
                  icon={<AddOutlinedIcon />}
                  onClick={handleSwitchAddress('showSecondaryFrom')}
                />
              }
            />
          </GridItem>
          {showSecondaryFrom && (
            <>
              <GridItem size={1} alignContent={'center'} display={'flex'}>
                <ExchangeButton onClick={handleExchangeAdresses('from')} />
              </GridItem>
              <GridItem size={5.5}>
                <AddressForm
                  path="secondaryFrom"
                  full
                  title={
                    <CardTitle
                      color="error"
                      title="2. Beladestelle"
                      icon={<RemoveOutlinedIcon color="error" />}
                      onClick={handleSwitchAddress('showSecondaryFrom')}
                    />
                  }
                />
              </GridItem>
            </>
          )}
        </Grid2>
      </GridItem>
      <GridItem>
        <Grid2 container alignItems={'stretch'} height={'100%'}>
          <GridItem size={showSecondaryTo ? 5.5 : 12}>
            <AddressForm
              path="to"
              title={
                <CardTitle
                  title={showSecondaryTo ? '1. Entladestelle' : 'Entladestelle'}
                  disabled={showSecondaryTo}
                  icon={<AddOutlinedIcon />}
                  onClick={handleSwitchAddress('showSecondaryTo')}
                />
              }
            />
          </GridItem>
          {showSecondaryTo && (
            <>
              <GridItem size={1} alignContent={'center'} display={'flex'}>
                <ExchangeButton onClick={handleExchangeAdresses('to')} />
              </GridItem>
              <GridItem size={5.5}>
                <AddressForm
                  path="secondaryTo"
                  title={
                    <CardTitle
                      title="2. Entladestelle"
                      icon={<RemoveOutlinedIcon color="error" />}
                      onClick={handleSwitchAddress('showSecondaryTo')}
                    />
                  }
                />
              </GridItem>
            </>
          )}
        </Grid2>
      </GridItem>
    </Grid2>
  );
}

const ExchangeButton = ({ onClick }: Pick<ButtonProps, 'onClick'>) => {
  return (
    <Tooltip title="1. und 2.  umtauschen">
      <IconButton sx={{ margin: 'auto' }} onClick={onClick} color="primary">
        <MultipleStopOutlinedIcon />
      </IconButton>
    </Tooltip>
  );
};

interface CardTitleProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  color?: 'success' | 'error';
}

const CardTitle = ({ title, icon, onClick, disabled, color = 'success' }: CardTitleProps) => {
  return (
    <Stack direction="row" justifyContent={'space-between'} alignItems={'center'}>
      <Typography color={color} variant="h6">
        {title}
      </Typography>
      <IconButton disabled={disabled} onClick={onClick}>
        {icon}
      </IconButton>
    </Stack>
  );
};
