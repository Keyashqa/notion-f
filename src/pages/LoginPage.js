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

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
        email,
        password,
      })

      const { token, username } = res.data
      console.log('Login successful:', username)
      localStorage.setItem('token', token)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed'
      alert(msg)
    }
  }

  // Handle Google login button click
  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/auth/google`
  }

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.100" px={4}>
      <Box bg="white" p={8} rounded="md" shadow="md" w="full" maxW="md">
        <Heading mb={6} size="lg" textAlign="center">
          Log in to your account
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Text fontSize="sm" color="blue.500" mt={1} textAlign="right" cursor="pointer" onClick={() => navigate('/forgot-password')}>
                Forgot password?
              </Text>
            </FormControl>

            <Button colorScheme="blue" type="submit" width="full">
              Log In
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

        {/* Google login button */}
        <Button
          variant="outline"
          width="full"
          leftIcon={<Icon as={FcGoogle} boxSize={6} />}
          onClick={handleGoogleLogin}
          _hover={{ bg: 'gray.100' }}
        >
          Sign in with Google
        </Button>

        <Text fontSize="sm" mt={6} textAlign="center">
          Don’t have an account?{' '}
          <Link color="blue.500" onClick={() => navigate('/signup')}>
            Sign up
          </Link>
        </Text>
      </Box>
    </Flex>
  )
}
