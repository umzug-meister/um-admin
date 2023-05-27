import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { Grid, IconButton } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';

import React from 'react';

import AddButton from './shared/AddButton';
import { AppTextField } from './shared/AppTextField';

import { MLeistung } from 'um-types';

interface Props {
  leistungen: MLeistung[] | undefined;
  update: (leistungen: MLeistung[]) => void;
  hideChecks?: boolean;
}

export default function LeistungEdit({ leistungen = [], update, hideChecks }: Props) {
  const current = [...leistungen];

  const onDelete = (index: number) => {
    const next = current.filter((_, idx) => {
      return idx !== index;
    });
    update(next);
  };

  const onCheck = (checked: boolean, index: number) => {
    current[index] = { ...current[index], calculate: checked };
    update(current);
  };

  const onValueChange = (prop: keyof MLeistung, index: number) => {
    return function (ev: React.ChangeEvent<HTMLInputElement>) {
      const curLst = current[index];

      const nextLst = { ...curLst, [prop]: ev.target.value };
      current[index] = nextLst;
      update(current);
    };
  };

  const addLst = () => {
    current.push({} as MLeistung);
    update(current);
  };

  const GridRow = (lst: MLeistung, index: number) => {
    return (
      <Grid container spacing={2} key={index}>
        {!hideChecks && (
          <Grid item xs={1}>
            <Checkbox checked={lst.calculate || false} onChange={(ev) => onCheck(ev.target.checked, index)} />
          </Grid>
        )}
        <Grid item xs={hideChecks ? 6 : 5}>
          <AppTextField
            disabled={lst.disabled}
            value={lst.desc}
            onChange={onValueChange('desc', index)}
            fullWidth
            size="small"
            placeholder="Beschreibung"
          />
        </Grid>
        <Grid item xs={1}>
          <AppTextField
            disabled={lst.disabled}
            type="number"
            placeholder="Menge"
            value={lst.colli}
            onChange={onValueChange('colli', index)}
          />
        </Grid>

        <Grid item xs={1}>
          <AppTextField
            disabled={lst.disabled}
            type="number"
            placeholder="Preis"
            value={lst.price}
            onChange={onValueChange('price', index)}
            InputProps={{ endAdornment: '€' }}
          />
        </Grid>

        <Grid item xs={2}>
          <AppTextField
            disabled={lst.disabled}
            type="number"
            placeholder="Gesamt"
            InputProps={{ endAdornment: '€' }}
            value={lst.sum}
            onChange={onValueChange('sum', index)}
          />
        </Grid>

        <Grid item xs={2}>
          <IconButton disabled={index === leistungen.length - 1}>
            <KeyboardArrowDownOutlinedIcon />
          </IconButton>
          <IconButton disabled={index === 0}>
            <KeyboardArrowUpOutlinedIcon />
          </IconButton>
          <IconButton onClick={() => onDelete(index)} color="error">
            <DeleteOutlined />
          </IconButton>
        </Grid>
      </Grid>
    );
  };
  return (
    <>
      {current.map(GridRow)}
      <AddButton onClick={addLst} />
    </>
  );
}
