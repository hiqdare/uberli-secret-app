// src/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4BD2AD', // türkis 400
    },
    secondary: {
      main: '#B84AE7', // lila 400
    },
    background: {
      default: '#f9f9f9',
    },
  },
  typography: {
    fontFamily: `'Inter', 'Helvetica Neue', 'Arial', sans-serif`,
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
        styleOverrides: {
        root: {
            borderRadius: 24,
            textTransform: 'none',
        },
        },
    },
  }
});


export default theme;
