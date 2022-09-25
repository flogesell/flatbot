import { Avatar, Box, HStack, Text } from '@chakra-ui/react';
import React from 'react';
import { useGetFlatQuery } from '../../services/flat.service';

export const DebtOverview = () => {
  const { data: flat, isLoading } = useGetFlatQuery();
  return (
    <>
      {flat?.flatmates.map((flatmate) => (
        <Box marginBottom="10px" key={flatmate.userId}>
          <HStack>
            <Avatar width={'35px'} height="35px" />
            <Text>{flatmate.firstName}</Text>
          </HStack>
        </Box>
      ))}
    </>
  );
};
