# Revomatix freight-forwarder landing page

A standalone, static marketing page for validating Revomatix with road and groupage freight forwarders. It uses plain HTML, CSS and JavaScript. There is no build step, backend, analytics or cookie tracking.

## Run locally

From the repository root:

```bash
python3 -m http.server 4173 --directory freight-forwarders
```

Open [http://127.0.0.1:4173](http://127.0.0.1:4173).

## Edit the page

- **Copy, integrations, form choices and FAQ:** edit the `COPY` object near the top of `script.js`.
- **Colours and design tokens:** edit the CSS variables at the top of `styles.css`.
- **Contact email:** replace `hello@revomatix.example` in `script.js`.
- **Form endpoint:** set `FORM_ENDPOINT` at the top of `script.js` to a Formspree, Netlify Forms-compatible, or similar endpoint. Leave it empty to use the honest mail-client fallback.

The form shows the success message only after a configured endpoint confirms that the submission was accepted. With no endpoint, it opens a pre-filled email and tells the visitor to send it.

## Deploy

This folder can be deployed without a build command.

### Vercel

1. Import the Git repository.
2. Set **Root Directory** to `validation-landing-pages/freight-forwarders` if the repository root is `AI-App-Studio`, or `freight-forwarders` if the Vite project is the repository root.
3. Choose **Other** as the framework preset.
4. Leave Build Command empty and set Output Directory to `.`.
5. Deploy, then add the production form endpoint and contact email before outreach.

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

1. Replace the placeholder contact email.
2. Configure and test the form endpoint.
3. Add a real absolute Open Graph image URL when a share image and public domain are available.
4. Confirm the final public URL and add a canonical link if required.
