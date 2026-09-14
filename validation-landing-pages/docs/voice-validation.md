# Voice AI validation website

Local preview: http://127.0.0.1:5173/moving

## Edit points

- `src/voice/config.ts`: central `voiceBrand`, typed industry content and metadata. All eleven routes use the final supplied hero subheads and industry-specific workflows.
- `src/voice/VoiceApp.tsx`: shared header, animated ConversationPreview, handoff summary, sections, accessible preview form, FAQ, footer, and explicit unavailable page.
- `src/voice/voice.css`: shared responsive visual system and semantic color tokens in the opening `:root` block. All eleven pages use the same white, navy and pale-blue palette. Input borders use a darker token for control contrast.
- `src/main.tsx`: chooses the voice entry point before the older experiments; legacy styles and analytics initialization are skipped for the eleven reserved voice routes.
- `index.html`: skips the legacy Meta pixel on voice routes. The unconditional no-JavaScript tracking image was removed so the preview cannot send that request.

One Vite application and deployment serves the routes. Add future content to `voicePages` using the same type and layout; do not create separate applications. All eleven routes load directly with their matching content. Existing unrelated experiments retain their routing.

## Preview behavior

Required name, company and email use native browser validation. Whitespace-only name/company values are rejected. The optional note is limited to 2,000 characters. Submission is prevented locally: there is no request, storage, email, analytics or backend. Valid submission explicitly reports that this is a preview and no information was sent.

## Before launch

1. Approve the final Revomatix branding and copy.
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

## Final visual refinement verification

All eleven hero and conversation previews were inspected at 1280px desktop and 390px mobile with no horizontal overflow. Four complete turns reveal once, followed by an accurate next-step card. Keyboard replay was verified; the moving panel height remained 613.375px before and after replay on mobile. Waveform animation has a finite iteration count. Reduced-motion CSS disables every sequence animation and displays complete content immediately; OS reduced-motion emulation was not available in the browser tool.

Shared navigation, mobile menu, anchor links, keyboard FAQ operation and required-field form validation were checked. Valid form submission still explicitly says no information was sent. The build and whitespace check pass. No former green tokens or long-dash punctuation remain in voice source. The later example is a handoff summary rather than a duplicate transcript. Restoration stays inbound and ends with an alert prepared for review.

## Revomatix assets

Brand name and local asset paths are centralized in `src/voice/config.ts`. Original PNGs are preserved in `public/assets/revomatix/`; cropped copies remove only transparent outer margins. The header/footer artwork renders at 190px desktop and 160px mobile, with explicit intrinsic dimensions. The preview uses one decorative symbol next to “Revomatix · AI assistant.” The favicon is derived from the supplied symbol.

Build and diff checks passed. All eleven routes were checked at 1280px and 390px for loaded images, titles, header sizing and overflow. Brand-to-top, mobile menu and keyboard FAQ interactions passed.
