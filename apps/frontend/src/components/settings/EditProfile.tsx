import { Avatar, HStack, Input, VStack } from '@chakra-ui/react';
import React from 'react';

export const EditProfile = () => {
  return (
    <HStack>
      <Avatar></Avatar>
      <VStack>
        <Input placeholder="First Name" />
        <Input placeholder="First Name" />
      </VStack>
    </HStack>
  );
};
