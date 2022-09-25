import React, { useEffect } from 'react';
import { Box, Button, VStack } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';

type TabButtonProperties = {
  path?: string;
  icon: React.ReactNode;
  label?: string;
};

export const TabButton: React.FC<TabButtonProperties> = ({ label, path, icon }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    if (path) navigate(path);
  };

  return (
    <Button onClick={handleClick} className="tab-button">
      <VStack as="div">
        {label}
        {icon && <Box as="div">{icon}</Box>}
      </VStack>
    </Button>
  );
};
