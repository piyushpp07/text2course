import { useState } from "react";
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
  SimpleGrid,
  Badge,
  useToast,
  Spinner,
  IconButton,
  useColorModeValue,
  Icon,
  Flex,
  Center,
  Image,
  InputGroup,
  InputRightElement,
  Divider,
  AspectRatio
} from "@chakra-ui/react";
import { FiPlus, FiTrash2, FiPlayCircle, FiMoreVertical, FiClock, FiSearch, FiCode, FiBriefcase, FiAperture, FiRefreshCw, FiBookOpen } from "react-icons/fi";
import { useCourses } from "../context/CourseContext";
import { generateCourse, deleteCourse } from "../utils/api";

const HomePage = () => {
  const localUser = JSON.parse(localStorage.getItem('user'));
  const user = localUser;

  const { courses, addCourse, removeCourse, loading, fetchCourses } = useCourses();
  const [topic, setTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [unsavedCourse, setUnsavedCourse] = useState(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

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
      const token = localStorage.getItem('token');
      const response = await generateCourse(topic, token);
      setUnsavedCourse(response.data);
      setTopic("");
      toast({
        title: "Course generated!",
        description: "Review and click 'Save to My Learning' to add it.",
        status: "success",
        duration: 4000,
        position: "top-right"
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

  const handleSaveCourse = async () => {
    if (!unsavedCourse) return;
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const courseId = unsavedCourse._id;

      const { saveCourse: apiSaveCourse } = await import("../utils/api");
      await apiSaveCourse(courseId, token);

      addCourse(unsavedCourse);
      setUnsavedCourse(null);

      toast({
        title: "Course saved to My Learning!",
        status: "success",
        duration: 3000,
        position: "top-right"
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
      const token = localStorage.getItem('token');
      await deleteCourse(courseId, token);
      removeCourse(courseId);
      toast({
        title: "Course removed from library",
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

  // Udemy/LinkedIn inspired professional theme tokens
  const pageBg = useColorModeValue("white", "black");
  const heroBg = useColorModeValue("gray.900", "#111111"); // Dark professional hero
  const cardBg = useColorModeValue("white", "#1a1a1a");
  const cardBorder = useColorModeValue("gray.200", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.50");
  const mutedText = useColorModeValue("gray.600", "gray.400");
  const accentColor = useColorModeValue("blue.600", "blue.400"); // Corporate trust blue

  // Contextually relevant image generation using keywords
  const getCourseImage = (idOrTitle) => {
    const rawString = idOrTitle || "education,technology";
    // Clean string: remove special chars, take words > 3 letters for meaningful keywords
    const keywords = rawString
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .split(/\s+/)
      .filter(word => word.length > 3)
      .slice(0, 3) // Maximum 3 keywords for better flickr results
      .join(",") || "education,learning";

    return `https://loremflickr.com/800/450/${keywords}/all`;
  };

  return (
    <Box bg={pageBg} minH="100vh" w="100%" pb={20}>

      {/* PROFESSIONAL HERO SECTION */}
      <Box bg={heroBg} w="100%" py={{ base: 12, md: 24 }} display="flex" flexDirection="column" alignItems="center">
        <Container maxW="container.lg">
          <VStack spacing={6} align={{ base: "center", md: "start" }} textAlign={{ base: "center", md: "left" }}>
            <Heading color="white" size="2xl" fontWeight="bold" letterSpacing="tight">
              Build your future with AI.
            </Heading>
            <Text color="gray.300" fontSize="xl" maxW="2xl">
              Generate an immersive, personalized professional course instantly. Enter any framework, skill, or discipline you want to master below.
            </Text>

            <Box w="100%" maxW="3xl" bg="white" borderRadius="md" p={2} boxShadow="lg" display="flex" flexDirection={{ base: "column", sm: "row" }} gap={2}>
              <InputGroup size="lg" flex="1">
                <Input
                  placeholder="e.g. Advanced System Design architecture"
                  variant="unstyled"
                  p={4}
                  color="gray.800"
                  _placeholder={{ color: "gray.500" }}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleGenerateCourse();
                  }}
                />
              </InputGroup>
              <Button
                size="lg"
                colorScheme="blue"
                bg="blue.600"
                _hover={{ bg: "blue.700" }}
                isLoading={generating}
                loadingText="Generating..."
                onClick={handleGenerateCourse}
                px={8}
                w={{ base: "100%", sm: "auto" }}
                borderRadius="sm"
                fontWeight="bold"
              >
                Synthesize Course
              </Button>
            </Box>

            <HStack spacing={6} color="gray.400" pt={4} display={{ base: "none", md: "flex" }}>
              <HStack><Icon as={FiCode} /><Text fontSize="sm">Software Engineering</Text></HStack>
              <HStack><Icon as={FiBriefcase} /><Text fontSize="sm">Business</Text></HStack>
              <HStack><Icon as={FiAperture} /><Text fontSize="sm">AI & Machine Learning</Text></HStack>
            </HStack>
          </VStack>
        </Container>
      </Box>

      <Container maxW="container.xl" pt={12}>

        {/* PENDING / UNSAVED COURSE PREVIEW */}
        {unsavedCourse && (
          <Box mb={16}>
            <Heading size="md" mb={6} color={textColor}>Course Generation Completed</Heading>
            <Box
              bg={cardBg}
              borderRadius="lg"
              border="1px solid"
              borderColor="blue.200"
              boxShadow="xl"
              overflow="hidden"
              maxW="800px"
            >
              <Flex direction={{ base: "column", md: "row" }}>
                <Box w={{ base: "100%", md: "350px" }} h={{ base: "200px", md: "auto" }} position="relative">
                  <Image
                    src={getCourseImage(unsavedCourse.title)}
                    alt="Course Preview"
                    objectFit="cover"
                    w="100%"
                    h="100%"
                  />
                </Box>
                <Box p={8} flex="1">
                  <Badge colorScheme="blue" mb={3} borderRadius="full" px={3}>New Synthesis</Badge>
                  <Heading as="h3" size="lg" mb={3} color={textColor} lineHeight="1.3">
                    {unsavedCourse.title}
                  </Heading>
                  <Text color={mutedText} mb={6} noOfLines={3} fontSize="md">
                    {unsavedCourse.description}
                  </Text>

                  <HStack spacing={4}>
                    <Button
                      colorScheme="blue"
                      isLoading={saving}
                      onClick={handleSaveCourse}
                      size="lg"
                      fontWeight="bold"
                      borderRadius="sm"
                    >
                      Save to My Learning
                    </Button>
                    <Button variant="ghost" onClick={() => setUnsavedCourse(null)}>
                      Discard
                    </Button>
                  </HStack>
                </Box>
              </Flex>
            </Box>
          </Box>
        )}

        {/* MY LEARNING SECTION */}
        <Box>
          <HStack justify="space-between" mb={8} borderBottom="1px solid" borderColor={cardBorder} pb={4}>
            <Heading as="h2" size="lg" color={textColor} fontWeight="bold">
              My Learning
            </Heading>
            <Button
              leftIcon={<FiRefreshCw />}
              size="sm"
              variant="ghost"
              onClick={fetchCourses}
              isLoading={loading}
              color={mutedText}
            >
              Refresh Library
            </Button>
          </HStack>

          {loading ? (
            <Center py={20}>
              <Spinner size="xl" color="blue.500" thickness="4px" />
            </Center>
          ) : courses && courses.length > 0 ? (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
              {courses.map((course) => (
                <Box
                  as="article"
                  key={course._id}
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={cardBorder}
                  borderRadius="md"
                  overflow="hidden"
                  position="relative"
                  transition="all 0.2s ease"
                  _hover={{
                    cursor: "pointer",
                    boxShadow: "lg",
                    borderColor: "gray.300",
                    transform: "translateY(-4px)",
                  }}
                  onClick={() => navigate(`/courses/${course._id}`)}
                  display="flex"
                  flexDirection="column"
                  h="100%"
                >
                  {/* Aspect Ratio enforces consistent image heights */}
                  <AspectRatio ratio={16 / 9} w="100%">
                    <Image
                      src={getCourseImage(course.title)}
                      alt={course.title}
                      objectFit="cover"
                      fallbackSrc="https://via.placeholder.com/800x450?text=Course"
                    />
                  </AspectRatio>

                  <Box p={4} flex="1" display="flex" flexDirection="column">
                    <Heading
                      as="h3"
                      size="sm"
                      mb={2}
                      color={textColor}
                      lineHeight="1.4"
                      noOfLines={2}
                      fontWeight="bold"
                    >
                      {course.title}
                    </Heading>
                    <Text
                      color={mutedText}
                      fontSize="xs"
                      noOfLines={2}
                      mb={4}
                    >
                      {course.description || "No description provided. Dive in to learn more."}
                    </Text>

                    {/* Push remaining content to bottom */}
                    <Box mt="auto">
                      {course.tags && course.tags.length > 0 && (
                        <HStack spacing={2} mb={4} flexWrap="wrap">
                          <Text fontSize="xs" fontWeight="bold" color="blue.600">
                            {course.tags[0].toUpperCase()}
                          </Text>
                        </HStack>
                      )}

                      <Flex justify="space-between" align="center" borderTop="1px solid" borderColor={cardBorder} pt={3}>
                        <HStack color={mutedText} fontSize="xs">
                          <Icon as={FiPlayCircle} />
                          <Text>{course.modules?.length || 0} Modules</Text>
                        </HStack>

                        <IconButton
                          icon={<FiTrash2 />}
                          aria-label="Remove course"
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={(e) => handleDeleteCourse(course._id, e)}
                        />
                      </Flex>
                    </Box>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <Center py={20} flexDirection="column" border="1px dashed" borderColor={cardBorder} borderRadius="lg">
              <Icon as={FiBookOpen} w={12} h={12} color="gray.300" mb={4} />
              <Heading size="md" color={textColor} mb={2}>No courses in your library</Heading>
              <Text color={mutedText} mb={6}>Your learning journey starts here. Use the search bar above to generate your first course.</Text>
              <Button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                colorScheme="blue"
              >
                Start Learning
              </Button>
            </Center>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
