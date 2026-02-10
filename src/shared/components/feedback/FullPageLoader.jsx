import React from 'react';
import { Backdrop, CircularProgress, Typography, Box } from '@mui/material';

/**
 * Full page loader component using Material UI Backdrop.
 * Blocks user interaction and shows a loading spinner with a message.
 * @param {boolean} open - Whether the loader is visible
 * @param {string} message - Optional message to display below the spinner
 */
const FullPageLoader = ({ open, message = 'Procesando...' }) => {
    return (
        <Backdrop
            sx={{ 
                color: '#fff', 
                zIndex: (theme) => theme.zIndex.drawer + 9999,
                flexDirection: 'column',
                gap: 2,
                backdropFilter: 'blur(3px)'
            }}
            open={open}
        >
            <CircularProgress color="inherit" size={60} thickness={4} />
            <Typography variant="h6" fontWeight={700} sx={{ mt: 2 }}>
                {message}
            </Typography>
        </Backdrop>
    );
};

export default FullPageLoader;
