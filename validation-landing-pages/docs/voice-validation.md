# Voice AI validation website

Local preview: http://127.0.0.1:5173/moving

## Edit points

- `src/voice/config.ts`: central `voiceBrand`, typed industry content and metadata. All eleven routes use the final supplied hero subheads and industry-specific workflows.
- `src/voice/VoiceApp.tsx`: shared header, workflow illustration, sections, accessible preview form, FAQ, footer, and explicit unavailable page.
- `src/voice/voice.css`: shared responsive visual system and semantic color tokens in the opening `:root` block. All eleven pages use the same warm-white, forest-green and sage palette. Input borders use a darker token for control contrast.
- `src/main.tsx`: chooses the voice entry point before the older experiments; legacy styles and analytics initialization are skipped for the eleven reserved voice routes.
- `index.html`: skips the legacy Meta pixel on voice routes. The unconditional no-JavaScript tracking image was removed so the preview cannot send that request.

One Vite application and deployment serves the routes. Add future content to `voicePages` using the same type and layout; do not create separate applications. All eleven routes load directly with their matching content. Existing unrelated experiments retain their routing.

## Preview behavior

Required name, company and email use native browser validation. Whitespace-only name/company values are rejected. The optional note is limited to 2,000 characters. Submission is prevented locally: there is no request, storage, email, analytics or backend. Valid submission explicitly reports that this is a preview and no information was sent.

## Before launch

1. Confirm the final brand (currently Voice AI) and approve copy.
2. Choose and authorize a real form destination, implement delivery/error handling and appropriate privacy information, and verify a real submission before removing preview notices.
3. Choose the single domain/deployment target and root-path behavior. This repository contains older experiments; these have not been repurposed or deployed.
4. Confirm pilot operations: contact rules, approved answers, handoff ownership and software compatibility. The page makes no built-in integration or production-readiness claims.
5. No analytics or voice integration is included in this build.

## Local commands

```sh
cd /Users/povilaslapienis/Documents/AI-App-Studio/validation-landing-pages
npm run build
npm run dev -- --host 127.0.0.1
```

## Scoped Git handoff

Review the index before committing; do not include unrelated changes from the parent repository.

```sh
cd /Users/povilaslapienis/Documents/AI-App-Studio/validation-landing-pages
git add src/voice/config.ts src/voice/VoiceApp.tsx src/voice/voice.css src/main.tsx index.html docs/voice-validation.md
git diff --cached --stat
git diff --cached
git commit -m "Finalize all eleven voice AI landing pages"
git push
```

No commit, push or deployment was performed.

## Copy update verification

All eleven routes were inspected at 1280px desktop, 768px tablet and 390px mobile widths with no horizontal overflow. Exact final subheads, headings, niche conversations, FAQ copy, labels and anchor destinations were reviewed. The common palette replaces all former blue values. Sample measured contrast: button text 7.23:1, hero body text 6.25:1, preview notice 6.54:1. The local form still prevents delivery and reports that no information was sent. Restoration remains inbound overflow intake, with team acceptance required after an alert. Bracketed message placeholders were replaced with clearly labeled illustrative message content.
