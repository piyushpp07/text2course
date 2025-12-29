import {
  Box,
  Flex,
  Text,
  Avatar,
  Button,
  IconButton,
  useColorMode,
} from "@chakra-ui/react";
import { FiLogOut, FiMoon, FiSun } from "react-icons/fi";
import { useAuth0 } from "@auth0/auth0-react";

const Topbar = () => {
  const { user, logout } = useAuth0();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box w="100%" bg="gray.800" px={6} py={3} boxShadow="sm" zIndex={10}>
      <Flex align="center" justify="space-between">
        <Flex align="center" gap={3}>
          <Text
            fontSize="2xl"
            fontWeight="bold"
            bgGradient="linear(to-r, blue.400, purple.500)"
            bgClip="text"
            letterSpacing="tight"
          >
            Text to Learn
          </Text>
        </Flex>
        <Flex align="center" gap={4}>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
            onClick={toggleColorMode}
            variant="ghost"
            color="gray.400"
            fontSize="xl"
          />
          <Avatar size="sm" name={user?.name} src={user?.picture} />
          <Box textAlign="right" mr={2}>
            <Text fontSize="sm" fontWeight="bold" color="gray.100" isTruncated>
              {user?.name}
            </Text>
            <Text fontSize="xs" color="gray.400" isTruncated>
              {user?.email}
            </Text>
          </Box>
          <Button
            leftIcon={<FiLogOut />}
            variant="ghost"
            colorScheme="red"
            size="sm"
            onClick={() => logout({ returnTo: window.location.origin })}
          >
            Logout
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Topbar;
