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

## 5. Storage Rules & Limitations (Phase 0)
- **Role Validation Limitation**: Firebase Storage Security Rules *cannot* directly read the Realtime Database to verify user roles.
- **Current Approach**: To bypass this without custom claims via Cloud Functions, the system uses strictly ownership-based paths (e.g. `staff/{userId}/*`). The rule `request.auth.uid == userId` enforces that users can only upload files to their own directory. Custom claims (`request.auth.token.role`) have been completely removed from storage rules as they are dead code without Cloud Functions.
- **Admissions Upload Flow**: The admissions application form is public. It uploads documents to `admissions-pending/{applicationId}/*` using an unauthenticated path (`allow write: if true`). **Limitation:** This path is abuse-prone as it lacks rate limiting or strict size restrictions without Cloud Functions.
- **Gallery Uploads**: Since Gallery requires admin moderation, we implemented a "pending" pattern. Users upload to `/gallery-pending/{userId}/`, which enforces `request.auth.uid == userId`. Only admins can promote items to the public-read `/gallery/` path via the Admin UI. **Limitation:** Storage rules for `/gallery/` still rely on `request.auth.uid == userId`, meaning the enforcement of "only admins can publish" happens at the Client-Side (React Router `ProtectedRoute` and Admin UI) and via RTDB metadata rules, not at the actual Storage bucket write level.
