# Text to Learn - Frontend

React frontend for the AI-powered course generator.

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file:

```env
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=your-api-identifier
VITE_API_URL=http://localhost:5000
```

## Running

Development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Features

- Course generation and management
- Rich lesson rendering
- PDF export
- YouTube video integration
- Auth0 authentication
