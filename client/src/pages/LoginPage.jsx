import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Input,
  FormControl,
  FormLabel,
  useToast,
  Flex,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleCustomAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

      if (isLogin) {
        // Standard Login
        const { data } = await axios.post(`${API_URL}/api/auth/login`, { email, password });
        if (data.success) {
          localStorage.setItem('token', data.data.token);
          localStorage.setItem('user', JSON.stringify(data.data));
          toast({ title: 'Logged in successfully!', status: 'success' });
          window.location.href = '/';
        }
      } else {
        // Signup Flow
        if (!showOtp) {
          // Send OTP
          const { data } = await axios.post(`${API_URL}/api/auth/send-otp`, { email });
          if (data.success) {
            setShowOtp(true);
            toast({ title: 'OTP sent to your email!', status: 'info' });
          }
        } else {
          // Verify OTP & Register
          const { data } = await axios.post(`${API_URL}/api/auth/register`, { name, email, password, otp });
          if (data.success) {
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data));
            toast({ title: 'Registered successfully!', status: 'success' });
            window.location.href = '/';
          }
        }
      }
    } catch (err) {
      toast({
        title: 'Auth Error',
        description: err.response?.data?.message || err.message,
        status: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const brandGradient = "linear(to-br, #7F53AC, #647DEE)";
  const bg = useColorModeValue("gray.50", "#0f0e17");
  const cardBg = useColorModeValue("white", "gray.800");

  return (
    <Flex minH="100vh" align="center" justify="center" bg={bg} px={4}>
      <VStack spacing={8} w="full" maxW="md">
        <VStack spacing={2}>
          <Heading
            as="h1"
            fontSize="5xl"
            fontWeight="extrabold"
            letterSpacing="-1px"
            bgGradient={brandGradient}
            bgClip="text"
            fontFamily="Poppins, Inter, sans-serif"
          >
            text2learn
          </Heading>
          <Text color="gray.400" fontSize="lg">Unlock your learning potential</Text>
        </VStack>

        <Box
          w="full"
          p={8}
          bg={cardBg}
          borderRadius="2xl"
          boxShadow="0 10px 40px -10px rgba(0,0,0,0.5)"
          border="1px solid"
          borderColor="gray.700"
        >
          <form onSubmit={handleCustomAuth}>
            <VStack spacing={5}>
              <Heading size="lg" mb={2}>{isLogin ? 'Welcome Back' : 'Create Account'}</Heading>

              {!isLogin && (
                <FormControl isRequired>
                  <FormLabel color="gray.300">Full Name</FormLabel>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    bg="gray.900"
                    border="none"
                    _focus={{ boxShadow: "0 0 0 2px #7F53AC" }}
                    h="50px"
                    borderRadius="xl"
                  />
                </FormControl>
              )}

              <FormControl isRequired>
                <FormLabel color="gray.300">Email Address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  bg="gray.900"
                  border="none"
                  _focus={{ boxShadow: "0 0 0 2px #7F53AC" }}
                  h="50px"
                  borderRadius="xl"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color="gray.300">Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  bg="gray.900"
                  border="none"
                  _focus={{ boxShadow: "0 0 0 2px #7F53AC" }}
                  h="50px"
                  borderRadius="xl"
                />
              </FormControl>

              {!isLogin && showOtp && (
                <FormControl isRequired>
                  <FormLabel color="purple.300">Enter 6-digit OTP from Email</FormLabel>
                  <Input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    bg="gray.900"
                    border="1px solid #7F53AC"
                    _focus={{ boxShadow: "0 0 0 2px #7F53AC" }}
                    h="50px"
                    borderRadius="xl"
                    letterSpacing="4px"
                    textAlign="center"
                    fontSize="xl"
                    fontWeight="bold"
                  />
                </FormControl>
              )}

              <Button
                type="submit"
                bgGradient={brandGradient}
                color="white"
                _hover={{ bgGradient: "linear(to-br, #647DEE, #7F53AC)", transform: "translateY(-2px)", boxShadow: "0 4px 12px rgba(127,83,172,0.4)" }}
                _active={{ transform: "translateY(0)" }}
                transition="all 0.2s"
                w="full"
                h="50px"
                borderRadius="xl"
                fontSize="lg"
                fontWeight="bold"
                isLoading={loading}
                mt={2}
              >
                {isLogin ? 'Sign In' : (!showOtp ? 'Continue with Email' : 'Verify & Setup Account')}
              </Button>

              <Button
                variant="ghost"
                color="gray.400"
                _hover={{ color: "white", bg: "transparent" }}
                onClick={() => { setIsLogin(!isLogin); setShowOtp(false); setOtp(''); }}
              >
                {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
              </Button>
            </VStack>
          </form>
        </Box>
      </VStack>
    </Flex>
  );
};

export default LoginPage;
