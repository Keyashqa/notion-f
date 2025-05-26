import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Mainbar from '../components/MainBar'; // ✅ Import Mainbar
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
  return (
    <Flex h="100vh" flexDirection="column">
      {/* Topbar */}
      <Box>
        <Topbar />
      </Box>

      {/* Main content with Sidebar + Mainbar */}
      <Flex flex="1" overflow="hidden">
        <Box
          w={{ base: '0', md: '250px' }}
          bg="gray.100"
          display={{ base: 'none', md: 'block' }}
        >
          <Sidebar />
        </Box>

        <Box flex="1" p={4} overflowY="auto">
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};

export default Dashboard;
