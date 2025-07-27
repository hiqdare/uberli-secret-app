import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SecretPage from './pages/SecretPage'; 
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>    
          <Route path="/" element={<SecretPage />} />
          <Route path="/:id" element={<SecretPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
