import { Button } from "@chakra-ui/react";
import { FiDownload } from "react-icons/fi";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const LessonPDFExporter = ({ lesson, lessonRef }) => {
  const handleDownload = async () => {
    if (!lessonRef.current) return;

    try {
      const originalBg = lessonRef.current.style.backgroundColor;
      const originalColor = lessonRef.current.style.color;

      lessonRef.current.style.backgroundColor = "#ffffff";
      lessonRef.current.style.color = "#000000";
      lessonRef.current.style.padding = "40px";

      const canvas = await html2canvas(lessonRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      // Restore original styles
      lessonRef.current.style.backgroundColor = originalBg;
      lessonRef.current.style.color = originalColor;
      lessonRef.current.style.padding = "32px";

      // Create PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= 297; // A4 height in mm

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      // Save the PDF
      const fileName = `${lesson.title
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <Button
      leftIcon={<FiDownload />}
      colorScheme="green"
      onClick={handleDownload}
    >
      Download as PDF
    </Button>
  );
};

export default LessonPDFExporter;
