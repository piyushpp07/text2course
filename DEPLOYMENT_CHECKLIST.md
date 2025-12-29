# Text to Learn - Deployment & Testing Checklist

## Pre-Deployment Checklist

### 1. Environment Setup

#### Backend Environment Variables
- [ ] `PORT` - Set to 5000 or auto-assign
- [ ] `MONGO_URI` - Valid MongoDB connection string
- [ ] `AUTH0_ISSUER` - Auth0 domain with trailing slash
- [ ] `AUTH0_AUDIENCE` - API identifier from Auth0
- [ ] `GEMINI_API_KEY` - Valid Google Gemini API key
- [ ] `YOUTUBE_API_KEY` - Valid YouTube Data API v3 key
- [ ] `NODE_ENV` - Set to "production"

#### Frontend Environment Variables
- [ ] `VITE_AUTH0_DOMAIN` - Auth0 domain (without https://)
- [ ] `VITE_AUTH0_CLIENT_ID` - Auth0 client ID
- [ ] `VITE_AUTH0_AUDIENCE` - Same as backend audience
- [ ] `VITE_API_URL` - Production backend URL

### 2. Auth0 Configuration

- [ ] Application created in Auth0 Dashboard
- [ ] Application type set to "Single Page Application"
- [ ] Allowed Callback URLs configured
  - [ ] Production frontend URL added
  - [ ] Localhost (for testing) added
- [ ] Allowed Logout URLs configured
- [ ] Allowed Web Origins configured
- [ ] API created with correct audience identifier
- [ ] JWT signing algorithm set to RS256

### 3. MongoDB Setup

- [ ] MongoDB Atlas cluster created (or local MongoDB running)
- [ ] Database user created with appropriate permissions
- [ ] IP whitelist configured (0.0.0.0/0 for testing, specific IPs for production)
- [ ] Connection string tested and working
- [ ] Database name specified in connection string

### 4. API Keys Verification

- [ ] Google Gemini API key is active
  - [ ] Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
  - [ ] Test key with a simple API call
- [ ] YouTube Data API key is active
  - [ ] API enabled in Google Cloud Console
  - [ ] Test key with search endpoint

### 5. Code Quality

- [ ] No console.errors or warnings in browser console
- [ ] All environment variables referenced correctly
- [ ] No hardcoded sensitive data in code
- [ ] `.env` files are in `.gitignore`
- [ ] All API endpoints return proper error messages
- [ ] CORS is configured correctly

## Backend Deployment (Render)

### Pre-Deployment
- [ ] Code pushed to GitHub repository
- [ ] `package.json` has correct start script
- [ ] Server listens on `process.env.PORT || 5000`
- [ ] All dependencies listed in `package.json`

### Render Setup
- [ ] Render account created/logged in
- [ ] New Web Service created
- [ ] GitHub repository connected
- [ ] Build command: `npm install`
- [ ] Start command: `node server.js`
- [ ] Root directory set correctly (if needed)
- [ ] All environment variables added
- [ ] Auto-deploy enabled (optional)

### Post-Deployment Testing
- [ ] Service status shows "Live"
- [ ] Health endpoint accessible: `https://your-backend.onrender.com/health`
- [ ] No errors in deployment logs
- [ ] Database connection successful (check logs)

## Frontend Deployment (Vercel)

### Pre-Deployment
- [ ] Code pushed to GitHub repository
- [ ] `package.json` has correct build script
- [ ] All dependencies listed in `package.json`
- [ ] Build tested locally: `npm run build`

### Vercel Setup
- [ ] Vercel account created/logged in
- [ ] New Project created
- [ ] GitHub repository connected
- [ ] Framework preset: Vite
- [ ] Root directory set to `client` (if needed)
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] All environment variables added
- [ ] Auto-deploy enabled (optional)

### Post-Deployment Testing
- [ ] Deployment status shows "Ready"
- [ ] Site loads without errors
- [ ] No console errors in browser
- [ ] Environment variables accessible in code

## Functional Testing

### Authentication Flow
- [ ] Login page loads correctly
- [ ] "Sign In" button triggers Auth0 redirect
- [ ] User can successfully sign up
- [ ] User can successfully log in
- [ ] User redirected back to app after authentication
- [ ] User info displayed in sidebar
- [ ] Logout works correctly
- [ ] Protected routes redirect to login when not authenticated

### Course Generation
- [ ] Home page loads with course generation form
- [ ] Can enter topic in input field
- [ ] "Generate" button triggers API call
- [ ] Loading state displays during generation
- [ ] Success toast appears on completion
- [ ] New course appears in course list
- [ ] Can navigate to course detail page
- [ ] Course has correct title and description
- [ ] Modules are displayed correctly
- [ ] Each module shows correct number of lessons

### Lesson Content Generation
- [ ] Can navigate to individual lesson page
- [ ] Lesson title and metadata displayed
- [ ] "Generate Lesson Content" button visible for empty lessons
- [ ] Loading state during content generation
- [ ] Content blocks render correctly:
  - [ ] Headings
  - [ ] Paragraphs
  - [ ] Code blocks with syntax highlighting
  - [ ] YouTube videos (if applicable)
  - [ ] Multiple choice questions
