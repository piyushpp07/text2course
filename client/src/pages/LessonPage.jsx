import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Spinner,
  Center,
  Badge,
  useToast,
  List,
  ListItem,
  ListIcon,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiArrowLeft,
  FiDownload,
  FiRefreshCw,
  FiCheckCircle,
} from "react-icons/fi";
import {
  getCourseById,
  generateLessonContent,
  translateToHinglish,
} from "../utils/api";
import LessonRenderer from "../components/LessonRenderer";
import LessonPDFExporter from "../components/LessonPDFExporter";

const LessonPage = () => {
  const { courseId, moduleIndex, lessonIndex } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [hinglish, setHinglish] = useState("");
  const [translating, setTranslating] = useState(false);
  // Translate lesson content to Hinglish
  const handleTranslateToHinglish = async () => {
    if (!lesson || !lesson.content) return;
    setTranslating(true);
    try {
      // Concatenate all text blocks for translation
      const textToTranslate = lesson.content
        .filter(
          (block) => block.type === "paragraph" || block.type === "heading"
        )
        .map((block) => block.text)
        .join("\n\n");
      const result = await translateToHinglish(textToTranslate);
      setHinglish(result);
      toast({
        title: "Translated to Hinglish!",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Translation failed",
        status: "error",
        duration: 3000,
      });
    } finally {
      setTranslating(false);
    }
  };
  const navigate = useNavigate();
  const toast = useToast();
  const lessonRef = useRef();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await getCourseById(courseId, token);
        setCourse(response.data);

        const module = response.data.modules[parseInt(moduleIndex)];
        const lessonData = module?.lessons[parseInt(lessonIndex)];
        setLesson(lessonData);
      } catch (error) {
        toast({
          title: "Error loading lesson",
          status: "error",
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, moduleIndex, lessonIndex]);

  const handleGenerateContent = async () => {
    if (!lesson) return;

    setGenerating(true);
    try {
      const token = await getAccessTokenSilently();
      const module = course.modules[parseInt(moduleIndex)];
      const response = await generateLessonContent(
        courseId,
        module._id,
        lesson._id,
        token
      );
      setLesson(response.data);
      toast({
        title: "Lesson content generated!",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error generating content",
        status: "error",
        duration: 3000,
      });
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!lesson) {
    return (
      <Container maxW="container.md" py={8}>
        <Text>Lesson not found</Text>
      </Container>
    );
  }

  const hasContent = lesson.content && lesson.content.length > 0;

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Button
          leftIcon={<FiArrowLeft />}
          variant="ghost"
          onClick={() => navigate(`/courses/${courseId}`)}
          alignSelf="flex-start"
        >
          Back to Course
        </Button>

        <Box>
          <HStack mb={2}>
            <Badge colorScheme="purple">
              Module {parseInt(moduleIndex) + 1}
            </Badge>
            <Badge colorScheme="blue">Lesson {parseInt(lessonIndex) + 1}</Badge>
          </HStack>
          <Heading
            size="2xl"
            mb={4}
            bgGradient="linear(to-r, blue.400, purple.500)"
            bgClip="text"
          >
            {lesson.title}
          </Heading>

          {lesson.objectives && lesson.objectives.length > 0 && (
            <Box
              bgGradient={useColorModeValue(
                "linear(to-br, blue.50, blue.100)",
                "linear(to-br, blue.900, blue.800)"
              )}
              p={6}
              borderRadius="lg"
              mb={6}
              border="1px"
              borderColor="blue.700"
            >
              <Heading size="md" mb={3}>
                Learning Objectives:
              </Heading>
              <List spacing={2}>
                {lesson.objectives.map((obj, idx) => (
                  <ListItem key={idx}>
                    <ListIcon
                      as={FiCheckCircle}
                      color={useColorModeValue("blue.500", "blue.400")}
                    />
                    {obj}
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>

        {!hasContent ? (
          <Box
            bg={useColorModeValue("gray.100", "gray.800")}
            p={8}
            borderRadius="md"
            textAlign="center"
          >
            <VStack spacing={4}>
              <Text color={useColorModeValue("gray.600", "gray.400")}>
                This lesson hasn't been generated yet. Click below to create
                detailed content.
              </Text>
              <Button
                leftIcon={<FiRefreshCw />}
                colorScheme="blue"
                onClick={handleGenerateContent}
                isLoading={generating}
                loadingText="Generating..."
                size="lg"
              >
                Generate Lesson Content
              </Button>
            </VStack>
          </Box>
        ) : (
          <>
            <HStack justify="flex-end" spacing={4}>
              <LessonPDFExporter lesson={lesson} lessonRef={lessonRef} />
              <Button
                colorScheme="purple"
                size="sm"
                isLoading={translating}
                onClick={handleTranslateToHinglish}
              >
                Translate to Hinglish
              </Button>
            </HStack>

            <Box
              ref={lessonRef}
              bg={useColorModeValue("white", "gray.900")}
              p={8}
              borderRadius="lg"
              border="1px"
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <LessonRenderer content={lesson.content} />
            </Box>
            {hinglish && (
              <Box
                mt={6}
                bg={useColorModeValue("purple.50", "purple.900")}
                p={6}
                borderRadius="lg"
                border="1px"
                borderColor={useColorModeValue("purple.200", "purple.700")}
                boxShadow="md"
              >
                <Heading
                  size="md"
                  mb={2}
                  color={useColorModeValue("purple.700", "purple.200")}
                >
                  Hinglish Translation
                </Heading>
                <Text whiteSpace="pre-line">{hinglish}</Text>
              </Box>
            )}
          </>
        )}
      </VStack>
    </Container>
  );
};

export default LessonPage;
