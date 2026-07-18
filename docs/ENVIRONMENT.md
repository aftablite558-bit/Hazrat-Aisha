# Environment Configuration

The application requires specific environment variables to connect to Firebase.

## Setup

1. Copy `.env.example` to a new file named `.env` in the root directory.
2. Fill in the values with your Firebase Project configuration.

```env
# .env.example
VITE_FIREBASE_API_KEY=""
VITE_FIREBASE_AUTH_DOMAIN=""
VITE_FIREBASE_DATABASE_URL=""
VITE_FIREBASE_PROJECT_ID=""
VITE_FIREBASE_STORAGE_BUCKET=""
VITE_FIREBASE_MESSAGING_SENDER_ID=""
VITE_FIREBASE_APP_ID=""
```

## Usage in Code

Environment variables are accessed via `import.meta.env.VITE_VARIABLE_NAME`. The Firebase initialization file (`src/lib/firebase.ts`) reads these variables to configure the SDK.
