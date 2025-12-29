import { Box, useColorModeValue } from '@chakra-ui/react';
import { Highlight, themes } from 'prism-react-renderer';

const CodeBlock = ({ language = 'javascript', code }) => {
  const theme = useColorModeValue(themes.vsLight, themes.vsDark);
  return (
    <Box mb={4} borderRadius="md" overflow="hidden">
      <Highlight theme={theme} code={code} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={className}
            style={{
              ...style,
              padding: '1rem',
              overflow: 'auto',
              fontSize: '0.9rem',
            }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </Box>
  );
};

export default CodeBlock;
