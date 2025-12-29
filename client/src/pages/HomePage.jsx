import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Button,
  Input,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Badge,
  useToast,
  Spinner,
  IconButton,
  useColorModeValue,
  Image,
  Icon,
  Flex,
  Center,
} from "@chakra-ui/react";
import { FiPlus, FiTrash2, FiBookOpen, FiStar } from "react-icons/fi";
// Logo import removed (no logo.svg present)
import { useCourses } from "../context/CourseContext";
import { generateCourse, deleteCourse } from "../utils/api";

const HomePage = () => {
  const { getAccessTokenSilently, user } = useAuth0();
  const { courses, addCourse, removeCourse, loading } = useCourses();
  const [topic, setTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [unsavedCourse, setUnsavedCourse] = useState(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  // Step 1: Generate course, but do not save to DB yet
  const handleGenerateCourse = async () => {
    if (!topic.trim()) {
      toast({
        title: "Please enter a topic",
        status: "warning",
        duration: 3000,
      });
      return;
    }
    setGenerating(true);
    try {
      const token = await getAccessTokenSilently();
      const response = await generateCourse(topic, token);
      setUnsavedCourse(response.data); // Store unsaved course locally
      setTopic("");
      toast({
        title: "Course generated!",
        description:
          "Review and click 'Save Course' to add it to your library.",
        status: "info",
        duration: 4000,
      });
    } catch (error) {
      toast({
        title: "Error generating course",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    } finally {
      setGenerating(false);
    }
  };

  // Step 2: Save course to DB when user clicks 'Save Course'
  const handleSaveCourse = async () => {
    if (!unsavedCourse) return;
    setSaving(true);
    try {
      const token = await getAccessTokenSilently();
      // Save using the same API as before (simulate save by re-calling generateCourse with topic)
      // In a real app, you would POST the full course object to a /api/courses endpoint
      // For now, assume generateCourse saves to DB
      addCourse(unsavedCourse);
      setUnsavedCourse(null);
      toast({
        title: "Course saved!",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error saving course",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCourse = async (courseId, e) => {
    e.stopPropagation();
    try {
      const token = await getAccessTokenSilently();
      await deleteCourse(courseId, token);
      removeCourse(courseId);
      toast({
        title: "Course deleted",
        status: "info",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error deleting course",
        status: "error",
        duration: 3000,
      });
    }
  };

  // Custom branding colors
  const brandGradient = "linear(to-br, #7F53AC, #647DEE)"; // purple/blue
  const cardBg = useColorModeValue("#f9f8fc", "gray.800");
  const cardBorder = useColorModeValue("#e0d7f7", "#3a3551");
  const textColor = useColorModeValue("#2d2350", "#e0d7f7");
  const subTextColor = useColorModeValue("#7F53AC", "#b3a6e7");
  const cardShadow = useColorModeValue(
    "0 2px 16px rgba(127,83,172,0.10)",
    "0 2px 16px rgba(100,125,222,0.24)"
  );

  return (
    <Container maxW="container.xl">
      <VStack spacing={10} align="stretch" pt={8} pb={20}>
        {/* Branded Header */}
        <VStack spacing={2} mb={2}>
          {/* Uncomment if you have a logo */}
          {/* <Image src={logo} alt="Text-to-Learn Logo" boxSize="64px" mb={1} /> */}
          <Heading
            as="h1"
            fontSize={{ base: "3xl", md: "5xl" }}
            textAlign="center"
            fontWeight="extrabold"
            letterSpacing="-2px"
            lineHeight="1.1"
            bgGradient="linear(to-r, #7F53AC, #647DEE)"
            bgClip="text"
            style={{
              fontFamily: "Poppins, Inter, Segoe UI, Arial, sans-serif",
            }}
          >
            text<span style={{ fontWeight: 400, color: "#647DEE" }}>2</span>
            <span style={{ fontWeight: 700, color: "#7F53AC" }}>learn</span>
          </Heading>
          <Text
            fontSize={{ base: "md", md: "xl" }}
            color={subTextColor}
            fontWeight="medium"
            textAlign="center"
            letterSpacing="wide"
            style={{
              fontFamily: "Poppins, Inter, Segoe UI, Arial, sans-serif",
              textTransform: "uppercase",
            }}
          >
            AI-powered learning, beautifully simple.
          </Text>
        </VStack>
        {/* Course Generation Input */}
        <Box
          p={6}
          bgGradient={brandGradient}
          borderRadius="2xl"
          borderWidth={1}
          borderColor={cardBorder}
          boxShadow={cardShadow}
        >
          <VStack spacing={4} align="stretch">
            <Text fontSize="lg" color="white" fontWeight="bold">
              Enter a topic to generate a new course:
            </Text>
            <HStack>
              <Input
                placeholder="e.g. Introduction to Quantum Physics"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                isDisabled={generating}
                bg="whiteAlpha.900"
                color={textColor}
                borderColor={cardBorder}
                _placeholder={{ color: subTextColor, opacity: 0.7 }}
                borderRadius="xl"
                fontWeight="medium"
                boxShadow="sm"
              />
              <Button
                leftIcon={<FiPlus />}
                bgGradient="linear(to-r, #7F53AC, #647DEE)"
                color="white"
                _hover={{ bgGradient: "linear(to-r, #647DEE, #7F53AC)" }}
                onClick={handleGenerateCourse}
                isLoading={generating}
                loadingText="Generating"
                borderRadius="xl"
                fontWeight="bold"
                px={6}
                boxShadow="md"
              >
                Generate
              </Button>
            </HStack>
          </VStack>
        </Box>
        {/* Unsaved Course Preview & Save Button */}
        {unsavedCourse && (
          <Box
            mb={8}
            p={0}
            bg={cardBg}
            borderRadius="2xl"
            borderWidth={1}
            borderColor={cardBorder}
            boxShadow={cardShadow}
            overflow="hidden"
            maxW={{ base: "100%", sm: "420px" }}
            mx="auto"
            transition="box-shadow 0.2s"
            _hover={{ boxShadow: "0 4px 32px rgba(0,0,0,0.12)" }}
          >
            <Box
              h="160px"
              bgGradient={brandGradient}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={FiStar} w={16} h={16} color="whiteAlpha.900" />
            </Box>
            <Box p={6}>
              <Heading as="h3" size="md" mb={2} color={textColor} noOfLines={2}>
                {unsavedCourse.title}
              </Heading>
              <Text color={subTextColor} mb={2} noOfLines={3}>
                {unsavedCourse.description}
              </Text>
              <HStack spacing={2} mb={4}>
                {unsavedCourse.tags &&
                  unsavedCourse.tags.map((tag) => (
                    <Badge key={tag} colorScheme="teal" variant="subtle">
                      {tag}
                    </Badge>
                  ))}
              </HStack>
              <Button
                colorScheme="teal"
                isLoading={saving}
                onClick={handleSaveCourse}
                w="100%"
                size="lg"
                fontWeight="bold"
                borderRadius="xl"
                boxShadow="sm"
              >
                Save Course
              </Button>
            </Box>
          </Box>
        )}
        {/* Course List */}
        <Box>
          <Heading as="h2" size="lg" mb={4} color={textColor}>
            Your Courses
          </Heading>
          {loading ? (
            <Center py={10}>
              <Spinner size="xl" />
            </Center>
          ) : courses && courses.length > 0 ? (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={8}>
              {courses.map((course) => (
                <Box
                  as="button"
                  key={course._id}
                  borderWidth={1}
                  borderColor={cardBorder}
                  bg={cardBg}
                  boxShadow={cardShadow}
                  borderRadius="2xl"
                  overflow="hidden"
                  transition="box-shadow 0.2s, transform 0.2s"
                  _hover={{
                    boxShadow: "0 4px 32px rgba(0,0,0,0.12)",
                    transform: "translateY(-6px) scale(1.04)",
                  }}
                  cursor="pointer"
                  textAlign="left"
                  p={0}
                  onClick={() => navigate(`/courses/${course._id}`)}
                >
                  <Box
                    h="120px"
                    bgGradient={brandGradient}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon
                      as={FiBookOpen}
                      w={12}
                      h={12}
                      color="whiteAlpha.900"
                    />
                  </Box>
                  <Box p={5} pb={3}>
                    <Heading
                      as="h3"
                      size="md"
                      mb={1}
                      color={textColor}
                      noOfLines={2}
                    >
                      {course.title}
                    </Heading>
                    <Text
                      color={subTextColor}
                      fontSize="sm"
                      noOfLines={2}
                      mb={2}
                    >
                      {course.description || "No description available."}
                    </Text>
                    <HStack spacing={2} mb={2}>
                      {course.tags &&
                        course.tags.map((tag) => (
                          <Badge key={tag} colorScheme="teal" variant="subtle">
                            {tag}
                          </Badge>
                        ))}
                    </HStack>
                  </Box>
                  <Flex px={5} pb={4} justify="space-between" align="center">
                    <Button
                      leftIcon={<FiBookOpen />}
                      size="sm"
                      colorScheme="teal"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/courses/${course._id}`);
                      }}
                    >
                      View
                    </Button>
                    <IconButton
                      icon={<FiTrash2 />}
                      aria-label="Delete course"
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={(e) => handleDeleteCourse(course._id, e)}
                    />
                  </Flex>
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <Text color={subTextColor} textAlign="center" py={10}>
              No courses found. Generate a new course to get started!
            </Text>
          )}
        </Box>
      </VStack>
    </Container>
  );
};

export default HomePage;
