# Validation Landing Pages

Ten mobile-first validation pages split into Round 1 and Phase 2. Each round uses one reusable React component driven by configuration data.

## Install dependencies

```bash
npm install
```

## Start the local development server

```bash
npm run dev
```

Open the URL Vite prints (normally `http://localhost:5173`). The internal home page links to all ten ideas.

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

- Round 1: edit `src/landingPageConfig.ts`.
- Phase 2: edit `src/phase2LandingPageConfig.ts`.

Each configuration holds the route slug, headline, subheadline, CTA, benefits, signup questions, mockup content, FAQs, social proof, and colors.

## Save submissions to Google Sheets

The existing React form submits to a Google Apps Script web app, which appends each submission to a Google Sheet. Setup instructions and the exact script to copy are in `google-apps-script/Code.gs`.

After deploying the Apps Script web app, create `.env.local` in this project and add:

```bash
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

Restart `npm run dev` after creating or changing `.env.local`. For Vercel, add the same name and URL under the project's environment variables, then redeploy.

Phase 2 submissions are separated into five sheet tabs with columns matching each page's questions:

- `TrackGLP Leads`
- `TrackGLP Maintenance Leads`
- `TrackGLP Whole Journey Leads`
- `NextDate Leads`
- `Together Leads`
- `RESET Leads`
- `Arrived Leads`

Round 1 submissions continue going to `Early Access Leads`. Copy the latest `google-apps-script/Code.gs` into the spreadsheet's Apps Script editor and run `setupPhase2Sheets` once to create the five tabs. Then update the existing web-app deployment with a new version. The existing `/exec` URL remains the same.
