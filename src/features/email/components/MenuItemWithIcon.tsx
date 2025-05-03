import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';

import { PropsWithChildren } from 'react';

export function MenuItemWithIcon({
  children,
  text,
  disabled,
  onClick,
}: PropsWithChildren<{ text: string; onClick(): void; disabled?: boolean }>) {
  return (
    <MenuItem disabled={disabled} onClick={onClick}>
      <ListItemIcon sx={{ marginRight: 3 }}>{children}</ListItemIcon>
      <ListItemText>{text}</ListItemText>
    </MenuItem>
  );
}
