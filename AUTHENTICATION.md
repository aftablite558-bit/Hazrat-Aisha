# Authentication

Authentication is handled securely using **Firebase Authentication**.

## Provider

Currently, the application relies on Email/Password authentication.

## Context

The `AuthContext` (`src/context/AuthContext.tsx`) manages the global authentication state. It listens to Firebase Auth state changes and provides the current `user` object and a `loading` flag to the rest of the application.

## Protected Routes

The `ProtectedRoute` component (`src/components/routing/ProtectedRoute.tsx`) is used to wrap routes that require authentication. It checks if a user is logged in.
- If not logged in, it redirects to the login page.
- It also supports Role-Based Access Control (RBAC) by accepting an `allowedRoles` array. If the user's role does not match, they are redirected to an Unauthorized page.

## Registration flow

New administrative users are created via the User Management module by existing Administrators, which invokes Firebase Admin functions or secondary apps to create accounts without logging out the current admin user.
