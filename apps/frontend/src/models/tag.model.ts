import { TagCloseButtonProps } from '@chakra-ui/react';
import { Flat } from './flat.model';
import { User } from './user.model.ts';

export type Tag = {
  name: string;
  flatId: string;
};

export type CreateTag = {
  name: string;
  flatId: string;
};
