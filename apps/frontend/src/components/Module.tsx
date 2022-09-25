import { Box, Heading } from '@chakra-ui/react';
import React from 'react';

type ModuleProperties = {
  subTitle?: string;
  children: React.ReactNode | React.ReactNode[];
  noShadow?: boolean;
};

export const Module: React.FC<ModuleProperties> = ({ subTitle, children, noShadow = false }) => {
  return (
    <Box marginBottom="15px">
      <Heading className="sub-header">{subTitle}</Heading>
      <Box marginBottom="25px" boxShadow={!noShadow ? '0px 0px 10px rgba(50, 50, 50, 0.35)' : ''} borderRadius="10px">
        {children}
      </Box>
    </Box>
  );
};
