import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#F7E8C7',
            light: '#FFFBF0',
            dark: '#E5D6B5',
            contrastText: '#442A2A',
        },
        secondary: {
            main: '#D19A4A',
            light: '#E0B76A',
            dark: '#B8823A',
            contrastText: '#FFFFFF',
        },
        accent: {
            main: '#FED7AE',
            light: '#FFECD6',
            dark: '#F5C89E',
        },
        text: {
            primary: '#FFFFFF',
            secondary: '#B0B0B0',
            disabled: '#707070',
        },
        background: {
            default: '#1A1A1A',
            paper: '#2A2A2A',
        },
        error: {
            main: '#C84B31',
        },
        success: {
            main: '#4CAF50',
        },
        warning: {
            main: '#FF9800',
        },
    },
    typography: {
        fontFamily: "'Roboto', 'Arial', sans-serif",
        h1: {
            fontSize: '2.5rem',
            fontWeight: 500,
        },
        h4: {
            fontSize: '2rem',
            fontWeight: 500,
        },
        h5: {
            fontSize: '1.5rem',
            fontWeight: 500,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.5,
        },
        body2: {
            fontSize: '0.875rem',
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(209, 154, 74, 0.2)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                            borderColor: '#D19A4A',
                        },
                    },
                },
            },
        },
    },
});

export default darkTheme;
