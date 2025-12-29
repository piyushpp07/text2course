import {
  Box,
  Heading,
  Text,
  Avatar,
  VStack,
  Button,
  useColorMode,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { FiLogOut, FiSun, FiMoon } from "react-icons/fi";
import { useAuth0 } from "@auth0/auth0-react";

const ProfilePage = () => {
  const { user, logout } = useAuth0();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={10}
      p={6}
      bg={colorMode === "light" ? "white" : "gray.800"}
      borderRadius="lg"
      boxShadow="md"
    >
      <VStack spacing={4}>
        <Avatar size="xl" name={user?.name} src={user?.picture} />
        <Heading as="h2" size="lg">
          {user?.name || "User"}
        </Heading>
        <Text color="gray.500">{user?.email}</Text>
        <HStack pt={4} spacing={4}>
          <Button
            leftIcon={<Icon as={colorMode === "light" ? FiMoon : FiSun} />}
            onClick={toggleColorMode}
            variant="outline"
          >
            {colorMode === "light" ? "Dark" : "Light"} Mode
          </Button>
          <Button
            leftIcon={<FiLogOut />}
            colorScheme="red"
            variant="solid"
            onClick={() => logout({ returnTo: window.location.origin })}
          >
            Log Out
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default ProfilePage;
