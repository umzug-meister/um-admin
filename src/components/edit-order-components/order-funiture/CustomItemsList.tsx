import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useTheme } from '@mui/material';

import { CustomItem } from 'um-types';

interface Props {
  customItems?: CustomItem[];
  title?: string;
}

export function CustomItemsList({ customItems, title }: Readonly<Props>) {
  const theme = useTheme();

  if (!customItems || customItems.length === 0) {
    return null;
  }
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ background: theme.palette.primary.dark }}>
            <TableCell sx={{ color: 'white' }} colSpan={7}>
              {title}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Breite</TableCell>
            <TableCell>Tiefe</TableCell>
            <TableCell>Höhe</TableCell>
            <TableCell>Gewicht</TableCell>
            <TableCell>Anzahl</TableCell>
            <TableCell>Volumen</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customItems.map(({ name, breite, tiefe, hoehe, weight, colli, itemVolume }) => (
            <TableRow key={name}>
              <TableCell>{name}</TableCell>
              <TableCell>{breite}</TableCell>
              <TableCell>{tiefe}</TableCell>
              <TableCell>{hoehe}</TableCell>
              <TableCell>{weight}</TableCell>
              <TableCell>{colli}</TableCell>
              <TableCell>{itemVolume}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
