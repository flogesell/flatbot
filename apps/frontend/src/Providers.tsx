import { FunctionComponent, PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Box, ChakraProvider, TabList, Tabs, VStack } from '@chakra-ui/react';
import { useAuthStore } from './store';
import Routes from './Routes';
import { TabButton } from './components/menu/TabButton';
import { tabs } from './utils/Menustructure';
import { TabMenu } from './components/menu/TabMenu';

const queryClient = new QueryClient();

const Providers: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const { isAuth } = useAuthStore();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <BrowserRouter>
            <VStack className="router-view">
              <Box className="page">
                <Box className="content">
                  <Routes />
                </Box>
              </Box>
              {isAuth && <TabMenu></TabMenu>}
            </VStack>
          </BrowserRouter>
        </ChakraProvider>
      </QueryClientProvider>
    </>
  );
};

export default Providers;
