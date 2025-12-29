import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Box, Flex, Spinner, Center } from "@chakra-ui/react";
import { CourseProvider } from "./context/CourseContext";
import Sidebar from "./components/Sidebar";
import BottomNavBar from "./components/BottomNavBar";
import HomePage from "./pages/HomePage";
import CourseDetailPage from "./pages/CourseDetailPage";
import LessonPage from "./pages/LessonPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import useMediaQuery from "./hooks/useMediaQuery";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const { isAuthenticated, isLoading } = useAuth0();
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  return (
    <CourseProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Flex minH="100vh">
                {isMobile ? <BottomNavBar /> : <Sidebar />}
                <Box
                  flex="1"
                  maxW="100vw"
                  mx="auto"
                  pt={4}
                  pb={isMobile ? "120px" : "20px"}
                >
                  <Routes>
                    <Route index element={<HomePage />} />
                    <Route
                      path="/courses/:courseId"
                      element={<CourseDetailPage />}
                    />
                    <Route
                      path="/courses/:courseId/modules/:moduleIndex/lessons/:lessonIndex"
                      element={<LessonPage />}
                    />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Routes>
                </Box>
              </Flex>
            </ProtectedRoute>
          }
        />
      </Routes>
    </CourseProvider>
  );
}

export default App;
