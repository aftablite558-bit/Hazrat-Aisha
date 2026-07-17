# Security

Security is implemented at multiple layers:

## 1. Authentication Layer
- Handled by Firebase Authentication.
- Passwords are encrypted and managed securely by Google.

## 2. Route Protection (Frontend)
- `ProtectedRoute` components ensure that unauthorized users cannot access restricted pages in the UI.
- Even if a user bypasses UI checks, database rules prevent data access.

## 3. Database Rules (Backend)
- Firebase Realtime Database Security Rules (`database.rules.json`) dictate read/write permissions based on the user's authentication status and role.
- **Rules Logic:**
  - `Admin`: Full access.
  - `Principal`: Read access to most nodes, specific write access.
  - `Teacher`: Read/write access scoped to their relevant classes/sections for attendance and marks.
  - `Unauthenticated`: Access restricted strictly to public nodes (if any).

## 4. Environment Variables
- Sensitive configuration like Firebase API keys are stored in `.env` and injected at build time. These keys are safe to expose in client-side apps provided security rules are properly configured on the backend.
