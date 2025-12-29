import {
  Box,
  Heading,
  Text,
  Avatar,
  VStack,
  Button,
  useColorMode,
  useColorModeValue,
  HStack,
  Icon,
  SimpleGrid,
  Spinner,
  Center,
  Link,
} from "@chakra-ui/react";
import { FiLogOut, FiSun, FiMoon } from "react-icons/fi";
import { useAuth0 } from "@auth0/auth0-react";
import { useCourses } from "../context/CourseContext";
import { Link as RouterLink } from "react-router-dom";

const ProfilePage = () => {
  const { user, logout } = useAuth0();
  const { colorMode, toggleColorMode } = useColorMode();
  const { savedCourses, loadingSaved } = useCourses();
  const cardBg = useColorModeValue("white", "gray.800");

  return (
    <Box maxW="container.lg" mx="auto" mt={10} p={6}>
      <VStack spacing={8}>
        <Box
          w="full"
          p={6}
          bg={cardBg}
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
                onClick={() =>
                  logout({ logoutParams: { returnTo: window.location.origin } })
                }
              >
                Log Out
              </Button>
            </HStack>
          </VStack>
        </Box>

        <Box w="full">
          <Heading as="h3" size="xl" mb={6}>
            Saved Courses
          </Heading>
          {loadingSaved ? (
            <Center>
              <Spinner size="xl" />
            </Center>
          ) : savedCourses.length === 0 ? (
            <Text>You have no saved courses yet.</Text>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {savedCourses.map((course) => (
                <Link
                  as={RouterLink}
                  to={`/courses/${course._id}`}
                  _hover={{ textDecoration: "none" }}
                  key={course._id}
                >
                  <Box
                    p={6}
                    bg={cardBg}
                    borderRadius="lg"
                    boxShadow="md"
                    h="full"
                    _hover={{ transform: "translateY(-5px)", boxShadow: "lg" }}
                    transition="all 0.2s"
                  >
                    <Heading size="md">{course.title}</Heading>
                    <Text fontSize="sm" color="gray.500" noOfLines={3}>
                      {course.description}
                    </Text>
                  </Box>
                </Link>
              ))}
            </SimpleGrid>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default ProfilePage;
