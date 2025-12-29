import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
  Button,
  IconButton,
  Spinner,
  Center,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiArrowLeft, FiBook, FiBookmark } from "react-icons/fi";
import { getCourseById } from "../utils/api";
import { useCourses } from "../context/CourseContext";

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const { savedCourses, saveCourse, unsaveCourse } = useCourses();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  const isSaved = savedCourses.some((c) => c._id === courseId);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await getCourseById(courseId, token);
        setCourse(response.data);
      } catch (error) {
        toast({
          title: "Error loading course",
          status: "error",
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleLessonClick = (moduleIndex, lessonIndex) => {
    navigate(`/courses/${courseId}/modules/${moduleIndex}/lessons/${lessonIndex}`);
  };

  const handleSaveToggle = () => {
    if (isSaved) {
      unsaveCourse(courseId);
    } else {
      saveCourse(courseId);
    }
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!course) {
    return (
      <Container maxW="container.md" py={8}>
        <Text>Course not found</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Button
            leftIcon={<FiArrowLeft />}
            variant="ghost"
            onClick={() => navigate("/")}
            alignSelf="flex-start"
          >
            Back to Courses
          </Button>
          <IconButton
            aria-label={isSaved ? "Unsave course" : "Save course"}
            icon={<FiBookmark />}
            variant={isSaved ? "solid" : "outline"}
            colorScheme="teal"
            onClick={handleSaveToggle}
          />
        </HStack>

        <Box>
          <Heading
            size="2xl"
            mb={3}
            bgGradient="linear(to-r, blue.400, purple.500)"
            bgClip="text"
          >
            {course.title}
          </Heading>
          <Text
            color={useColorModeValue("gray.600", "gray.400")}
            fontSize="lg"
            mb={4}
          >
            {course.description}
          </Text>
          <HStack spacing={2} flexWrap="wrap">
            {course.tags?.map((tag, idx) => (
              <Badge key={idx} colorScheme="blue" fontSize="md">
                {tag}
              </Badge>
            ))}
          </HStack>
        </Box>

        <Box>
          <Heading size="lg" mb={4}>
            Course Modules
          </Heading>
          <Accordion allowMultiple defaultIndex={[0]}>
            {course.modules?.map((module, moduleIndex) => (
              <AccordionItem
                key={module._id}
                bg={useColorModeValue("white", "gray.800")}
                border="1px"
                borderColor={useColorModeValue("gray.200", "gray.700")}
                borderRadius="lg"
                mb={4}
                overflow="hidden"
              >
                <AccordionButton
                  _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
                  p={4}
                >
                  <Box flex="1" textAlign="left">
                    <HStack>
                      <Badge colorScheme="purple">
                        Module {moduleIndex + 1}
                      </Badge>
                      <Heading size="md">{module.title}</Heading>
                    </HStack>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <VStack align="stretch" spacing={2}>
                    {module.lessons?.map((lesson, lessonIndex) => (
                      <Button
                        key={lesson._id}
                        variant="ghost"
                        justifyContent="flex-start"
                        leftIcon={<FiBook />}
                        onClick={() =>
                          handleLessonClick(moduleIndex, lessonIndex)
                        }
                        _hover={{
                          bg: useColorModeValue("gray.100", "gray.700"),
                        }}
                        py={6}
                      >
                        {lessonIndex + 1}. {lesson.title}
                      </Button>
                    ))}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
      </VStack>
    </Container>
  );
};

export default CourseDetailPage;
