# Text to Learn - Project Summary

## 🎯 Project Overview

**Text to Learn** is a full-stack, AI-powered web application that transforms any user-submitted topic into a structured, comprehensive online course. Built for a hackathon challenge, this project demonstrates end-to-end full-stack development with AI integration.

## ✨ Key Features

### Core Functionality
1. **AI-Powered Course Generation**
   - Input any topic as a free-form text prompt
   - AI generates complete course structure (3-6 modules, 3-5 lessons each)
   - Automatic curriculum design from foundational to advanced concepts

2. **Rich Lesson Content**
   - Multiple content block types: headings, paragraphs, code, videos, MCQs
   - Syntax-highlighted code blocks
   - Interactive multiple-choice questions with explanations
   - Embedded educational videos from YouTube

3. **Interactive Learning**
   - On-demand lesson content generation
   - Learning objectives for each lesson
   - Quiz system with instant feedback
   - Progress through structured modules

4. **PDF Export**
   - Download individual lessons as formatted PDFs
   - Optimized for print and offline reading
   - Preserves all content formatting

5. **Multilingual Support**
   - Hinglish translation capability
   - Enhanced accessibility for diverse learners
   - AI-powered contextual translation

6. **User Authentication**
   - Secure Auth0 OAuth 2.0 integration
   - User-specific course management
   - Protected API routes
   - Persistent user sessions

## 🏗️ Technical Architecture

### Backend Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **AI Integration**: Google Gemini AI API
- **Video API**: YouTube Data API v3
- **Authentication**: Auth0 (JWT verification)
- **HTTP Client**: Axios

### Frontend Stack
- **Framework**: React 18
- **Build Tool**: Vite
- **UI Library**: Chakra UI
- **Routing**: React Router v6
- **Authentication**: Auth0 React SDK
- **PDF Generation**: jsPDF + html2canvas
- **Code Highlighting**: Prism React Renderer
- **HTTP Client**: Axios

### Development Tools
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions
- **Backend Deployment**: Render
- **Frontend Deployment**: Vercel
- **Package Manager**: npm

## 📁 Project Structure

```
text-to-learn/
├── server/              # Backend API
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── middlewares/     # Auth & error handling
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── services/        # External API integrations
│   └── server.js        # Entry point
│
├── client/              # Frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # State management
│   │   ├── pages/       # Page-level views
│   │   └── utils/       # API client & helpers
│   └── vite.config.js
│
├── .github/workflows/   # CI/CD pipeline
├── README.md            # Project documentation
├── SETUP_GUIDE.md       # Complete setup instructions
├── ARCHITECTURE.md      # Technical architecture details
├── setup.sh/.bat        # Quick setup scripts
└── vercel.json          # Deployment configuration
```

## 🗃️ Database Schema

### Course Model
```javascript
{
  title: String,
  description: String,
  creator: String,        // Auth0 sub
  modules: [ObjectId],    // References to Module
  tags: [String],
  isPublished: Boolean
}
```

### Module Model
```javascript
{
  title: String,
  course: ObjectId,       // Reference to Course
  lessons: [ObjectId],    // References to Lesson
  orderIndex: Number
}
```

### Lesson Model
```javascript
{
  title: String,
  objectives: [String],
  content: [Mixed],       // Flexible content blocks
  isEnriched: Boolean,    // AI-generated flag
  module: ObjectId        // Reference to Module
}
```

## 🔌 API Endpoints

### Course Management
- `POST /api/courses/generate` - Generate new course
- `GET /api/courses` - Get user's courses
- `GET /api/courses/:id` - Get course details
- `DELETE /api/courses/:id` - Delete course

### Lesson Management
- `POST /api/courses/:courseId/modules/:moduleId/lessons/:lessonId/generate` - Generate lesson content
- `GET /api/lessons/:id` - Get lesson details
- `PUT /api/lessons/:id` - Update lesson

### Utilities
- `GET /api/youtube/search` - Search YouTube videos
- `POST /api/translate/hinglish` - Translate to Hinglish

## 🚀 Getting Started

### Quick Setup (Windows)
```bash
setup.bat
```

### Quick Setup (Linux/Mac)
```bash
chmod +x setup.sh
./setup.sh
```

### Manual Setup

1. **Install Dependencies**
   ```bash
   # Backend
   cd server && npm install
   
   # Frontend
   cd client && npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env` in both server and client
   - Add your API keys and credentials

3. **Start Development Servers**
   ```bash
   # Backend (terminal 1)
   cd server && npm run dev
   
   # Frontend (terminal 2)
   cd client && npm run dev
   ```

