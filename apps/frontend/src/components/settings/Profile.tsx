import {
  Avatar,
  HStack,
  Input,
  VStack,
  Text,
  Box,
  Center,
  Button,
  Modal,
  FormControl,
  FormLabel,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react';
import React from 'react';
import { useGetProfileQuery } from '../../services/user.service';
import { useAuthStore } from '../../store';
import { EditProfile } from './EditProfile';

export const Profile = () => {
  const { data: user, isLoading } = useGetProfileQuery();
  return (
    <Box>
      <Center>
        <VStack>
          <Avatar width="100px" height="100px" marginBottom="15px" />
          <Text>{user?.firstName + ' ' + user?.lastName}</Text>
          <Text>{user?.email}</Text>
          <Button>Edit profile</Button>
        </VStack>
      </Center>
    </Box>
  );
};
