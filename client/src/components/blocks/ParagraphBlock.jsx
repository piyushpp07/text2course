import { Text, useColorModeValue } from '@chakra-ui/react';

const ParagraphBlock = ({ text }) => {
  return (
    <Text mb={4} lineHeight="1.8" color={useColorModeValue('gray.700', 'gray.300')}>
      {text}
    </Text>
  );
};

export default ParagraphBlock;
