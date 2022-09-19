import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import React, { FunctionComponent, PropsWithChildren } from 'react';
import { Box, createTheme, ThemeProvider } from '@mui/material';
import { useAuthStore } from './store';
import Routes from './Routes';
import { iqontrolTheme } from './theme/IQontrolTheme';

const queryClient = new QueryClient();

const Providers: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const { isAuth } = useAuthStore();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={iqontrolTheme}>
          <BrowserRouter>
            <Box sx={{ display: 'flex', height: '100vh', position: 'relative' }}>
              {isAuth && (
                <>
                  <div className="content">
                    <Routes />
                  </div>
                </>
              )}
              {!isAuth && (
                <div className="content">
                  <Routes />
                </div>
              )}
            </Box>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
};

export default Providers;