- [ ] Learning objectives displayed (if present)

### Interactive Features
- [ ] MCQ questions can be selected
- [ ] "Submit Answer" button works
- [ ] Correct/incorrect feedback displays
- [ ] Explanation shows after submission
- [ ] "Try Again" button resets quiz
- [ ] YouTube videos load and play
- [ ] Code blocks are properly formatted

### PDF Export
- [ ] "Download as PDF" button visible on lessons with content
- [ ] Clicking button triggers PDF generation
- [ ] PDF downloads successfully
- [ ] PDF contains all lesson content
- [ ] PDF formatting is readable
- [ ] PDF filename is appropriate

### Course Management
- [ ] Can view list of all created courses
- [ ] Can delete courses
- [ ] Deletion shows confirmation
- [ ] Deleted course removed from list
- [ ] Can navigate between courses
- [ ] Course data persists across sessions

## Performance Testing

### Load Times
- [ ] Home page loads in < 3 seconds
- [ ] Course detail page loads in < 3 seconds
- [ ] Lesson page loads in < 3 seconds
- [ ] API responses return in reasonable time (< 5 seconds for generation)

### Responsiveness
- [ ] Application works on desktop (1920x1080)
- [ ] Application works on tablet (768x1024)
- [ ] Application works on mobile (375x667)
- [ ] Sidebar collapses/adapts on small screens
- [ ] Content is readable on all screen sizes

## Security Testing

### Authentication
- [ ] Cannot access protected routes without login
- [ ] JWT tokens expire appropriately
- [ ] Token refresh works silently
- [ ] Logout clears tokens properly

### API Security
- [ ] Protected endpoints require authentication
- [ ] Invalid tokens return 401 Unauthorized
- [ ] Cannot access other users' courses
- [ ] No sensitive data in error responses
- [ ] CORS only allows configured origins

## Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Integration Testing

### YouTube API
- [ ] Video search returns relevant results
- [ ] Videos embed correctly
- [ ] Videos are playable
- [ ] Graceful handling if no videos found

### Gemini AI API
- [ ] Course generation produces valid JSON
- [ ] Lesson generation produces valid JSON
- [ ] Content is relevant to topic
- [ ] AI responses are properly parsed
- [ ] Error handling for API failures

### Auth0 Integration
- [ ] Social logins work (if enabled)
- [ ] Email/password login works
- [ ] User profile data retrieved correctly
- [ ] Token verification on backend works

## Error Handling

### Frontend Error States
- [ ] Network errors show user-friendly messages
- [ ] Loading states display during async operations
- [ ] Empty states display when no data
- [ ] 404 pages for invalid routes
- [ ] Graceful degradation when APIs fail

### Backend Error Handling
- [ ] 400 Bad Request for invalid input
- [ ] 401 Unauthorized for missing/invalid tokens
- [ ] 404 Not Found for missing resources
- [ ] 500 Internal Server Error with generic message
- [ ] Errors logged on server (not exposed to client)

## Post-Deployment

### Monitoring
- [ ] Check Render logs for errors
- [ ] Check Vercel logs for errors
- [ ] Monitor MongoDB Atlas metrics
- [ ] Check API rate limits (Gemini, YouTube)

### Documentation
- [ ] README.md updated with live URLs
- [ ] Environment variable examples up to date
- [ ] API documentation accurate
- [ ] Deployment guide tested and accurate

### User Feedback
- [ ] Create demo video showcasing features
- [ ] Share project with test users
- [ ] Collect and address feedback
- [ ] Document known issues

## Optional Enhancements

- [ ] Add analytics (Google Analytics, Mixpanel)
- [ ] Implement error tracking (Sentry)
- [ ] Add rate limiting on backend
- [ ] Implement caching for frequently accessed data
- [ ] Add progress tracking for lessons
- [ ] Implement course sharing feature
- [ ] Add export entire course as PDF
- [ ] Implement dark/light theme toggle
- [ ] Add more language support
- [ ] Create mobile app version

## Final Verification

- [ ] All features from problem statement implemented
- [ ] Live site accessible and functional
- [ ] GitHub repository has complete code
- [ ] README has clear setup instructions
- [ ] Demo video recorded (5 minutes max)
- [ ] All deliverables ready for submission

## Submission Checklist

For Hackathon Submission:
- [ ] Live site URL: _______________________
- [ ] GitHub repository: _______________________
- [ ] Demo video: _______________________
- [ ] README includes:
  - [ ] Project description
  - [ ] Technology stack
  - [ ] Setup instructions
  - [ ] Live demo links
  - [ ] Screenshots/GIFs
- [ ] Code quality:
  - [ ] Clean, commented code
  - [ ] Modular architecture
  - [ ] Proper error handling
  - [ ] No console.logs in production

---

## Notes Section

### Issues Encountered:
- 
- 
- 

### Solutions Applied:
- 
- 
- 

### Future Improvements:
- 
- 
- 

### Testing Date: _______________
### Tester Name: _______________
### Deployment Date: _______________

---

**Status: Ready for Submission** ✅

Good luck! 🚀
