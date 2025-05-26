// src/components/LogoutButton.js

import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import useStore from '../stores/sidebarStores'; 

const LogoutButton = () => {
  const resetStore = useStore((state) => state.resetStore);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    resetStore();
    navigate('/login');
  };

  return (
    <Button colorScheme="red" variant="outline" w="full" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
