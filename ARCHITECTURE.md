# Text to Learn - Project Architecture

## Complete Directory Structure

```
text-to-learn/
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml                    # GitHub Actions CI/CD pipeline
│
├── server/                              # Backend Application
│   ├── config/
│   │   └── db.js                        # MongoDB connection configuration
│   │
│   ├── controllers/
│   │   ├── courseController.js          # Course CRUD operations
│   │   ├── lessonController.js          # Lesson operations
│   │   └── utilityController.js         # YouTube, translation APIs
│   │
│   ├── middlewares/
│   │   ├── auth.js                      # Auth0 JWT verification
│   │   └── errorHandler.js              # Global error handling
│   │
│   ├── models/
│   │   ├── Course.js                    # Course schema
│   │   ├── Module.js                    # Module schema
│   │   └── Lesson.js                    # Lesson schema
│   │
│   ├── routes/
│   │   ├── courseRoutes.js              # Course endpoints
│   │   ├── lessonRoutes.js              # Lesson endpoints
│   │   └── utilityRoutes.js             # Utility endpoints
│   │
│   ├── services/
│   │   ├── aiService.js                 # Gemini AI integration
│   │   └── youtubeService.js            # YouTube API integration
│   │
│   ├── .env.example                     # Environment variables template
│   ├── .gitignore                       # Git ignore rules
│   ├── package.json                     # Backend dependencies
│   ├── README.md                        # Backend documentation
│   └── server.js                        # Application entry point
│
├── client/                              # Frontend Application
│   ├── public/
│   │   └── vite.svg                     # Vite logo
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── blocks/
│   │   │   │   ├── CodeBlock.jsx        # Code syntax highlighting
│   │   │   │   ├── HeadingBlock.jsx     # Heading renderer
│   │   │   │   ├── MCQBlock.jsx         # Interactive quiz component
│   │   │   │   ├── ParagraphBlock.jsx   # Text paragraph renderer
│   │   │   │   └── VideoBlock.jsx       # YouTube video embed
│   │   │   │
│   │   │   ├── LessonPDFExporter.jsx    # PDF download functionality
│   │   │   ├── LessonRenderer.jsx       # Main lesson content renderer
│   │   │   └── Sidebar.jsx              # Navigation sidebar
│   │   │
│   │   ├── context/
│   │   │   └── CourseContext.jsx        # Global course state management
│   │   │
│   │   ├── pages/
│   │   │   ├── CourseDetailPage.jsx     # Course overview with modules
│   │   │   ├── HomePage.jsx             # Course generation & list
│   │   │   ├── LessonPage.jsx           # Individual lesson view
│   │   │   └── LoginPage.jsx            # Authentication page
│   │   │
│   │   ├── utils/
│   │   │   └── api.js                   # API client and endpoints
│   │   │
│   │   ├── App.jsx                      # Main app with routing
│   │   ├── index.css                    # Global styles
│   │   └── main.jsx                     # React entry point
│   │
│   ├── .env.example                     # Environment variables template
│   ├── .gitignore                       # Git ignore rules
│   ├── index.html                       # HTML entry point
│   ├── package.json                     # Frontend dependencies
│   ├── README.md                        # Frontend documentation
│   └── vite.config.js                   # Vite configuration
│
├── .gitignore                           # Root git ignore
├── README.md                            # Main project documentation
├── SETUP_GUIDE.md                       # Complete setup instructions
└── vercel.json                          # Vercel deployment config
```

## Architecture Overview

### Backend Architecture (Node.js + Express)

```
┌─────────────────────────────────────────────────────────────┐
│                       Express Server                         │
├─────────────────────────────────────────────────────────────┤
│  Middleware Layer                                            │
│  ├── CORS                                                    │
│  ├── JSON Parser                                             │
│  ├── Auth0 JWT Verification                                  │
│  └── Error Handler                                           │
├─────────────────────────────────────────────────────────────┤
│  Routes Layer                                                │
│  ├── /api/courses (CRUD operations)                          │
│  ├── /api/lessons (Content management)                       │
│  └── /api/youtube & /api/translate (Utilities)               │
├─────────────────────────────────────────────────────────────┤
│  Controllers Layer                                           │
│  ├── Business Logic                                          │
│  ├── Request Validation                                      │
│  └── Response Formatting                                     │
├─────────────────────────────────────────────────────────────┤
│  Services Layer                                              │
│  ├── AI Service (Gemini)                                     │
│  └── YouTube Service                                         │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                                  │
│  ├── Mongoose Models                                         │
│  └── MongoDB Database                                        │
└─────────────────────────────────────────────────────────────┘
```

