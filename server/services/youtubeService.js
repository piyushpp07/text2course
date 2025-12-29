import axios from 'axios';

/**
 * Search YouTube for educational videos
 */
export const searchYouTubeVideos = async (query, maxResults = 3) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

  try {
    const response = await axios.get(YOUTUBE_API_URL, {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        videoEmbeddable: 'true',
        maxResults: maxResults,
        key: YOUTUBE_API_KEY
      }
    });

    const videos = response.data.items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`
    }));

    return videos;
  } catch (error) {
    console.error('YouTube API Error:', error.response?.data || error.message);
    throw new Error('Failed to fetch YouTube videos');
  }
};
