# Text to Learn - Visual Flow Diagrams

## Application Flow Diagrams

### 1. User Journey Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                             │
└─────────────────────────────────────────────────────────────────┘

1. Landing & Authentication
   ┌──────────┐
   │  Visit   │
   │ Website  │
   └────┬─────┘
        │
        v
   ┌──────────┐       ┌──────────┐
   │  Login   ├──────>│  Auth0   │
   │   Page   │       │  Login   │
   └────┬─────┘       └────┬─────┘
        │                  │
        └──────────────────┘
               │
               v
        ┌──────────┐
        │   Home   │
        │   Page   │
        └────┬─────┘

2. Course Generation
        │
        v
   ┌──────────┐       ┌──────────┐       ┌──────────┐
   │  Enter   ├──────>│ Generate ├──────>│  Course  │
   │  Topic   │       │  Course  │       │  Created │
   └──────────┘       └──────────┘       └────┬─────┘

3. Course Exploration
        │
        v
   ┌──────────┐       ┌──────────┐       ┌──────────┐
   │  View    ├──────>│  Select  ├──────>│  View    │
   │ Modules  │       │  Lesson  │       │  Lesson  │
   └──────────┘       └──────────┘       └────┬─────┘

4. Learning Experience
        │
        v
   ┌──────────┐       ┌──────────┐       ┌──────────┐
   │ Generate ├──────>│   Read   ├──────>│   Take   │
   │ Content  │       │  Content │       │  Quizzes │
   └──────────┘       └────┬─────┘       └────┬─────┘
                           │                   │
                           v                   v
                      ┌──────────┐       ┌──────────┐
                      │  Watch   │       │ Download │
                      │  Videos  │       │   PDF    │
                      └──────────┘       └──────────┘
```

### 2. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    SYSTEM ARCHITECTURE                           │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│    Browser   │
│   (Client)   │
└──────┬───────┘
       │ HTTPS
       │
┌──────▼────────────────────────────────────────────────┐
│             FRONTEND (Vercel CDN)                      │
│                                                        │
│  ┌─────────────────────────────────────────────────┐  │
│  │           React Application                      │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐      │  │
│  │  │  Pages   │  │Components│  │ Context  │      │  │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘      │  │
│  │       └─────────────┴─────────────┘            │  │
│  │                     │                           │  │
│  │              ┌──────▼──────┐                    │  │
│  │              │  API Client │                    │  │
│  │              └──────┬──────┘                    │  │
│  └─────────────────────┼─────────────────────────┘  │
└────────────────────────┼────────────────────────────┘
                         │ REST API
                         │
┌────────────────────────▼────────────────────────────┐
│           BACKEND (Render)                          │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │         Express.js Server                     │  │
│  │  ┌────────┐  ┌────────┐  ┌────────┐         │  │
│  │  │ Routes │─>│Control-│─>│Services│         │  │
│  │  │        │  │  lers  │  │        │         │  │
│  │  └────────┘  └────┬───┘  └───┬────┘         │  │
│  │                   │          │               │  │
│  │              ┌────▼────┐     │               │  │
│  │              │ Models  │     │               │  │
│  │              └────┬────┘     │               │  │
│  └───────────────────┼──────────┼───────────────┘  │
└────────────────────┼──────────┼─────────────────────┘
                     │          │
        ┌────────────┘          └────────────┐
        │                                    │
┌───────▼────────┐                  ┌────────▼────────┐
│   MongoDB      │                  │  External APIs  │
│    Atlas       │                  │                 │
│                │                  │  ┌──────────┐   │
│  ┌──────────┐  │                  │  │  Gemini  │   │
│  │ Courses  │  │                  │  │   API    │   │
│  │ Modules  │  │                  │  └──────────┘   │
│  │ Lessons  │  │                  │  ┌──────────┐   │
│  └──────────┘  │                  │  │ YouTube  │   │
└────────────────┘                  │  │   API    │   │
                                    │  └──────────┘   │
                                    │  ┌──────────┐   │
                                    │  │  Auth0   │   │
                                    │  │   API    │   │
                                    │  └──────────┘   │
                                    └─────────────────┘
```

### 3. Course Generation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   COURSE GENERATION FLOW                         │
└─────────────────────────────────────────────────────────────────┘

User Input: "Introduction to Machine Learning"
       │
       ▼
┌──────────────────┐
│  Frontend Form   │
│  - Topic Input   │
│  - Generate Btn  │
└────────┬─────────┘
         │ POST /api/courses/generate
         │ { topic: "..." }
         ▼
