import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Flex,
  IconButton,
  Divider,
  Textarea,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Tooltip,
  Icon,
} from "@chakra-ui/react";
import {
  FiArrowLeft,
  FiRefreshCw,
  FiCheckCircle,
  FiBook,
  FiSidebar,
  FiEdit3,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiSave,
  FiVolume2,
  FiSquare,
  FiGlobe
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import {
  getCourseById,
  generateLessonContent,
  translateToHinglish,
  toggleLessonComplete,
  updateLesson,
} from "../utils/api";
import LessonRenderer from "../components/LessonRenderer";
import LessonPDFExporter from "../components/LessonPDFExporter";

const MotionBox = motion(Box);

const LessonPage = () => {
  const { courseId, moduleIndex, lessonIndex } = useParams();
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [hinglish, setHinglish] = useState("");
  const [translating, setTranslating] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [togglingComplete, setTogglingComplete] = useState(false);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const { isOpen: isSidebarOpen, onOpen: onSidebarOpen, onClose: onSidebarClose } = useDisclosure();
  // Notes toggled state for sliding panel
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const toggleNotes = () => setIsNotesOpen(!isNotesOpen);

  const navigate = useNavigate();
  const toast = useToast();
  const lessonRef = useRef();

  // Theming & Colors
  const bg = useColorModeValue("gray.50", "#000000");
  const cardBg = useColorModeValue("white", "#111111");
  const borderColor = useColorModeValue("gray.200", "gray.800");
  const textMuted = useColorModeValue("gray.600", "gray.400");
  const brandGradient = "linear(to-r, #7F53AC, #647DEE)";

  const mIdx = parseInt(moduleIndex);
  const lIdx = parseInt(lessonIndex);

  // Pagination Logic
  let prevLesson = null;
  let nextLesson = null;

  if (course) {
    if (lIdx > 0) prevLesson = { m: mIdx, l: lIdx - 1 };
    else if (mIdx > 0) {
      const prevModLessonsCount = course.modules[mIdx - 1]?.lessons?.length || 0;
      if (prevModLessonsCount > 0) {
        prevLesson = { m: mIdx - 1, l: prevModLessonsCount - 1 };
      }
    }

    const currModLessonsCount = course.modules[mIdx]?.lessons?.length || 0;
    if (lIdx < currModLessonsCount - 1) nextLesson = { m: mIdx, l: lIdx + 1 };
    else if (mIdx < course.modules.length - 1) {
      const nextModLessonsCount = course.modules[mIdx + 1]?.lessons?.length || 0;
      if (nextModLessonsCount > 0) {
        nextLesson = { m: mIdx + 1, l: 0 };
      }
    }
  }

  const navigateToLesson = (m, l) => navigate(`/courses/${courseId}/modules/${m}/lessons/${l}`);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await getCourseById(courseId, token);
        setCourse(response.data);

        const module = response.data.modules[mIdx];
        const lessonData = module?.lessons[lIdx];
        setLesson(lessonData);
        if (lessonData?.hinglishText) {
          setHinglish(lessonData.hinglishText);
        } else {
          setHinglish("");
        }

        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.completedLessons && lessonData) {
          setIsCompleted(user.completedLessons.includes(lessonData._id));
        }

        const savedNotes = localStorage.getItem(`notes_${courseId}_${mIdx}_${lIdx}`);
        setNotes(savedNotes || "");
      } catch (error) {
        toast({ title: "Error loading lesson", status: "error", duration: 3000 });
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, mIdx, lIdx]);

  const handleNotesChange = (e) => {
    const val = e.target.value;
    setNotes(val);
    localStorage.setItem(`notes_${courseId}_${mIdx}_${lIdx}`, val);
  };

  const handleToggleComplete = async () => {
    setTogglingComplete(true);
    try {
      const token = localStorage.getItem("token");
      const response = await toggleLessonComplete(lesson._id, token);
      setIsCompleted(response.data.isCompleted);

      const user = JSON.parse(localStorage.getItem("user")) || {};
      if (!user.completedLessons) user.completedLessons = [];

      if (response.data.isCompleted) {
        if (!user.completedLessons.includes(lesson._id)) user.completedLessons.push(lesson._id);
      } else {
        user.completedLessons = user.completedLessons.filter((id) => id !== lesson._id);
      }
      localStorage.setItem("user", JSON.stringify(user));

      toast({
        title: response.data.isCompleted ? "Lesson Completed! 🎉" : "Marked as incomplete",
        status: "success",
        position: "top",
        duration: 3000,
      });

      // Auto route to next lesson if completed
      if (response.data.isCompleted && nextLesson) {
        setTimeout(() => {
          navigate(`/courses/${courseId}/modules/${nextLesson.m}/lessons/${nextLesson.l}`);
        }, 1500);
      }
    } catch (error) {
      toast({ title: "Error updating progress", status: "error", duration: 3000 });
    } finally {
      setTogglingComplete(false);
    }
  };

  const handleTranslateToHinglish = async () => {
    if (!lesson || !lesson.content) return;
    setTranslating(true);
    try {
      const token = localStorage.getItem("token");
      const textToTranslate = lesson.content
        .filter((block) => block.type === "paragraph" || block.type === "heading")
        .map((block) => block.text)
        .join("\n\n");
      const result = await translateToHinglish(textToTranslate);
      setHinglish(result);

      await updateLesson(lesson._id, { hinglishText: result }, token);
      toast({ title: "Translated successfully!", status: "success", duration: 3000 });
    } catch (error) {
      toast({ title: "Translation failed", status: "error", duration: 3000 });
    } finally {
      setTranslating(false);
    }
  };

  const handleGenerateContent = async () => {
    if (!lesson) return;
    setGenerating(true);
    try {
      const token = localStorage.getItem("token");
      const module = course.modules[mIdx];
      const response = await generateLessonContent(courseId, module._id, lesson._id, token);
      setLesson(response.data);
      if (response.data?.hinglishText) setHinglish(response.data.hinglishText);
      else setHinglish("");
      toast({ title: "AI generated new content!", status: "success", duration: 3000 });
    } catch (error) {
      toast({ title: "Generation failed", status: "error", duration: 3000 });
    } finally {
      setGenerating(false);
    }
  };

  const handleTextToSpeech = () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    if (!lesson || !lesson.content) return;

    // Convert to plain text and completely strip rogue HTML characters/tags 
    const plainTextRaw = lesson.content
      .filter((block) => block.type === "paragraph" || block.type === "heading" || block.type === "list")
      .map((block) => {
        if (block.type === "list") return block.items.join(". ");
        return block.text || "";
      })
      .join(". ");

    const strippedText = plainTextRaw.replace(/<[^>]+>/g, "").replace(/&[^;]+;/g, " ");

    window.speechSynthesis.cancel(); // Cleans out old speech caches

    // Chunking text prevents 15-second TTS native browser engine crash
    const chunks = strippedText.match(/[^.!?]+[.!?]+/g) || [strippedText];

    // Find the best "female" or premium voice available natively on the OS
    const voices = window.speechSynthesis.getVoices();
    const femaleVoices = voices.filter(v =>
      v.lang.startsWith('en') &&
      (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Victoria') || v.name.includes('Karen') || v.name.includes('Zira'))
    );
    const preferredVoice = femaleVoices.find(v => v.name.includes('Premium') || v.name.includes('Enhanced')) || femaleVoices[0];

    chunks.forEach((chunk, index) => {
      const utterance = new SpeechSynthesisUtterance(chunk.trim());
      utterance.rate = 1.0;
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      if (index === chunks.length - 1) {
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
      }
      window.speechSynthesis.speak(utterance);
    });

    setIsPlayingAudio(true);
  };

  const renderCurriculum = () => (
    <Box>
      <Heading size="md" mb={4} px={2}>Course Overview</Heading>
      <Accordion allowMultiple defaultIndex={[mIdx]}>
        {course?.modules?.map((mod, modIdx) => (
          <AccordionItem key={mod._id} border="none">
            <AccordionButton borderRadius="md" _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}>
              <Box flex="1" textAlign="left" fontWeight="bold" fontSize="sm">
                Module {modIdx + 1}: {mod.title}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} px={2}>
              <VStack align="stretch" spacing={1}>
                {mod.lessons?.map((les, lesIdx) => {
                  const isActive = modIdx === mIdx && lesIdx === lIdx;
                  return (
                    <Button
                      key={les._id}
                      variant="ghost"
                      justifyContent="flex-start"
                      size="sm"
                      isActive={isActive}
                      bg={isActive ? useColorModeValue("purple.50", "purple.900") : "transparent"}
                      color={isActive ? useColorModeValue("purple.700", "purple.200") : "inherit"}
                      _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
                      onClick={() => navigate(`/courses/${courseId}/modules/${modIdx}/lessons/${lesIdx}`)}
                    >
                      {lesIdx + 1}. {les.title}
                    </Button>
                  );
                })}
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );

  const renderNotes = () => (
    <Flex direction="column" h="full">
      <Heading size="md" mb={4}>My Notes</Heading>
      <Textarea
        value={notes}
        onChange={handleNotesChange}
        placeholder="Type your notes here... They auto-save!"
        size="md"
        flex="1"
        resize="none"
        borderRadius="xl"
        bg={useColorModeValue("gray.50", "gray.900")}
        border="1px solid"
        borderColor={borderColor}
        _focus={{ borderColor: "#7F53AC", boxShadow: "0 0 0 1px #7F53AC" }}
        p={4}
      />
      <HStack justify="space-between" mt={4} color="gray.500" fontSize="sm">
        <Text><Icon as={FiSave} mr={1} />Auto-saving</Text>
        <Text>{notes.length} words</Text>
      </HStack>
    </Flex>
  );

  if (loading) return <Center h="100vh"><Spinner size="xl" thickness="4px" speed="0.65s" color="purple.500" /></Center>;
  if (!lesson) return <Center h="100vh"><Text>Lesson not found</Text></Center>;

  const hasContent = lesson.content && lesson.content.length > 0;

  // Render an optimized, animated UI
  return (
    <Box w="100%" h="100%" overflow="hidden" position="relative">
      <Flex direction="column" h="100%" overflowY="auto" id="main-content" pb={20}>
        <Container maxW="container.lg" py={8}>
          <AnimatePresence mode="popLayout">
            <MotionBox
              key={lesson._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Box mb={8} position="relative">
                <HStack justify="space-between" align="center" mb={6}>
                  <Button leftIcon={<FiArrowLeft />} variant="ghost" size="sm" onClick={() => navigate(`/courses/${courseId}`)}>
                    Back to Overview
                  </Button>
                  <HStack>
                    <Button leftIcon={<FiSidebar />} variant="outline" size="sm" onClick={onSidebarOpen} display={{ base: "flex", lg: "none" }}>Curriculum</Button>
                    <Button
                      leftIcon={<FiEdit3 />}
                      variant={isNotesOpen ? "solid" : "outline"}
                      colorScheme={isNotesOpen ? "purple" : "gray"}
                      size="sm"
                      onClick={toggleNotes}
                    >
                      Notes
                    </Button>
                  </HStack>
                </HStack>

                <HStack mb={4}>
                  <Badge colorScheme="purple" px={2} py={1} borderRadius="md" fontSize="xs">Module {mIdx + 1}</Badge>
                  <Badge colorScheme="blue" px={2} py={1} borderRadius="md" fontSize="xs">Lesson {lIdx + 1}</Badge>
                </HStack>
                <Heading size="2xl" mb={4} lineHeight="1.2" bgGradient={brandGradient} bgClip="text">
                  {lesson.title}
                </Heading>

                {lesson.objectives && lesson.objectives.length > 0 && (
                  <Box
                    bg={useColorModeValue("purple.50", "rgba(127, 83, 172, 0.1)")}
                    p={6}
                    borderRadius="2xl"
                    border="1px solid"
                    borderColor={useColorModeValue("purple.100", "purple.800")}
                    mb={6}
                  >
                    <Heading size="sm" mb={3} color={useColorModeValue("purple.800", "purple.200")}>Target Objectives</Heading>
                    <List spacing={3}>
                      {lesson.objectives.map((obj, idx) => (
                        <ListItem key={idx} display="flex" alignItems="flex-start" fontSize="md">
                          <ListIcon as={FiCheckCircle} color="purple.500" mt={1} />
                          <Text color={useColorModeValue("gray.700", "gray.300")}>{obj}</Text>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Box>

              {!hasContent ? (
                <Center p={10} bg={cardBg} borderRadius="2xl" border="1px dashed" borderColor="gray.400" textAlign="center">
                  <VStack spacing={6}>
                    <Text fontSize="lg" color={textMuted}>This lesson module is currently empty.</Text>
                    <Button leftIcon={<FiRefreshCw />} onClick={handleGenerateContent} isLoading={generating} size="lg" bgGradient={brandGradient} color="white" _hover={{ filter: "brightness(1.1)" }} boxShadow="lg" borderRadius="xl">
                      Synthesize Lesson Content
                    </Button>
                  </VStack>
                </Center>
              ) : (
                <Box>
                  <Flex justify="space-between" align="center" mb={6} flexWrap="wrap" gap={4}>
                    <HStack spacing={3}>
                      <Button
                        size="sm"
                        colorScheme="teal"
                        variant={isPlayingAudio ? "solid" : "outline"}
                        leftIcon={isPlayingAudio ? <FiSquare /> : <FiVolume2 />}
                        onClick={handleTextToSpeech}
                        borderRadius="full"
                      >
                        {isPlayingAudio ? "Stop Audio" : "Listen to Lesson"}
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="orange"
                        variant="outline"
                        leftIcon={<FiGlobe />}
                        isLoading={translating}
                        onClick={handleTranslateToHinglish}
                        borderRadius="full"
                      >
                        Translate
                      </Button>
                    </HStack>
                    <LessonPDFExporter lessonName={lesson.title} />
                  </Flex>

                  <Box ref={lessonRef} bg={cardBg} p={{ base: 6, md: 10 }} borderRadius="3xl" boxShadow="sm" border="1px solid" borderColor={borderColor}>
                    <LessonRenderer content={lesson.content} />
                  </Box>

                  {hinglish && (
                    <Box mt={8} bg={useColorModeValue("orange.50", "rgba(221, 107, 32, 0.1)")} p={8} borderRadius="3xl" border="1px solid" borderColor={useColorModeValue("orange.200", "orange.800")}>
                      <Heading size="sm" mb={4} color={useColorModeValue("orange.800", "orange.200")}>Hinglish Translation</Heading>
                      <Text whiteSpace="pre-line" fontSize="lg" lineHeight="1.8" color={useColorModeValue("gray.800", "gray.200")}>{hinglish}</Text>
                    </Box>
                  )}

                  <Center mt={12} mb={6}>
                    <Button
                      size="xl"
                      h="60px"
                      px={10}
                      fontSize="lg"
                      borderRadius="full"
                      onClick={handleToggleComplete}
                      isLoading={togglingComplete}
                      bg={isCompleted ? useColorModeValue("green.100", "rgba(56, 161, 105, 0.2)") : useColorModeValue("white", "gray.800")}
                      color={isCompleted ? useColorModeValue("green.700", "green.300") : useColorModeValue("gray.800", "white")}
                      border="2px solid"
                      borderColor={isCompleted ? "green.400" : borderColor}
                      _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      leftIcon={isCompleted ? <FiCheckCircle size={24} /> : null}
                    >
                      {isCompleted ? "Lesson Conquered" : "Mark as Complete"}
                    </Button>
                  </Center>

                  <Divider my={10} />

                  <Flex justify="space-between" align="center" pb={20}>
                    <Button
                      leftIcon={<FiChevronLeft />}
                      variant="ghost"
                      size="lg"
                      isDisabled={!prevLesson}
                      onClick={() => prevLesson && navigateToLesson(prevLesson.m, prevLesson.l)}
                    >
                      Previous
                    </Button>
                    <Button
                      rightIcon={<FiChevronRight />}
                      bgGradient={brandGradient}
                      color="white"
                      size="lg"
                      borderRadius="full"
                      px={8}
                      boxShadow="xl"
                      isDisabled={!nextLesson}
                      _hover={{ filter: "brightness(1.1)", transform: "translateX(4px)" }}
                      transition="all 0.2s"
                      onClick={() => nextLesson && navigateToLesson(nextLesson.m, nextLesson.l)}
                    >
                      Next Lesson
                    </Button>
                  </Flex>
                </Box>
              )}
            </MotionBox>
          </AnimatePresence>
        </Container>

        {/* Floating Notes Panel */}
        <AnimatePresence>
          {isNotesOpen && (
            <MotionBox
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              position="fixed"
              top={{ base: "auto", lg: "20px" }}
              bottom={{ base: "0", lg: "auto" }}
              right={{ base: "0", lg: "20px" }}
              w={{ base: "100%", sm: "400px" }}
              h={{ base: "50vh", lg: "80vh" }}
              bg={cardBg}
              boxShadow="2xl"
              borderRadius={{ base: "2xl 2xl 0 0", lg: "2xl" }}
              border="1px solid"
              borderColor={borderColor}
              p={6}
              zIndex={100}
            >
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="md">My Notes</Heading>
                <IconButton icon={<FiCheck />} size="sm" variant="ghost" onClick={toggleNotes} aria-label="Close notes" />
              </Flex>
              {renderNotes()}
            </MotionBox>
          )}
        </AnimatePresence>
      </Flex>

      {/* DRAWERS FOR CLEAN RESPONSIVE DESIGN */}
      <Drawer isOpen={isSidebarOpen} placement="left" size="sm" onClose={onSidebarClose}>
        <DrawerOverlay backdropFilter="blur(4px)" />
        <DrawerContent bg={cardBg}>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" borderColor={borderColor}>Curriculum Navigation</DrawerHeader>
          <DrawerBody p={4} overflowY="auto">{renderCurriculum()}</DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default LessonPage;
