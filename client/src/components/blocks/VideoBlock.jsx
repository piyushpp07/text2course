import { useState, useEffect } from 'react';
import { Box, AspectRatio, Spinner, Center, Text, useColorModeValue } from '@chakra-ui/react';
import { searchYouTubeVideos } from '../../utils/api';

const VideoBlock = ({ query, url }) => {
  const [videoUrl, setVideoUrl] = useState(url || null);
  const [loading, setLoading] = useState(!url);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url && query) {
      const fetchVideo = async () => {
        try {
          const response = await searchYouTubeVideos(query);
          if (response.data && response.data.length > 0) {
            setVideoUrl(response.data[0].embedUrl);
          } else {
            setError('No video found');
          }
        } catch (err) {
          setError('Failed to load video');
        } finally {
          setLoading(false);
        }
      };

      fetchVideo();
    }
  }, [query, url]);

  if (loading) {
    return (
      <Center h="300px" bg={useColorModeValue('gray.100', 'gray.800')} borderRadius="md" mb={4}>
        <Spinner />
      </Center>
    );
  }

  if (error || !videoUrl) {
    return (
      <Box bg={useColorModeValue('gray.100', 'gray.800')} p={4} borderRadius="md" mb={4}>
        <Text color={useColorModeValue('gray.600', 'gray.500')}>{error || 'Video unavailable'}</Text>
        <Text color={useColorModeValue('gray.600', 'gray.500')} mt={2}>
          Note: If you are using an ad blocker, it might prevent the video from loading. Please consider disabling it for this site.
        </Text>
      </Box>
    );
  }

  return (
    <Box mb={4}>
      <AspectRatio ratio={16 / 9}>
        <iframe
          src={videoUrl}
          title="Educational Video"
          allowFullScreen
          style={{ borderRadius: '8px' }}
        />
      </AspectRatio>
    </Box>
  );
};

export default VideoBlock;
