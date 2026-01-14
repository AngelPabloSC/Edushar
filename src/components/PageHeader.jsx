import React from 'react';
import { Box, Typography } from '@mui/material';

const PageHeader = ({ title, subtitle }) => {
    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h3" fontWeight={900} gutterBottom sx={{ color: 'text.primary', letterSpacing: '-0.02em' }}>
                {title}
            </Typography>
            {subtitle && (
                <Typography variant="body1" color="text.secondary">
                    {subtitle}
                </Typography>
            )}
        </Box>
    );
};

export default PageHeader;
