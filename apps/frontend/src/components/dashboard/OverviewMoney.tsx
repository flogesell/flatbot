import { Box, Center, Skeleton, Stat, StatLabel, StatNumber } from '@chakra-ui/react';
import React from 'react';

type OverviewMoneyProperties = {
  label: string;
  amount: number;
  isLoading: boolean;
};

export const OverviewMoney: React.FC<OverviewMoneyProperties> = ({ label, amount = 'N/A', isLoading }) => {
  if (amount === 'N/A') {
    return (
      <Center width="100%">
        <Skeleton width="50px" height="30px" />
      </Center>
    );
  }
  return (
    <Box flexGrow={1} flexBasis="100px" marginLeft="0 !important">
      <Center>
        <Stat>
          <StatLabel>{label}</StatLabel>
          <StatNumber>
            {amount.toLocaleString('de-DE', {
              style: 'currency',
              currency: 'EUR'
            })}
          </StatNumber>
        </Stat>
      </Center>
    </Box>
  );
};
