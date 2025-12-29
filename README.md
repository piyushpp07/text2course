# Text to Learn

An AI-powered course generator that transforms any topic into a structured, comprehensive online course.

## Project Structure

```
text-to-learn/
├── server/          # Backend (Node.js + Express + MongoDB)
├── client/          # Frontend (React + Vite)
└── README.md
```

## Features

- 🤖 **AI-Powered Course Generation**: Generate complete course structures using Google Gemini AI
- 📚 **Rich Lesson Content**: Headings, paragraphs, code blocks, videos, and interactive MCQs
- 🎥 **YouTube Integration**: Automatic video suggestions for each lesson
- 📄 **PDF Export**: Download lessons as formatted PDFs for offline learning
- 🌐 **Multilingual Support**: Hinglish translations for enhanced accessibility
- 🔐 **Secure Authentication**: Auth0 integration for user management
- 💾 **Persistent Storage**: MongoDB for saving courses and progress

## Tech Stack

### Backend

- Node.js & Express
- MongoDB with Mongoose
- Google Gemini AI API
- YouTube Data API v3
- Auth0 (JWT authentication)

### Frontend

- React 18
- Vite
- Chakra UI
- React Router v6
- Auth0 React SDK
- jsPDF & html2canvas

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB Atlas account or local MongoDB
- Auth0 account
- Google Gemini API key
- YouTube Data API key

### Backend Setup

1. Navigate to the server directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
AUTH0_ISSUER=https://your-domain.auth0.com/
AUTH0_AUDIENCE=your-api-identifier
GEMINI_API_KEY=your-google-genai-key
YOUTUBE_API_KEY=your-youtube-api-key
NODE_ENV=development
```

4. Start the server:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```env
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=your-api-identifier
VITE_API_URL=http://localhost:5000
```

4. Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Auth0 Configuration

1. Create a new application in Auth0 Dashboard (Single Page Application)
2. Add `http://localhost:3000` to Allowed Callback URLs
3. Add `http://localhost:3000` to Allowed Logout URLs
4. Add `http://localhost:3000` to Allowed Web Origins
5. Create an API in Auth0 and use its identifier as the audience

## API Endpoints

### Courses

- `POST /api/courses/generate` - Generate a new course from a topic
- `GET /api/courses` - Get all user courses
- `GET /api/courses/:id` - Get a specific course
- `DELETE /api/courses/:id` - Delete a course

### Lessons

- `POST /api/courses/:courseId/modules/:moduleId/lessons/:lessonId/generate` - Generate lesson content
- `GET /api/lessons/:id` - Get lesson details
- `PUT /api/lessons/:id` - Update lesson content

### Utilities

- `GET /api/youtube/search?query=...` - Search YouTube videos
- `POST /api/translate/hinglish` - Translate text to Hinglish

## Deployment

### Backend (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Set build command: `npm install`
5. Set start command: `node server.js`
6. Add environment variables

### Frontend (Vercel)

1. Push code to GitHub
2. Import project on Vercel
3. Set root directory to `client`
4. Add environment variables
5. Deploy

## Project Features Breakdown

### 1. Course Generation

- Users input a topic prompt
- AI generates a structured curriculum with 3-6 modules
- Each module contains 3-5 lesson titles

### 2. Lesson Content Generation

- On-demand detailed content generation per lesson
- Structured content blocks (headings, paragraphs, code, videos, MCQs)
- Learning objectives for each lesson

### 3. Interactive Components

- Syntax-highlighted code blocks
- Embedded YouTube videos
- Interactive multiple-choice questions with explanations

### 4. PDF Export

- High-quality PDF generation
- Formatted for print and offline reading
- Includes all lesson content

### 5. User Authentication

- Secure Auth0 integration
- User-specific course management
- Protected API routes

## Development Workflow

1. Create feature branches for new features
2. Test thoroughly before merging
3. Use pull requests for code review
4. Deploy to staging before production

## Future Enhancements

- [ ] Progress tracking per lesson
- [ ] Course sharing and collaboration
- [ ] More language support (Spanish, French, etc.)
- [ ] Text-to-speech for audio lessons
- [ ] Course ratings and reviews
- [ ] Export entire courses as PDF
- [ ] Dark/light theme toggle
- [ ] Mobile app

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use this project for learning and building!

## Acknowledgments

- Google Gemini AI for course generation
- Auth0 for authentication
- Chakra UI for beautiful components
- YouTube Data API for video integration

## Contact

For questions or support, please open an issue on GitHub.

---

Built with ❤️

# text2course
