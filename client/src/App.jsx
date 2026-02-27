import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";
import { CourseProvider } from "./context/CourseContext";
import TopNavBar from "./components/TopNavBar";
import BottomNavBar from "./components/BottomNavBar";
import HomePage from "./pages/HomePage";
import CourseDetailPage from "./pages/CourseDetailPage";
import LessonPage from "./pages/LessonPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import useMediaQuery from "./hooks/useMediaQuery";

const ProtectedRoute = ({ children }) => {
  const localToken = localStorage.getItem('token');
  return localToken ? children : <Navigate to="/login" />;
};

function App() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const location = useLocation();

  // Don't show the global sidebar/nav exactly when inside a specific lesson,
  // since the new LessonPage provides its own HiFi responsive layout.
  const isLessonPage = location.pathname.match(/\/courses\/[^/]+\/modules\/\d+\/lessons\/\d+/);

  return (
    <CourseProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Flex minH="100vh" direction="column">
                {!isLessonPage && <TopNavBar />}
                {!isLessonPage && isMobile && <BottomNavBar />}
                <Box
                  flex="1"
                  maxW="100vw"
                  w="100%"
                  mx="auto"
                  pt={isLessonPage ? 0 : 8}
                  pb={!isLessonPage && isMobile ? "120px" : 0}
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
