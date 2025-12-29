import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  VStack,
  Button,
  Text,
  Avatar,
  Divider,
  useColorMode,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiHome, FiBook, FiLogOut, FiMoon, FiSun } from 'react-icons/fi';

const Sidebar = () => {
  const { user, logout } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();
  const { colorMode, toggleColorMode } = useColorMode();

  const isActive = (path) => location.pathname === path;

  return (
    <Box
      w="280px"
      bg={useColorModeValue('white', 'gray.800')}
      borderRight="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      p={4}
      display="flex"
      flexDirection="column"
      h="100vh"
    >
      <VStack spacing={4} align="stretch" flex="1">
        <Box textAlign="center" py={4}>
          <Text
            fontSize="2xl"
            fontWeight="bold"
            bgGradient="linear(to-r, blue.400, purple.500)"
            bgClip="text"
          >
            Text to Learn
          </Text>
        </Box>

        <Divider />

        <VStack spacing={2} align="stretch">
          <Button
            leftIcon={<FiHome />}
            variant={isActive('/') ? 'solid' : 'ghost'}
            colorScheme={isActive('/') ? 'blue' : 'gray'}
            justifyContent="flex-start"
            onClick={() => navigate('/')}
          >
            Home
          </Button>


        </VStack>

        <Box flex="1" />

        <Divider />

        <VStack spacing={3} align="stretch">
          <Box display="flex" alignItems="center" gap={3}>
            <Avatar size="sm" name={user?.name} src={user?.picture} />
            <Box flex="1" overflow="hidden">
              <Text fontSize="sm" fontWeight="bold" isTruncated>
                {user?.name}
              </Text>
              <Text fontSize="xs" color={useColorModeValue('gray.600', 'gray.400')} isTruncated>
                {user?.email}
              </Text>
            </Box>
            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
              onClick={toggleColorMode}
              variant="ghost"
            />
          </Box>

          <Button
            leftIcon={<FiLogOut />}
            variant="ghost"
            colorScheme="red"
            justifyContent="flex-start"
            onClick={() => logout({ returnTo: window.location.origin })}
          >
            Logout
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
};

export default Sidebar;
