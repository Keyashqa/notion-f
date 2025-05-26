import React from 'react';
import {
  Box,
  Text,
  Heading,
  VStack,
  useColorModeValue,
  Container,
} from '@chakra-ui/react';
import useTopStore from '../stores/topstore';

const Welcome = () => {
  const user = useTopStore((state) => state.user);

  return (
    <Box p={8} w="100%" h="100%">
      <Container maxW="5xl">
        <Box
          backdropFilter="blur(10px)"
          bg={useColorModeValue('whiteAlpha.800', 'whiteAlpha.100')}
          borderRadius="2xl"
          boxShadow="lg"
          p={10}
          border="1px solid"
          borderColor={useColorModeValue('gray.200', 'whiteAlpha.300')}
        >
          <VStack spacing={4} align="start">
            <Heading
              size="xl"
              bgGradient="linear(to-r, teal.400, blue.500)"
              bgClip="text"
            >
              Welcome, {user?.username || 'Explorer'} 👋
            </Heading>
            <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.300')}>
              Let’s get started with your workspace. Create pages, collaborate, and build something great 🚀
            </Text>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default Welcome;
