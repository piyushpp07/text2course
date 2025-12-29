# Text to Learn - Backend

Backend server for the AI-powered course generator.

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/text-to-learn
AUTH0_ISSUER=https://your-domain.auth0.com/
AUTH0_AUDIENCE=your-api-identifier
GEMINI_API_KEY=your-google-genai-key
YOUTUBE_API_KEY=your-youtube-api-key
NODE_ENV=development
```

## Running

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Documentation

See main README.md for endpoint details.
