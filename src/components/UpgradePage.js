import { Box, Button, Grid, Heading, Text, VStack } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import useStore from '../stores/sidebarStores';

const plans = [
  {
    title: 'Plus',
    price: 5,
    features: ['10 pages/workspace', 'Basic analytics', 'Email support'],
  },
  {
    title: 'Advanced',
    price: 15,
    features: ['Unlimited pages', 'Advanced analytics', 'Priority support'],
  },
];

const UpgradePage = () => {
  const { id } = useParams();
  const setWorkspacePlan = useStore((state) => state.setWorkspacePlan);

  const handlePayment = (plan) => {
    // dummy payment logic
    setWorkspacePlan(id, plan);
    alert(`Payment for ${plan} plan successful!`);
  };

  return (
    <Box p={8}>
      <Heading mb={6}>Upgrade Your Workspace</Heading>
      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
        {plans.map((plan) => (
          <Box key={plan.title} borderWidth="1px" borderRadius="xl" p={6} shadow="md">
            <Heading size="md" mb={2}>{plan.title}</Heading>
            <Text fontSize="xl" fontWeight="bold" mb={4}>₹{plan.price}/month</Text>
            <VStack align="start" spacing={2} mb={4}>
              {plan.features.map((feature) => (
                <Text key={feature}>• {feature}</Text>
              ))}
            </VStack>
            <Button colorScheme="blue" onClick={() => handlePayment(plan.title)}>Pay Now</Button>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default UpgradePage;