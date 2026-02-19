# Vivaldi → Kagi Assistant Context Extension

A browser extension (target: Vivaldi / Chromium) that collects context from the currently open page and sends it to Kagi Assistant AI.

## Goal

Make it easy to quickly ask Kagi Assistant questions based on the current page content, without manually copying the URL and text.

## MVP Scope

- Collect data from the active tab:
  - URL
  - page title
  - selected text (if present)
  - fallback: page content snippets
- User action (button / programmable button) that triggers context transfer.
- Build a payload for Kagi Assistant integration.

## Architecture

- `manifest.json` – MV3 extension configuration.
- `src/background.js` – service worker that handles popup messages and opens Kagi Assistant.
- `src/extractContext.js` – page-context extraction logic (`selection`, fallback text, title, URL).
- `src/promptBuilder.js` – query/prompt composition.
- `src/kagi.js` – Kagi Assistant URL builder.
- `popup.html` + `popup.js` – minimal UI to preview context and optionally add a question.

## Status

MVP implementation is in place and ready for local testing in Vivaldi/Chromium.

## Run

1. Open `vivaldi://extensions`.
2. Enable developer mode.
3. Load the unpacked extension from the repository folder.
4. Open any `http/https` page.
5. Click the extension icon, enter an optional question, then click **Send to Kagi Assistant**.

## Current Behavior

- The extension reads context from the active tab:
  - selected text (preferred)
  - fallback: first 5000 characters of page body text
- It adds page metadata (`title`, `url`) to the final query.
- It opens `https://kagi.com/assistant?q=...` in a new tab.

## Permissions

- `activeTab` – access the currently active tab after user action.
- `scripting` – execute extraction function in the page context.
- `tabs` – open Kagi Assistant in a new tab.

## Notes

- Restricted pages (for example `vivaldi://` or other internal browser pages) are not supported by design.
- This MVP uses URL query transfer and does not use a Kagi API key.

## Next Steps

- Add programmable button integration flow once target user code path is finalized.
- Add optional prompt preview formatting controls.
- Add lightweight telemetry/debug logging (optional, local only).