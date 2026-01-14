import React from 'react';
import { Box, Paper, Typography, Container, useMediaQuery, useTheme } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useSidebarContext } from '../hooks/context/sidebardContext';

const EditorFooter = ({ actions, savingStatus }) => {
    const theme = useTheme();
    const { isOpen } = useSidebarContext();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Paper 
            elevation={4} 
            sx={{ 
                position: 'fixed', 
                bottom: 0, 
                right: 0,
                left: isMobile ? 0 : (isOpen ? '260px' : '80px'),
                zIndex: 1100, 
                borderTop: '1px solid', 
                borderColor: 'divider', 
                px: 4, 
                py: 2,
                transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
            }}
        >
            <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.dark' }}>
                    <CheckCircleIcon fontSize="small" />
                    <Typography variant="body2" fontWeight={600}>{savingStatus}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {actions}
                </Box>
            </Container>
        </Paper>
    );
};

export default EditorFooter;