4. **Access Application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 🔑 Required API Keys

1. **MongoDB Atlas** - Database connection
2. **Auth0** - Authentication (Domain, Client ID, Audience)
3. **Google Gemini AI** - Course/lesson generation
4. **YouTube Data API** - Video integration

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions on obtaining these keys.

## 📊 Data Flow

### Course Generation
```
User Input → Frontend → Backend API → Gemini AI → 
Parse JSON → Save to MongoDB → Return to Frontend → Display
```

### Lesson Content Generation
```
User Click → Fetch Course Data → Backend API → Gemini AI → 
Generate Rich Content → Save to MongoDB → Return to Frontend → 
Render Content Blocks
```

### Video Integration
```
Lesson Content (query) → Frontend VideoBlock → Backend API → 
YouTube API → Video Results → Embed in Lesson
```

## 🎨 UI/UX Features

- **Dark Theme**: Modern dark color scheme
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Loading States**: Spinners and loading indicators
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Success/error feedback
- **Interactive Components**: Clickable cards, buttons, accordions
- **Smooth Navigation**: React Router transitions

## 🔒 Security Features

- **Authentication**: OAuth 2.0 with Auth0
- **Protected Routes**: Frontend route guards
- **JWT Verification**: Backend middleware
- **CORS Configuration**: Restricted origins
- **Environment Variables**: Sensitive data protection
- **Input Validation**: Server-side validation
- **Error Handling**: No sensitive data in responses

## 📈 Performance Optimizations

- **Code Splitting**: React lazy loading
- **Async Operations**: Non-blocking API calls
- **Database Indexing**: Optimized queries
- **Connection Pooling**: Efficient MongoDB connections
- **Vite Build**: Fast development and optimized production builds

## 🚢 Deployment

### Backend (Render)
- Automatic deployment from GitHub
- Environment variable configuration
- Health check endpoint
- Production-ready server

### Frontend (Vercel)
- Automatic deployment from GitHub
- Environment variable configuration
- CDN distribution
- Optimized static assets

## 📝 Resume Highlights

### For Your Resume/Portfolio

**Text to Learn - AI-Powered Course Generator**

*Full-Stack Web Application | React, Node.js, MongoDB, AI Integration*

- Engineered a full-stack web platform enabling users to generate structured online courses from free-form topic prompts using Google Gemini AI, serving comprehensive curricula with 3-6 modules per course
- Architected a RESTful API with Express.js handling course CRUD operations, AI-driven content generation, and third-party integrations (YouTube Data API), secured with Auth0 JWT authentication
- Designed and implemented a MongoDB schema with hierarchical relationships (Course → Module → Lesson) supporting flexible content structures and efficient data retrieval
- Developed a React-based UI with Chakra UI featuring dynamic content rendering, interactive quizzes, YouTube video integration, and client-side PDF export functionality
- Integrated Google Gemini AI with custom prompt engineering to generate structured JSON responses for course outlines and rich lesson content including objectives, explanations, code examples, and assessments
- Implemented multilingual support with AI-powered Hinglish translation, enhancing accessibility for diverse learner demographics
- Deployed backend on Render and frontend on Vercel with CI/CD pipelines using GitHub Actions, ensuring automated testing and seamless production deployments

**Key Achievements:**
- Built end-to-end full-stack application in hackathon timeframe
- Integrated 3 major APIs (Gemini, YouTube, Auth0)
- Implemented 5+ distinct content block types with interactive rendering
- Achieved production-ready deployment on cloud platforms

## 🛠️ Troubleshooting

Common issues and solutions are documented in [SETUP_GUIDE.md](SETUP_GUIDE.md#troubleshooting)

## 📚 Documentation

- **README.md** - Project overview and quick start
- **SETUP_GUIDE.md** - Complete setup instructions with troubleshooting
- **ARCHITECTURE.md** - Technical architecture and design decisions
- **server/README.md** - Backend-specific documentation
- **client/README.md** - Frontend-specific documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - See LICENSE file for details

## 🎉 Acknowledgments

- **Google Gemini AI** - AI course generation
- **Auth0** - Secure authentication
- **YouTube** - Educational video content
- **Chakra UI** - Beautiful component library
- **MongoDB** - Flexible database
- **Vercel & Render** - Reliable hosting platforms

## 📧 Contact

For questions, issues, or collaboration opportunities:
- Open an issue on GitHub
- Email: [your-email]
- LinkedIn: [your-linkedin]

---

**Built with ❤️ for the Text-to-Learn Hackathon Challenge**

*Demonstrating full-stack development, AI integration, and production deployment skills*
