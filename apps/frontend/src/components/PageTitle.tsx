import { Heading, Text } from '@chakra-ui/react';
import React from 'react';

type PageTitleProperties = {
  title: string;
};

export const PageTitle: React.FC<PageTitleProperties> = ({ title }) => {
  return <Heading className="page-header">{title}</Heading>;
};
