import { Box, CircularProgress } from '@mui/material';

/**
 * Lightweight loading fallback component for React Suspense
 * Used during lazy loading of route components
 */
const LoadingFallback = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <CircularProgress size={60} thickness={4} />
    </Box>
  );
};

export default LoadingFallback;
