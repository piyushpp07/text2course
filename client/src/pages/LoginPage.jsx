import { useAuth0 } from '@auth0/auth0-react';
import { Box, Button, Container, Heading, Text, VStack, Image } from '@chakra-ui/react';

const LoginPage = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Container maxW="container.md" h="100vh">
      <VStack spacing={8} justify="center" h="full">
        <Heading size="2xl" bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text">
          Text to Learn
        </Heading>
        <Text fontSize="xl" textAlign="center" color="gray.400">
          AI-Powered Course Generator
        </Text>
        <Text textAlign="center" color="gray.500" maxW="md">
          Transform any topic into a structured, comprehensive online course with rich content,
          videos, quizzes, and downloadable lessons.
        </Text>
        <Button
          colorScheme="blue"
          size="lg"
          onClick={() => loginWithRedirect()}
          px={8}
        >
          Sign In / Sign Up
        </Button>
      </VStack>
    </Container>
  );
};

export default LoginPage;
