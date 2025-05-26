import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  Spinner,
  Text
} from '@chakra-ui/react';

const Overview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token'); // get token

                const { data } = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/api/admin/overview`,
                {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                }
                );
                setStats(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load stats');
            } finally {
                setLoading(false);
            }
            };


    fetchStats();
  }, []);

  if (loading) return <Spinner size="lg" />;
  if (error) return <Text color="red.500">{error}</Text>;

  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
      <Stat>
        <StatLabel>Total Users</StatLabel>
        <StatNumber>{stats.totalUsers}</StatNumber>
        <StatHelpText>Total registered users</StatHelpText>
      </Stat>
      <Stat>
        <StatLabel>Active Today</StatLabel>
        <StatNumber>{stats.activeToday}</StatNumber>
        <StatHelpText>Users active today</StatHelpText>
      </Stat>
      <Stat>
        <StatLabel>New Signups</StatLabel>
        <StatNumber>{stats.newSignups}</StatNumber>
        <StatHelpText>Past 7 days</StatHelpText>
      </Stat>
    </SimpleGrid>
  );
};

export default Overview;
