import { Heading } from '@chakra-ui/react';

const HeadingBlock = ({ text }) => {
  return (
    <Heading size={{ base: 'md', md: 'lg' }} mt={6} mb={3}>
      {text}
    </Heading>
  );
};

export default HeadingBlock;
