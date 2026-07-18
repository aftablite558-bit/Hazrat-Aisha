# API Documentation

The application relies on Firebase Services rather than a traditional REST API. 

## Services Layer

All interactions with Firebase are encapsulated within the `src/services/` directory.

- `auth.service.ts`: Handles user registration, login, password resets, and session management using Firebase Authentication.
- `student.service.ts`: CRUD operations for student records in Firebase Realtime Database.
- `staff.service.ts`: CRUD operations for staff records.
- `attendance.service.ts`: Operations for logging and retrieving daily attendance.
- `fee.service.ts`: Managing fee structures, invoices, and payments.
- `exam.service.ts`: Creating exams, entering marks, and publishing results.
- `admission.service.ts`: Handling new admission inquiries and applications.
- `settings.service.ts`: Fetching and updating system-wide settings.

## Calling Services

Services are imported directly into React components or custom hooks. Most service methods return Promises and should be called asynchronously using `async/await` within a `try/catch` block.

```typescript
import { getStudents } from '../services/student.service';

// Inside a component useEffect or handler
try {
  const data = await getStudents();
  setStudents(data);
} catch (error) {
  toast.error('Failed to load students');
}
```
