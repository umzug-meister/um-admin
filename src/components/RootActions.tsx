import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Box, Button, Tooltip } from '@mui/material';

import { Link } from 'react-router-dom';

export default function RootActions() {
  return (
    <Box display="flex">
      <Tooltip title="einen Neuen Auftrag erstellen">
        <Link to="/edit/-1">
          <Button startIcon={<AddOutlinedIcon />} size="medium" variant="text">
            Auftrag
          </Button>
        </Link>
      </Tooltip>
    </Box>
  );
}
