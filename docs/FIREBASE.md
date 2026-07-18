# Firebase Integration

This project relies heavily on Firebase.

## Services Used
1. **Authentication:** Managing users, sessions, and roles.
2. **Realtime Database:** Storing relational data in a JSON tree structure.
3. **Storage (Optional):** For storing files like profile pictures, notices PDFs, etc.
4. **Hosting (Optional):** For deploying the application.

## Initialization
Firebase is initialized in `src/lib/firebase.ts`. Ensure your `.env` variables match your project settings in the Firebase Console.

## Rules Update
If you modify the database structure, remember to update `database.rules.json` and deploy it to your Firebase project to maintain security.