### Frontend Architecture (React + Vite)

```
┌─────────────────────────────────────────────────────────────┐
│                    React Application                         │
├─────────────────────────────────────────────────────────────┤
│  Authentication Layer (Auth0)                                │
│  └── Auth0Provider                                           │
├─────────────────────────────────────────────────────────────┤
│  UI Framework (Chakra UI)                                    │
│  └── ChakraProvider + Theme                                  │
├─────────────────────────────────────────────────────────────┤
│  Routing Layer (React Router)                                │
│  ├── Public Routes (/login)                                  │
│  └── Protected Routes (/, /courses, /lessons)                │
├─────────────────────────────────────────────────────────────┤
│  State Management                                            │
│  ├── CourseContext (Global State)                            │
│  └── Local Component State                                   │
├─────────────────────────────────────────────────────────────┤
│  Page Components                                             │
│  ├── HomePage (Course generation & listing)                  │
│  ├── CourseDetailPage (Module navigation)                    │
│  └── LessonPage (Content display & PDF export)               │
├─────────────────────────────────────────────────────────────┤
│  Reusable Components                                         │
│  ├── Sidebar (Navigation)                                    │
│  ├── LessonRenderer (Dynamic content rendering)              │
│  └── Content Blocks (Heading, Paragraph, Code, Video, MCQ)   │
├─────────────────────────────────────────────────────────────┤
│  Utility Layer                                               │
│  └── API Client (Axios)                                      │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Course Generation Flow

```
User Input (Topic)
    ↓
Frontend (HomePage)
    ↓
API Call (POST /api/courses/generate)
    ↓
Backend Controller
    ↓
AI Service (Gemini API)
    ↓ (Structured JSON Response)
Database (MongoDB)
    ↓ (Save Course, Modules, Lessons)
Response to Frontend
    ↓
Update CourseContext
    ↓
Navigate to Course Detail Page
```

### Lesson Content Generation Flow

```
User Click (Generate Lesson)
    ↓
Frontend (LessonPage)
    ↓
API Call (POST /api/courses/:id/modules/:id/lessons/:id/generate)
    ↓
Backend Controller
    ↓
Fetch Course/Module/Lesson Data
    ↓
AI Service (Gemini API)
    ↓ (Detailed Content JSON)
Update Lesson in Database
    ↓
Response to Frontend
    ↓
Render Content Blocks
```

### Video Integration Flow

```
Lesson Content (Video Query)
    ↓
VideoBlock Component
    ↓
API Call (GET /api/youtube/search?query=...)
    ↓
Backend (YouTube Service)
    ↓
YouTube Data API
    ↓ (Video Results)
Response to Frontend
    ↓
Embed YouTube Video (iframe)
```

## Database Schema Relationships

```
┌─────────────────┐
│     User        │
│ (Auth0 sub)     │
└────────┬────────┘
         │ 1:N
         │
┌────────▼────────┐
│     Course      │
│  - title        │
│  - description  │
│  - creator      │
│  - tags[]       │
└────────┬────────┘
         │ 1:N
         │
┌────────▼────────┐
│     Module      │
│  - title        │
│  - orderIndex   │
└────────┬────────┘
         │ 1:N
         │
┌────────▼────────┐
│     Lesson      │
│  - title        │
│  - objectives[] │
│  - content[]    │
│  - isEnriched   │
└─────────────────┘
```

## API Endpoints Summary

### Course Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/courses/generate` | ✓ | Generate new course |
| GET | `/api/courses` | ✓ | Get user's courses |
| GET | `/api/courses/:id` | ✓ | Get course details |
| DELETE | `/api/courses/:id` | ✓ | Delete course |
| POST | `/api/courses/:courseId/modules/:moduleId/lessons/:lessonId/generate` | ✓ | Generate lesson content |

### Lesson Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/lessons/:id` | ✓ | Get lesson details |
| PUT | `/api/lessons/:id` | ✓ | Update lesson |

