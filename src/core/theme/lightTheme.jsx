import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1A3C34', // Jungle
            light: '#2C5E52',
            dark: '#0D2620', // Dark Jungle
            contrastText: '#F5F2ED', // Cream
        },
        secondary: {
            main: '#F39C12', // Turmeric
            light: '#F5B041',
            dark: '#D68910',
            contrastText: '#0D2620', // Dark Jungle
        },
        error: {
            main: '#C0392B', // Achuete
        },
        background: {
            default: '#F5F2ED', // Cream
            paper: '#FFFFFF',
        },
        text: {
            primary: '#1A3C34', // Jungle
            secondary: '#0D2620', // Dark Jungle
        },
    },
    typography: {
        fontFamily: "'Google Sans', 'Outfit', sans-serif",
        h1: {
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 900,
        },
        h2: {
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
        },
        h3: {
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
        },
        h4: {
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
        },
        h5: {
            fontFamily: "'Google Sans', sans-serif",
            fontWeight: 700,
        },
        h6: {
            fontFamily: "'Google Sans', sans-serif",
            fontWeight: 500,
        },
        button: {
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
            textTransform: 'none',
        },
    },
    shape: {
        borderRadius: 16, // More rounded like the design
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    padding: '10px 24px',
                },
                contained: {
                    boxShadow: '0 4px 14px 0 rgba(26, 60, 52, 0.3)', // Jungle shadow
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px 0 rgba(26, 60, 52, 0.4)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                rounded: {
                    borderRadius: '16px',
                },
                elevation1: {
                    boxShadow: '0 4px 20px -2px rgba(26, 60, 52, 0.1)', // Subtle jungle shadow
                },
            },
        },
    },
});

export default lightTheme;