┌──────────────────┐
│  courseController│
│  .generateCourse │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   AI Service     │
│  - buildPrompt() │
│  - callGeminiAPI │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────┐
│          Gemini AI API                │
│  Generate structured curriculum:      │
│  {                                    │
│    title: "...",                      │
│    description: "...",                │
│    tags: [...],                       │
│    modules: [                         │
│      {                                │
│        title: "...",                  │
│        lessons: ["...", "...", ...]   │
│      }                                │
│    ]                                  │
│  }                                    │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────┐
│   Parse JSON     │
│   Validate       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐      ┌──────────────────┐
│  Create Course   │──┬──>│  Create Modules  │
│  Document        │  │   │  Documents       │
└──────────────────┘  │   └────────┬─────────┘
                      │            │
                      │            ▼
                      │   ┌──────────────────┐
                      │   │  Create Lessons  │
                      │   │  Documents       │
                      │   │  (titles only)   │
                      │   └────────┬─────────┘
                      │            │
                      ▼            ▼
┌─────────────────────────────────────────┐
│         Save to MongoDB                  │
│  Course ──> Module ──> Lesson           │
└────────┬────────────────────────────────┘
         │
         ▼
┌──────────────────┐
│  Return to       │
│  Frontend        │
│  - Course Object │
│  - Populated     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Update UI       │
│  - Add to list   │
│  - Show toast    │
│  - Navigate      │
└──────────────────┘
```

### 4. Lesson Content Generation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                LESSON CONTENT GENERATION FLOW                    │
└─────────────────────────────────────────────────────────────────┘

User clicks "Generate Lesson Content"
       │
       ▼
┌──────────────────────────────────────────┐
│  POST /api/courses/:cId/modules/:mId/    │
│       lessons/:lId/generate              │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────┐
│  Fetch Context   │
│  - Course Title  │
│  - Module Title  │
│  - Lesson Title  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   AI Service     │
│  - buildPrompt() │
│  - callGeminiAPI │
└────────┬─────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│               Gemini AI API                      │
│  Generate detailed lesson:                       │
│  {                                               │
│    title: "...",                                 │
│    objectives: ["...", "..."],                   │
│    content: [                                    │
│      { type: "heading", text: "..." },           │
│      { type: "paragraph", text: "..." },         │
│      { type: "code", language: "py", text: ""},  │
│      { type: "video", query: "..." },            │
│      { type: "mcq", question: "...",             │
│        options: [...], answer: 1,                │
│        explanation: "..." }                      │
│    ]                                             │
│  }                                               │
└────────┬────────────────────────────────────────┘
         │
         ▼
┌──────────────────┐
│  Update Lesson   │
│  in MongoDB      │
│  - objectives    │
│  - content[]     │
│  - isEnriched=T  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Return Lesson   │
│  to Frontend     │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────┐
│     Render Content           │
│  ┌───────────────────────┐   │
│  │  LessonRenderer       │   │
│  │  ├─ HeadingBlock      │   │
│  │  ├─ ParagraphBlock    │   │
│  │  ├─ CodeBlock         │   │
│  │  ├─ VideoBlock ──┐    │   │
│  │  └─ MCQBlock     │    │   │
│  └──────────────────┼────┘   │
│                     │         │
│  ┌──────────────────▼──────┐ │
│  │  Fetch YouTube Video    │ │
│  │  - Search API           │ │
│  │  - Embed iframe         │ │
│  └─────────────────────────┘ │
└──────────────────────────────┘
```

### 5. Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                           │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│  User clicks │
│  "Sign In"   │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│  Auth0Provider   │
│  .loginWith      │
│   Redirect()     │
└──────┬───────────┘
       │ Redirect to Auth0
       ▼
┌──────────────────┐
│   Auth0 Login    │
│   Page           │
│   - Email/Pass   │
│   - Social       │
└──────┬───────────┘
       │ User authenticates
       ▼
┌──────────────────┐
│  Auth0 Issues    │
│  - Access Token  │
│  - ID Token      │
│  - Refresh Token │
└──────┬───────────┘
       │ Redirect back to app
       ▼
┌──────────────────┐
│  Frontend        │
│  - Store tokens  │
│  - Set user state│
└──────┬───────────┘
       │
       ▼
