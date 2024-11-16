import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';

import { PropsWithChildren } from 'react';

export function MenuItemWithIcon({ children, text, onClick }: PropsWithChildren<{ text: string; onClick(): void }>) {
  return (
    <MenuItem onClick={onClick}>
      <ListItemIcon sx={{ marginRight: 3 }}>{children}</ListItemIcon>
      <ListItemText>{text}</ListItemText>
    </MenuItem>
  );
}
