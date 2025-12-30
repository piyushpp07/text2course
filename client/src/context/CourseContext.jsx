import { createContext, useContext, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  getUserCourses,
  getSavedCourses,
  saveCourse as apiSaveCourse,
  unsaveCourse as apiUnsaveCourse,
} from "../utils/api";

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

  const [savedCourses, setSavedCourses] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [errorSaved, setErrorSaved] = useState(null);

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

  const fetchSavedCourses = async () => {
    if (!isAuthenticated) return;

    setLoadingSaved(true);
    setErrorSaved(null);
    try {
      const token = await getAccessTokenSilently();
      const response = await getSavedCourses(token);
      setSavedCourses(response.data.data || []);
    } catch (err) {
      setErrorSaved(err.message);
      console.error("Error fetching saved courses:", err);
    } finally {
      setLoadingSaved(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCourses();
      fetchSavedCourses();
    }
  }, [isAuthenticated]);

  const addCourse = (newCourse) => {
    setCourses((prev) => [newCourse, ...prev]);
  };

  const removeCourse = (courseId) => {
    setCourses((prev) => prev.filter((course) => course._id !== courseId));
  };

  const saveCourse = async (courseId) => {
    try {
      const token = await getAccessTokenSilently();
      await apiSaveCourse(courseId, token);
      // Refetch or update state optimistically
      fetchSavedCourses();
    } catch (err) {
      console.error("Error saving course:", err);
    }
  };

  const unsaveCourse = async (courseId) => {
    try {
      const token = await getAccessTokenSilently();
      await apiUnsaveCourse(courseId, token);
      // Refetch or update state optimistically
      setSavedCourses((prev) =>
        prev.filter((course) => course._id !== courseId)
      );
    } catch (err) {
      console.error("Error unsaving course:", err);
    }
  };

  const value = {
    courses,
    loading,
    error,
    fetchCourses,
    addCourse,
    removeCourse,
    savedCourses,
    loadingSaved,
    errorSaved,
    fetchSavedCourses,
    saveCourse,
    unsaveCourse,
  };

  return (
    <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
  );
};
