# Text to Learn - Complete Setup Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Getting API Keys](#getting-api-keys)
3. [Auth0 Setup](#auth0-setup)
4. [MongoDB Setup](#mongodb-setup)
5. [Local Development](#local-development)
6. [Deployment](#deployment)
7. [Testing](#testing)

## Prerequisites

- Node.js v16 or higher
- npm or yarn
- Git
- A code editor (VS Code recommended)

## Getting API Keys

### 1. Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key"
4. Create a new API key or use an existing one
5. Copy the API key for use in `.env`

### 2. YouTube Data API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "YouTube Data API v3"
4. Go to Credentials → Create Credentials → API Key
5. Copy the API key for use in `.env`

## Auth0 Setup

### Step 1: Create Auth0 Account
1. Visit [Auth0.com](https://auth0.com/) and sign up
2. Create a new tenant (e.g., "text-to-learn")

### Step 2: Create Application
1. Go to Applications → Create Application
2. Choose "Single Page Web Applications"
3. Select "React" as the technology
4. Note down:
   - Domain (e.g., `dev-xxxxx.auth0.com`)
   - Client ID

### Step 3: Configure Application Settings
Add the following URLs in your Auth0 application settings:

**Allowed Callback URLs:**
```
http://localhost:3000, https://your-frontend-domain.vercel.app
```

**Allowed Logout URLs:**
```
http://localhost:3000, https://your-frontend-domain.vercel.app
```

**Allowed Web Origins:**
```
http://localhost:3000, https://your-frontend-domain.vercel.app
```

**Allowed Origins (CORS):**
```
http://localhost:3000, https://your-frontend-domain.vercel.app
```

### Step 4: Create API
1. Go to Applications → APIs → Create API
2. Name: "Text to Learn API"
3. Identifier: `https://text-to-learn-api` (use as AUTH0_AUDIENCE)
4. Signing Algorithm: RS256

## MongoDB Setup

### Option 1: MongoDB Atlas (Recommended for Production)

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (Free tier is sufficient)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Replace `myFirstDatabase` with your database name (e.g., `text-to-learn`)

Example connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/text-to-learn?retryWrites=true&w=majority
```

### Option 2: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/text-to-learn`

## Local Development

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/text-to-learn
AUTH0_ISSUER=https://dev-xxxxx.auth0.com/
AUTH0_AUDIENCE=https://text-to-learn-api
GEMINI_API_KEY=your-gemini-api-key
YOUTUBE_API_KEY=your-youtube-api-key
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

Server should be running on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_AUTH0_DOMAIN=dev-xxxxx.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://text-to-learn-api
VITE_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

Frontend should be running on `http://localhost:3000`

## Deployment

### Backend Deployment (Render)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Create Render Account:**
   - Visit [Render.com](https://render.com/)
   - Sign up/login with GitHub

3. **Create Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - Name: `text-to-learn-backend`
     - Root Directory: `server`
     - Build Command: `npm install`
     - Start Command: `node server.js`

4. **Add Environment Variables:**
   - Go to Environment tab
   - Add all variables from `.env`:
     - PORT (use 5000 or let Render auto-assign)
     - MONGO_URI
     - AUTH0_ISSUER
     - AUTH0_AUDIENCE
     - GEMINI_API_KEY
     - YOUTUBE_API_KEY
     - NODE_ENV=production

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment
   - Note the URL: `https://text-to-learn-backend.onrender.com`

### Frontend Deployment (Vercel)

1. **Push to GitHub** (if not already done)

2. **Create Vercel Account:**
   - Visit [Vercel.com](https://vercel.com/)
   - Sign up/login with GitHub

3. **Import Project:**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Configure:
     - Root Directory: `client`
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`

4. **Add Environment Variables:**
   - Go to Settings → Environment Variables
   - Add:
     - VITE_AUTH0_DOMAIN
     - VITE_AUTH0_CLIENT_ID
     - VITE_AUTH0_AUDIENCE
     - VITE_API_URL (use your Render backend URL)

5. **Deploy:**
   - Click "Deploy"
   - Wait for deployment
   - Note the URL: `https://your-app.vercel.app`

6. **Update Auth0:**
   - Go back to Auth0 Dashboard
   - Update application URLs to include Vercel URL
   - Update API CORS settings

## Testing

### Testing the Application

1. **Test Authentication:**
   - Visit your deployed frontend URL
   - Click "Sign In / Sign Up"
   - Create an account or login
   - Verify redirect back to homepage

2. **Test Course Generation:**
   - Enter a topic (e.g., "Introduction to Python")
   - Click "Generate"
   - Wait for course structure to be created
   - Verify modules and lessons are displayed

3. **Test Lesson Content:**
   - Click on a course
   - Select a lesson
   - Click "Generate Lesson Content"
   - Verify content blocks appear (headings, text, code, MCQs)

4. **Test Video Integration:**
   - Check if YouTube videos load in lessons
   - Verify video is relevant to the topic

5. **Test PDF Export:**
   - Click "Download as PDF" on any lesson
   - Verify PDF downloads correctly
   - Open PDF and check formatting

### API Testing with Postman/Curl

**Health Check:**
```bash
curl https://your-backend-url.onrender.com/health
```

**Generate Course (requires token):**
```bash
curl -X POST https://your-backend-url.onrender.com/api/courses/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"topic": "Introduction to React"}'
```

## Troubleshooting

### Common Issues

1. **Auth0 Error: "Invalid state"**
   - Check that callback URLs match exactly
   - Clear browser cache and cookies

2. **MongoDB Connection Error**
   - Verify connection string format
   - Check IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for testing)
   - Verify username and password

3. **API Key Errors**
   - Verify all API keys are correct
   - Check quotas and billing for Google APIs
   - Ensure YouTube API is enabled in Google Cloud Console

4. **CORS Errors**
   - Verify CORS settings in backend
   - Check Auth0 CORS configuration
   - Ensure frontend URL is whitelisted

5. **Deployment Issues**
   - Check build logs for errors
   - Verify all environment variables are set
   - Check Node.js version compatibility

## Support

For issues or questions:
1. Check the main README.md
2. Review error logs in browser console
3. Check backend logs on Render
4. Open an issue on GitHub

## Next Steps

After successful setup:
1. Test all features thoroughly
2. Customize the UI and styling
3. Add more content types
4. Implement progress tracking
5. Add course sharing features
6. Optimize performance

---

Happy Learning! 🚀
