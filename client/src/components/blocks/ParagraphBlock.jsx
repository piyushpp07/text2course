import { Box, useColorModeValue } from '@chakra-ui/react';
import DOMPurify from 'dompurify';

const ParagraphBlock = ({ text }) => {
  return (
    <Box
      mb={4}
      lineHeight="1.8"
      color={useColorModeValue('gray.700', 'gray.300')}
      fontSize={{ base: 'md', md: 'lg' }}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }}
      sx={{
        'ul': { paddingLeft: '2rem', marginBottom: '1rem', listStyleType: 'disc' },
        'ol': { paddingLeft: '2rem', marginBottom: '1rem', listStyleType: 'decimal' },
        'li': { marginBottom: '0.5rem' },
        'strong': { fontWeight: 'bold' },
        'h1, h2, h3': { marginTop: '1rem', marginBottom: '0.5rem', fontWeight: 'bold' }
      }}
    />
  );
};

export default ParagraphBlock;
