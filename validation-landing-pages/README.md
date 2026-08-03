# Validation Landing Pages

Five short, mobile-first landing pages for validating app ideas. The site uses one reusable React component; each idea's copy and mockup data live in one configuration file.

## Install dependencies

```bash
npm install
```

## Start the local development server

```bash
npm run dev
```

Open the URL Vite prints (normally `http://localhost:5173`). The home page links to all five ideas.

## Build for production

```bash
npm run build
```

The production-ready files will be created in `dist/`.

## Deploy to Vercel

1. Push this folder to a Git repository (GitHub, GitLab, or Bitbucket).
2. Sign in to [Vercel](https://vercel.com) and choose **Add New → Project**.
3. Import the repository.
4. Vercel should detect **Vite** automatically. Confirm that the build command is `npm run build` and the output directory is `dist`.
5. Select **Deploy**.

For direct links such as `/adhd-spending`, `vercel.json` rewrites requests to the React app.

## Where to edit copy

Edit `src/landingPageConfig.ts`. It holds the headline, subheadline, benefits, signup questions, colors, and phone-mockup content for every page.

## Google Forms later

Submissions currently stay in the browser's component state and are not saved. The submit handler in `src/components/LandingPage.tsx` contains a clearly marked `GOOGLE FORMS INTEGRATION PLACEHOLDER` comment. That is where a future request to the form endpoint will be added.
