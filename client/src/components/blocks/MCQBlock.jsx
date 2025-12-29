import { useState } from 'react';
import {
  Box,
  Text,
  Radio,
  RadioGroup,
  Stack,
  Button,
  Alert,
  AlertIcon,
  AlertDescription,
  VStack,
  useColorModeValue
} from '@chakra-ui/react';

const MCQBlock = ({ question, options, answer, explanation }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    setShowResult(true);
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const isCorrect = selectedAnswer !== null && parseInt(selectedAnswer) === answer;

  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      p={6}
      borderRadius="md"
      border="2px"
      borderColor={useColorModeValue('blue.200', 'blue.500')}
      mb={4}
    >
      <VStack align="stretch" spacing={4}>
        <Text fontSize="lg" fontWeight="bold">
          {question}
        </Text>

        <RadioGroup value={selectedAnswer} onChange={setSelectedAnswer}>
          <Stack spacing={3}>
            {options.map((option, index) => (
              <Radio
                key={index}
                value={index.toString()}
                colorScheme="blue"
                isDisabled={showResult}
              >
                {option}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>

        {!showResult ? (
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isDisabled={selectedAnswer === null}
            alignSelf="flex-start"
          >
            Submit Answer
          </Button>
        ) : (
          <>
            <Alert
              status={isCorrect ? 'success' : 'error'}
              borderRadius="md"
            >
              <AlertIcon />
              <AlertDescription>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </AlertDescription>
            </Alert>

            {explanation && (
              <Box bg={useColorModeValue('gray.100', 'gray.700')} p={4} borderRadius="md">
                <Text fontWeight="bold" mb={2}>
                  Explanation:
                </Text>
                <Text color={useColorModeValue('gray.700', 'gray.300')}>{explanation}</Text>
              </Box>
            )}

            <Button
              variant="outline"
              onClick={handleReset}
              alignSelf="flex-start"
            >
              Try Again
            </Button>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default MCQBlock;
