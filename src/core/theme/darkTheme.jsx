import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#F39C12', // Turmeric (High contrast for dark)
            light: '#F5B041',
            dark: '#D68910',
            contrastText: '#0D2620',
        },
        secondary: {
            main: '#F5F2ED', // Cream
            light: '#FFFFFF',
            dark: '#C2BFBA',
            contrastText: '#0D2620',
        },
        error: {
            main: '#C0392B', // Achuete
        },
        background: {
            default: '#0D2620', // Dark Jungle
            paper: '#1A3C34', // Jungle
        },
        text: {
            primary: '#F5F2ED', // Cream
            secondary: '#B0B0B0',
        },
    },
    typography: {
        fontFamily: "'Google Sans', 'Outfit', sans-serif",
        h1: {
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 900,
        },
        button: {
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
            textTransform: 'none',
        },
    },
    shape: {
        borderRadius: 16,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                rounded: {
                    borderRadius: '16px',
                },
            },
        },
    },
});

export default darkTheme;
