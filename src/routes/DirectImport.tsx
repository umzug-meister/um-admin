import { Box, Button, Divider, Stack, Typography } from '@mui/material';

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { appRequest } from '../api';
import { Urls } from '../api/Urls';
import { AppCard } from '../components/shared/AppCard';
import { AppGridContainer } from '../components/shared/AppGridContainer';
import { RootBox } from '../components/shared/RootBox';
import { useGenerateOrder } from '../hooks/useGenerateOrder';
import { useImportOrder } from '../hooks/useImportOrder';
import { useInitJF } from '../hooks/useInitJF';

import { Order } from 'um-types';

const createLinkContent = (order: Order) => {
  return `ID: ${order.id} - ${order.transporterNumber || 0} x 3,5 - ${order.t75 || 0} x 7,5 - ${
    order.workersNumber || 0
  } Träger`;
};

export default function DirectImport() {
  useInitJF();
  const params = useParams();

  const [orders, setOrders] = useState<Order[]>([]);
  const [importedOrder, setImportedOrder] = useState<Order>();

  const generateOrder = useGenerateOrder();
  const importOrder = useImportOrder();

  useEffect(() => {
    window.JF.getSubmission(params.id, (res: any) => {
      const order = generateOrder(res);

      setImportedOrder(order);

      const { rid } = order;
      if (rid) {
        appRequest('get')(Urls.orderSearch(rid)).then((res: Order[]) => {
          if (res.length === 0) {
            importOrder(order);
          } else {
            setOrders(res);
          }
        });
      }
    });
  }, [params, importOrder, generateOrder]);

  if (orders.length < 1) {
    return (
      <RootBox>
        <Typography>Auftrag wird importiert...</Typography>
      </RootBox>
    );
  }

  return (
    <RootBox>
      <AppGridContainer>
        <AppCard title={`Aufträge für die ${orders[0].rid!}`}>
          <Stack divider={<Divider orientation="vertical" flexItem />} spacing={2}>
            {orders.map((order) => {
              return (
                <Link key={order.id} to={`/edit/${order.id}`}>
                  {createLinkContent(order)}
                </Link>
              );
            })}
            <Box>
              <Button
                variant="contained"
                onClick={() => {
                  importedOrder && importOrder(importedOrder);
                }}
              >
                Importieren
              </Button>
            </Box>
          </Stack>
        </AppCard>
      </AppGridContainer>
    </RootBox>
  );
}
