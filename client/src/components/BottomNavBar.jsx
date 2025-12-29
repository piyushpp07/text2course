import { Flex, IconButton, useColorModeValue, Icon } from "@chakra-ui/react";
import { FiHome, FiPlusCircle, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// Helper to focus the course input if present
function focusCourseInput() {
  const input = document.querySelector(
    'input[placeholder="e.g. Introduction to Quantum Physics"]'
  );
  if (input) input.focus();
}

const BottomNavBar = () => {
  const navigate = useNavigate();
  const bg = useColorModeValue("white", "gray.800");
  const iconColor = useColorModeValue("gray.600", "gray.300");
  const activeIconColor = useColorModeValue("teal.500", "teal.300");

  return (
    <Flex
      as="nav"
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      bg={bg}
      borderTop="1px"
      borderColor={useColorModeValue("gray.200", "gray.700")}
      p={{ base: 2, sm: 4 }}
      justify="space-around"
      align="center"
      boxShadow="0 -2px 10px rgba(0,0,0,0.1)"
      zIndex="999"
    >
      <IconButton
        aria-label="Home"
        icon={<Icon as={FiHome} w={6} h={6} />}
        variant="ghost"
        color={iconColor}
        _hover={{ color: activeIconColor }}
        onClick={() => navigate("/")}
      />
      <IconButton
        aria-label="Generate Course"
        icon={<Icon as={FiPlusCircle} w={10} h={10} />}
        variant="ghost"
        colorScheme="teal"
        isRound
        size="lg"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setTimeout(focusCourseInput, 400);
        }}
      />
      <IconButton
        aria-label="Profile"
        icon={<Icon as={FiUser} w={6} h={6} />}
        variant="ghost"
        color={iconColor}
        _hover={{ color: activeIconColor }}
        onClick={() => navigate("/profile")}
      />
    </Flex>
  );
};

export default BottomNavBar;
