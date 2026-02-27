import {
    Flex,
    HStack,
    Text,
    Button,
    IconButton,
    Avatar,
    useColorMode,
    useColorModeValue,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Container,
    Box
} from "@chakra-ui/react";
import { FiBookOpen, FiLogOut, FiMoon, FiSun, FiUser } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

const TopNavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { colorMode, toggleColorMode } = useColorMode();

    const localUser = JSON.parse(localStorage.getItem('user'));

    const bg = useColorModeValue("rgba(255, 255, 255, 0.8)", "rgba(0, 0, 0, 0.8)");
    const borderColor = useColorModeValue("gray.200", "gray.800");
    const brandGradient = "linear(to-r, #7F53AC, #647DEE)";

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    return (
        <Flex
            as="header"
            position="sticky"
            top={0}
            zIndex={999}
            bg={bg}
            backdropFilter="blur(10px)"
            borderBottom="1px solid"
            borderColor={borderColor}
            boxShadow="sm"
        >
            <Container maxW="container.xl">
                <Flex h={16} alignItems="center" justify="space-between">

                    {/* Brand Engine */}
                    <HStack spacing={3} cursor="pointer" onClick={() => navigate("/")}>
                        <Flex
                            w={10}
                            h={10}
                            bgGradient={brandGradient}
                            borderRadius="xl"
                            align="center"
                            justify="center"
                            boxShadow="md"
                        >
                            <FiBookOpen color="white" size={20} />
                        </Flex>
                        <Text
                            fontSize="2xl"
                            fontWeight="extrabold"
                            bgGradient={brandGradient}
                            bgClip="text"
                            letterSpacing="-1px"
                            display={{ base: "none", sm: "block" }}
                        >
                            text2learn
                        </Text>
                    </HStack>

                    {/* Desktop Nav Links */}
                    <HStack spacing={8} display={{ base: "none", md: "flex" }}>
                        <Button
                            variant="ghost"
                            color={location.pathname === "/" ? "purple.500" : "inherit"}
                            fontWeight={location.pathname === "/" ? "bold" : "medium"}
                            onClick={() => navigate("/")}
                        >
                            My Courses
                        </Button>
                        {/* Add more nav extensions below as app grows */}
                    </HStack>

                    {/* Right Action Icons & Profile */}
                    <HStack spacing={4}>
                        <IconButton
                            aria-label="Toggle Color Mode"
                            icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
                            onClick={toggleColorMode}
                            variant="ghost"
                            borderRadius="full"
                        />

                        <Menu placement="bottom-end">
                            <MenuButton
                                as={Button}
                                rounded="full"
                                variant="link"
                                cursor="pointer"
                                minW={0}
                                _focus={{ boxShadow: "none" }}
                            >
                                <Avatar
                                    size="sm"
                                    name={localUser?.name}
                                    bgGradient={brandGradient}
                                    color="white"
                                    boxShadow="md"
                                />
                            </MenuButton>
                            <MenuList
                                boxShadow="xl"
                                border="1px solid"
                                borderColor={borderColor}
                                borderRadius="xl"
                                p={2}
                            >
                                <Box px={3} py={2}>
                                    <Text fontWeight="bold" noOfLines={1}>{localUser?.name}</Text>
                                    <Text fontSize="sm" color="gray.500" noOfLines={1}>{localUser?.email}</Text>
                                </Box>
                                <MenuDivider />
                                <MenuItem icon={<FiUser />} onClick={() => navigate("/profile")} borderRadius="md">
                                    Profile Settings
                                </MenuItem>
                                <MenuItem icon={<FiLogOut />} color="red.400" onClick={handleLogout} borderRadius="md" _hover={{ bg: "red.50", color: "red.600" }}>
                                    Sign Out
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </HStack>
                </Flex>
            </Container>
        </Flex>
    );
};

export default TopNavBar;
