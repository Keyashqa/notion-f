import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Text,
  Spinner,
  Flex,
  VStack,
  Heading,
} from '@chakra-ui/react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

const UserStats = () => {
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGraphData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/admin/userstats/graphdata`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setGraphData(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load user stats graph data');
      } finally {
        setLoading(false);
      }
    };

    fetchGraphData();
  }, []);

  if (loading) return <Spinner size="xl" />;

  if (error) return <Text color="red.500">{error}</Text>;

  return (
    <VStack spacing={8} p={4}>

      <Box width="100%" maxW="900px">
        <Heading size="md" mb={4}>
          New Signups in Last 14 Days
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={graphData.signupsPerDay}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#3182ce" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      <Box width="100%" maxW="900px">
        <Heading size="md" mb={4}>
          Active Users in Last 14 Days
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={graphData.activePerDay}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#38a169" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      
    </VStack>
  );
};

export default UserStats;