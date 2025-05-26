// AdminDashboard.jsx
import React from 'react';
import { Box, Grid, Heading, Flex } from '@chakra-ui/react';
import Overview from './Overview';
import UserManagement from './UserManagement';
import UsageStats from './Usagestats';

const AdminDashboard = () => {
  return (
    <Box px={{ base: 4, md: 10 }} py={6} maxW="7xl" mx="auto">
      <Heading size="lg" mb={6} textAlign="center">
        Admin Dashboard
      </Heading>

      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8}>
        <Overview />
        <UsageStats />
      </Grid>

      <Box mt={10} p={6} boxShadow="lg" borderRadius="xl" bg="white">
        <UserManagement />
      </Box>
    </Box>
  );
};

export default AdminDashboard;