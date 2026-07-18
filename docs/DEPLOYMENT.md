# Deployment

The application is a standard Vite Single Page Application (SPA).

## Build Command

```bash
npm run build
```

This command generates an optimized static bundle in the `dist/` directory.

## Hosting Platforms

You can deploy the `dist/` folder to any static hosting provider.

### Vercel / Netlify
- Build command: `npm run build`
- Publish directory: `dist`
- **Important:** Configure rewrites to redirect all traffic to `index.html` to support React Router's client-side routing.

### Firebase Hosting
1. Install Firebase CLI: `npm i -g firebase-tools`
2. Login: `firebase login`
3. Init: `firebase init hosting` (Select the `dist` directory)
4. Deploy: `firebase deploy --only hosting`

### Google Cloud Run
The app can be containerized using Docker and deployed to Cloud Run. A web server like Nginx should be used to serve the static files and handle routing fallbacks to `index.html`.
