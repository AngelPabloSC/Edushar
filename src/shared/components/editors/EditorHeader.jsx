import React from 'react';
import { Box, Paper, IconButton, Typography, alpha, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SyncIcon from '@mui/icons-material/Sync';

const EditorHeader = ({ breadcrumbs = [], onBack, lastSaved, showLastSaved = false }) => {
    const theme = useTheme();

    return (
        <Paper 
            elevation={0} 
            sx={{ 
                position: 'sticky', 
                top: 0, 
                zIndex: 1100, 
                borderBottom: '1px solid', 
                borderColor: 'divider', 
                bgcolor: alpha(theme.palette.background.default, 0.8), 
                backdropFilter: 'blur(10px)', 
                px: { xs: 2, md: 5 }, 
                py: 2 
            }}
        >
            <Box sx={{ maxWidth: 1200, mx: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={onBack} sx={{ color: 'text.secondary' }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {breadcrumbs.map((crumb, index) => (
                                <React.Fragment key={index}>
                                    <Typography 
                                        variant="caption" 
                                        color={index === breadcrumbs.length - 1 ? 'text.primary' : 'primary.main'}
                                        fontWeight={index === breadcrumbs.length - 1 ? 600 : 700}
                                        sx={{ 
                                            cursor: crumb.onClick ? 'pointer' : 'default',
                                            '&:hover': crumb.onClick ? { textDecoration: 'underline' } : {}
                                        }} 
                                        onClick={crumb.onClick}
                                    >
                                        {crumb.label}
                                    </Typography>
                                    {index < breadcrumbs.length - 1 && (
                                        <ChevronRightIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                                    )}
                                </React.Fragment>
                            ))}
                        </Box>
                    </Box>
                </Box>
                
                {showLastSaved && lastSaved && (
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1, px: 1.5, py: 0.5, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 4, color: 'primary.dark' }}>
                        <SyncIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption" fontWeight={600}>{lastSaved}</Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default EditorHeader;
