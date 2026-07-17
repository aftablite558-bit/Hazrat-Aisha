# Project Structure

The project follows a modular React/Vite structure, optimizing for maintainability and code-splitting.

```
/
├── public/                 # Static assets (images, icons, manifest, robots.txt)
├── src/
│   ├── components/
│   │   ├── layout/         # Shared layout components (Sidebar, Topbar, Layout)
│   │   ├── routing/        # ProtectedRoute, Route transitions
│   │   ├── seo/            # SEO component
│   │   └── ui/             # Reusable UI components (buttons, inputs, modals, toasts)
│   ├── context/            # React Contexts (AuthContext, ThemeContext, ToastContext)
│   ├── hooks/              # Custom React Hooks
│   ├── lib/                # Third-party library configurations (Firebase, Utils)
│   ├── pages/              # Application Routes (Code-split via lazy loading)
│   │   ├── public/         # Public-facing website pages
│   │   ├── auth/           # Authentication pages
│   │   ├── students/       # Student management module
│   │   ├── staff/          # Staff management module
│   │   ├── attendance/     # Attendance module
│   │   ├── admissions/     # Admissions module
│   │   ├── fees/           # Fee management module
│   │   ├── exams/          # Examination module
│   │   └── settings/       # System administration module
│   ├── services/           # API and Database interaction services
│   ├── types/              # TypeScript global definitions
│   ├── App.tsx             # Main Application Component (Routing)
│   ├── main.tsx            # Application Entry Point
│   └── index.css           # Global Tailwind CSS Styles
├── .env.example            # Environment variables template
├── package.json            # NPM dependencies and scripts
├── vite.config.ts          # Vite configuration and PWA setup
└── ...                     # Other configuration files (eslint, tsconfig)
```
