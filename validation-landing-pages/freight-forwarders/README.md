# Revomatix freight-forwarder landing page

A standalone, static marketing page for validating Revomatix with road, sea and air freight forwarders. It uses plain HTML, CSS and JavaScript. The page itself has no framework, backend, analytics or cookie tracking.

## Run locally

From the `validation-landing-pages` directory:

```bash
python3 -m http.server 4173
```

Open [http://127.0.0.1:4173/freight-forwarders/](http://127.0.0.1:4173/freight-forwarders/).

## Edit the page

- **Copy, pain points, workflow, RFQ examples, V2 concept, form choices and FAQ:** edit the `COPY` object near the top of `script.js`.
- **Colours and design tokens:** edit the CSS variables at the top of `styles.css`.
- **Contact email:** edit `CONTACT_EMAIL` near the top of `script.js`.
- **Form endpoint:** set `FORM_ENDPOINT` at the top of `script.js` to a Formspree, Netlify Forms-compatible, or similar endpoint. Leave it empty to use the honest mail-client fallback.

The form shows the success message only after a configured endpoint confirms that the submission was accepted. With no endpoint, it opens a pre-filled email and tells the visitor to send it.

The product examples are illustrative. Mode filters and request rows are interactive, while the delayed carrier reply is a visual simulation. `prefers-reduced-motion` disables that animation.

## Deploy

The existing Vite build copies this folder into the production output and keeps the React application shell as `app.html`. Vercel serves this page at the root URL while preserving the existing industry routes through that application shell.

### Vercel

1. Use the existing Revomatix Vercel project.
2. Keep its current Vite build settings and repository root.
3. Push these changes to the production branch.
4. Vercel will build the existing app, copy this page and serve it at `/`.
5. Verify `/`, `/moving` and another existing industry route after deployment.

### Netlify

1. Import the repository.
2. Set the Base directory to this folder.
3. Leave Build command empty.
4. Set Publish directory to `.`.

### Cloudflare Pages

1. Connect the repository.
2. Use **None** as the framework preset.
3. Leave Build command empty.
4. Set Build output directory to this folder (or `.` when it is the selected root).

## Before launch

1. Configure and test a form endpoint if you want submissions stored without opening the visitor's email app.
2. Add a real absolute Open Graph image URL when a share image is available.
3. Add a canonical link if required.