### Utility Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/youtube/search` | ✗ | Search YouTube videos |
| POST | `/api/translate/hinglish` | ✗ | Translate to Hinglish |

## Technology Stack Details

### Backend Dependencies
```json
{
  "express": "Web framework",
  "mongoose": "MongoDB ORM",
  "dotenv": "Environment variables",
  "cors": "Cross-origin resource sharing",
  "express-jwt": "JWT authentication middleware",
  "jwks-rsa": "Auth0 key validation",
  "axios": "HTTP client",
  "@google/generative-ai": "Gemini AI SDK"
}
```

### Frontend Dependencies
```json
{
  "react": "UI framework",
  "react-dom": "React DOM renderer",
  "react-router-dom": "Routing",
  "@auth0/auth0-react": "Auth0 SDK",
  "axios": "HTTP client",
  "@chakra-ui/react": "UI component library",
  "framer-motion": "Animations",
  "jspdf": "PDF generation",
  "html2canvas": "HTML to canvas conversion",
  "prism-react-renderer": "Code syntax highlighting"
}
```

## Key Features Implementation

### 1. AI Course Generation
- **Location**: `server/services/aiService.js`
- **Technology**: Google Gemini AI
- **Prompt Engineering**: Structured JSON responses
- **Output**: Course structure with modules and lessons

### 2. Rich Content Rendering
- **Location**: `client/src/components/LessonRenderer.jsx`
- **Block Types**: Heading, Paragraph, Code, Video, MCQ
- **Dynamic**: Renders based on content type

### 3. PDF Export
- **Location**: `client/src/components/LessonPDFExporter.jsx`
- **Technology**: jsPDF + html2canvas
- **Process**: DOM → Canvas → PDF

### 4. Authentication
- **Provider**: Auth0
- **Flow**: OAuth 2.0 with PKCE
- **Frontend**: `@auth0/auth0-react`
- **Backend**: `express-jwt` + `jwks-rsa`

### 5. Video Integration
- **API**: YouTube Data API v3
- **Search**: Based on AI-generated queries
- **Embed**: YouTube iframe player

## Deployment Strategy

### Production Architecture

```
┌─────────────────────┐
│   Users/Browsers    │
└──────────┬──────────┘
           │
    ┌──────▼──────┐
    │  Auth0 CDN  │ (Authentication)
    └──────┬──────┘
           │
    ┌──────▼──────────────────┐
    │   Vercel CDN (Global)   │ (Frontend)
    │   React Application     │
    └──────┬──────────────────┘
           │
    ┌──────▼──────────────────┐
    │   Render (US-West)      │ (Backend)
    │   Node.js API Server    │
    └──────┬──────────────────┘
           │
    ┌──────▼──────────┬───────────────┐
    │                 │               │
┌───▼────┐    ┌──────▼─────┐  ┌─────▼──────┐
│MongoDB │    │ Gemini AI  │  │ YouTube    │
│ Atlas  │    │    API     │  │  Data API  │
└────────┘    └────────────┘  └────────────┘
```

## Security Considerations

1. **Authentication**: Auth0 OAuth 2.0 with JWT tokens
2. **API Protection**: All course/lesson routes require authentication
3. **Environment Variables**: Sensitive data in `.env` files
4. **CORS**: Configured to allow specific origins only
5. **Input Validation**: Server-side validation for all inputs
6. **Error Handling**: No sensitive data in error messages

## Performance Optimization

1. **Frontend**:
   - Code splitting with React Router
   - Lazy loading components
   - Chakra UI for optimized CSS-in-JS

2. **Backend**:
   - MongoDB indexing on frequently queried fields
   - Connection pooling
   - Async/await for non-blocking operations

3. **External APIs**:
   - Caching YouTube search results
   - Rate limiting on AI generation

## Future Enhancements

- [ ] WebSocket for real-time course generation updates
- [ ] Redis caching for frequently accessed courses
- [ ] Elasticsearch for advanced course search
- [ ] S3 for storing generated PDFs
- [ ] Analytics dashboard with MongoDB aggregations
- [ ] Multi-language support (i18n)
- [ ] Progressive Web App (PWA) capabilities
- [ ] GraphQL API as alternative to REST

---

This architecture provides a scalable, maintainable, and production-ready foundation for the Text to Learn platform.