┌──────────────────────────────────┐
│     Protected Routes Access       │
│                                   │
│  API Request                      │
│  ├─ Add Authorization header      │
│  │  "Bearer <access_token>"       │
│  └─ Send to backend               │
│                                   │
│  Backend                          │
│  ├─ Verify JWT signature          │
│  ├─ Check expiration              │
│  ├─ Extract user ID (sub)         │
│  └─ Attach to req.userId          │
│                                   │
│  Continue to route handler        │
└───────────────────────────────────┘
```

### 6. Data Model Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATA MODEL RELATIONSHIPS                      │
└─────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────┐
│              User (Auth0)             │
│  - sub (unique ID)                    │
│  - email                              │
│  - name                               │
└────────────┬──────────────────────────┘
             │
             │ creator (1:Many)
             │
┌────────────▼──────────────────────────┐
│             Course                     │
│  - _id                                 │
│  - title                               │
│  - description                         │
│  - creator (Auth0 sub)                 │
│  - tags: [String]                      │
│  - modules: [ObjectId] ───────┐       │
│  - createdAt                   │       │
│  - updatedAt                   │       │
└────────────────────────────────┼───────┘
                                 │
                                 │ (1:Many)
                                 │
┌────────────────────────────────▼───────┐
│             Module                      │
│  - _id                                  │
│  - title                                │
│  - course: ObjectId (ref)               │
│  - lessons: [ObjectId] ─────────┐      │
│  - orderIndex                    │      │
│  - createdAt                     │      │
│  - updatedAt                     │      │
└──────────────────────────────────┼──────┘
                                   │
                                   │ (1:Many)
                                   │
┌──────────────────────────────────▼──────┐
│             Lesson                       │
│  - _id                                   │
│  - title                                 │
│  - objectives: [String]                  │
│  - content: [Mixed]                      │
│    ├─ { type: "heading", text: "..." }  │
│    ├─ { type: "paragraph", text: "..." }│
│    ├─ { type: "code", ... }             │
│    ├─ { type: "video", ... }            │
│    └─ { type: "mcq", ... }              │
│  - isEnriched: Boolean                   │
│  - module: ObjectId (ref)                │
│  - createdAt                             │
│  - updatedAt                             │
└──────────────────────────────────────────┘
```

### 7. Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                   COMPONENT HIERARCHY                            │
└─────────────────────────────────────────────────────────────────┘

App.jsx
├── Auth0Provider
│   └── ChakraProvider
│       └── BrowserRouter
│           └── Routes
│               ├── Route: /login
│               │   └── LoginPage
│               │
│               └── Route: /* (Protected)
│                   ├── Sidebar
│                   │   ├── Navigation Links
│                   │   ├── User Avatar
│                   │   └── Logout Button
│                   │
│                   └── Routes
│                       ├── Route: /
│                       │   └── HomePage
│                       │       ├── PromptForm
│                       │       └── CourseList
│                       │           └── CourseCard[]
│                       │
│                       ├── Route: /courses/:id
│                       │   └── CourseDetailPage
│                       │       └── Accordion
│                       │           └── ModuleItem[]
│                       │               └── LessonLink[]
│                       │
│                       └── Route: /courses/:id/modules/:i/lessons/:i
│                           └── LessonPage
│                               ├── LessonPDFExporter
│                               └── LessonRenderer
│                                   ├── HeadingBlock
│                                   ├── ParagraphBlock
│                                   ├── CodeBlock
│                                   ├── VideoBlock
│                                   └── MCQBlock
```

### 8. API Request/Response Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  API REQUEST/RESPONSE FLOW                       │
└─────────────────────────────────────────────────────────────────┘

Frontend Component
       │
       ▼
┌──────────────────┐
│  API Client      │
│  (axios)         │
│  - setAuthToken  │
│  - makeRequest   │
└────────┬─────────┘
         │ HTTP Request
         │ Headers: Authorization: Bearer <token>
         │ Body: JSON data
         ▼
┌──────────────────┐
│  Express Server  │
│  - CORS          │
│  - JSON Parser   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Auth Middleware │
│  - Verify JWT    │
│  - Check expiry  │
│  - Extract user  │
└────────┬─────────┘
         │ req.userId = "auth0|..."
         ▼
┌──────────────────┐
│  Route Handler   │
│  - Validate input│
│  - Call ctrl     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Controller      │
│  - Business logic│
│  - Call services │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Service/Model   │
│  - DB operations │
│  - External APIs │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Response        │
│  {               │
│    success: true,│
│    data: {...}   │
│  }               │
└────────┬─────────┘
         │ HTTP 200/201
         ▼
┌──────────────────┐
│  Frontend        │
│  - Update state  │
│  - Render UI     │
│  - Show toast    │
└──────────────────┘

If Error:
         │
         ▼
┌──────────────────┐
│  Error Handler   │
│  - Log error     │
│  - Format resp   │
└────────┬─────────┘
         │ HTTP 4xx/5xx
         ▼
┌──────────────────┐
│  Frontend        │
│  - Show error    │
│  - Log to console│
└──────────────────┘
```

---

## Legend

```
┌─────┐
│ Box │  = Component, Process, or System
└─────┘

   │
   ▼    = Flow direction

  ─┬─   = Split/Branch

  ───>  = Data/Control flow

[...]   = Array/Collection

{...}   = Object/JSON
```

---

These diagrams provide a visual understanding of how the Text to Learn application works, from user interaction to data persistence and everything in between.
