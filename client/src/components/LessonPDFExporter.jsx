import { Button, useColorModeValue } from "@chakra-ui/react";
import { FiDownload } from "react-icons/fi";

const LessonPDFExporter = ({ lessonName }) => {
  const handleDownload = () => {
    // A modern and highly reliable trick for PDF generation in SPAs is utilizing the native browser print dialogue!
    // We update the document title temporarily so the OS PDF saver uses the course name for the actual .pdf file.
    const originalTitle = document.title;
    document.title = lessonName ? `${lessonName.replace(/[^a-z0-9]/gi, '_')}` : 'Lesson_Export';

    // Trigger OS print engine (Vectors & text selectable, unlike html2canvas images!)
    window.print();

    // Restore title immediately after dialog spawns
    document.title = originalTitle;
  };

  return (
    <Button
      leftIcon={<FiDownload />}
      colorScheme="blue"
      variant="outline"
      size="sm"
      borderRadius="full"
      px={4}
      onClick={handleDownload}
      _hover={{ bg: useColorModeValue("blue.50", "blue.900") }}
    >
      Export PDF
    </Button>
  );
};

export default LessonPDFExporter;
