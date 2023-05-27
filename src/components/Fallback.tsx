import { Box, Skeleton } from '@mui/material';

export function Fallback() {
  return (
    <Box m="auto" sx={{ width: 600 }}>
      <Skeleton />
      <Skeleton variant="rectangular" width={600} height={300} />
      <Skeleton animation="wave" />
      <Skeleton animation={false} />
    </Box>
  );
}
