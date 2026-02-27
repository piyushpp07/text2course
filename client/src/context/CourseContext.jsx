import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
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
  const toast = useToast();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [savedCourses, setSavedCourses] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [errorSaved, setErrorSaved] = useState(null);

  const fetchCourses = async () => {
    const localToken = localStorage.getItem('token');
    const localUser = JSON.parse(localStorage.getItem('user'));

    if (!localToken) {
      console.log("Not fetching courses: not authenticated");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log("Fetching courses for local user:", localUser?._id || 'unknown');

      const response = await getUserCourses(localToken);
      console.log("Response from getUserCourses:", response);
      const coursesData = response.data || [];
      setCourses(coursesData);
      console.log(`Successfully set ${coursesData.length} courses in state`);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching courses:", err);
      toast({
        title: "Error fetching courses",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedCourses = async () => {
    const localToken = localStorage.getItem('token');
    if (!localToken) return;

    setLoadingSaved(true);
    setErrorSaved(null);
    try {
      const response = await getSavedCourses(localToken);
      setSavedCourses(response.data || []);
    } catch (err) {
      setErrorSaved(err.message);
      console.error("Error fetching saved courses:", err);
    } finally {
      setLoadingSaved(false);
    }
  };

  useEffect(() => {
    const localToken = localStorage.getItem('token');
    if (localToken) {
      fetchCourses();
      fetchSavedCourses();
    } else {
      setCourses([]);
      setSavedCourses([]);
    }
  }, []);

  const addCourse = (newCourse) => {
    setCourses((prev) => [newCourse, ...prev]);
  };

  const removeCourse = (courseId) => {
    setCourses((prev) => prev.filter((course) => course._id !== courseId));
  };

  const saveCourse = async (courseId) => {
    try {
      const localToken = localStorage.getItem('token');
      await apiSaveCourse(courseId, localToken);
      fetchSavedCourses();
    } catch (err) {
      console.error("Error saving course:", err);
    }
  };

  const unsaveCourse = async (courseId) => {
    try {
      const localToken = localStorage.getItem('token');
      await apiUnsaveCourse(courseId, localToken);
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
