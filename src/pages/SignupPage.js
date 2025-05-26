import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Link,
  Heading,
  Flex,
  Divider,
  HStack,
  Icon,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FcGoogle } from 'react-icons/fc' // Google icon

export default function SignupPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/register`, {
        username,
        email,
        password,
      })

      console.log('Signup success:', response.data)
      alert('Account created! Please log in.')
      navigate('/login')
    } catch (error) {
      const message =
        error.response?.data?.message || 'Signup failed. Please try again.'
      alert(message)
    }
  }

  const handleGoogleSignup = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/auth/google`
  }

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.100" px={4}>
      <Box bg="white" p={8} rounded="md" shadow="md" w="full" maxW="md">
        <Heading mb={6} size="lg" textAlign="center">
          Create your account
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                placeholder="john_doe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button colorScheme="blue" type="submit" width="full">
              Sign Up
            </Button>
          </VStack>
        </form>

        {/* Divider */}
        <HStack my={6}>
          <Divider />
          <Text fontSize="sm" color="gray.500">
            or
          </Text>
          <Divider />
        </HStack>

        {/* Google sign up button */}
        <Button
          variant="outline"
          width="full"
          leftIcon={<Icon as={FcGoogle} boxSize={6} />}
          onClick={handleGoogleSignup}
          _hover={{ bg: 'gray.100' }}
        >
          Sign up with Google
        </Button>

        <Text fontSize="sm" mt={6} textAlign="center">
          Already have an account?{' '}
          <Link color="blue.500" onClick={() => navigate('/login')}>
            Log in
          </Link>
        </Text>
      </Box>
    </Flex>
  )
}
