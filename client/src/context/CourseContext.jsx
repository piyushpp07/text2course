import { createContext, useContext, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getUserCourses } from "../utils/api";

const CourseContext = createContext();

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourses must be used within CourseProvider");
  }
  return context;
};

export const CourseProvider = ({ children }) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);
    try {
      const token = await getAccessTokenSilently();
      const response = await getUserCourses(token);
      setCourses(response.data.data || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [isAuthenticated]);

  const addCourse = (newCourse) => {
    setCourses((prev) => [newCourse, ...prev]);
  };

  const removeCourse = (courseId) => {
    setCourses((prev) => prev.filter((course) => course._id !== courseId));
  };

  const value = {
    courses,
    loading,
    error,
    fetchCourses,
    addCourse,
    removeCourse,
  };

  return (
    <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
  );
};
