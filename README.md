# Chromium → Kagi Assistant Context Extension

A browser extension for Chromium-based browsers that collects context from the currently open page and sends it to Kagi Assistant AI.

## What this extension does

- Captures context from the active tab:
  - selected text (preferred)
  - fallback: first 5000 characters of page text
- Adds page metadata (`title`, `url`) to the final prompt.
- Opens Kagi Assistant in a new tab with configured URL parameters.

## Quick start

1. Open your browser extensions page, for example:
  - `chrome://extensions`
  - `edge://extensions`
  - `brave://extensions`
  - `vivaldi://extensions`
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this repository folder.
4. Open any regular `http/https` page.
5. Click the extension icon.
6. (Optional) Enter your question.
7. Click **Send to Kagi Assistant**.

## How to use it (daily flow)

1. Highlight text on a page if you want precise context.
2. Open the extension popup.
3. Confirm the preview section:
   - if text is highlighted, it uses highlighted context;
   - otherwise, it uses page-content fallback.
4. Enter a question (optional).
5. Configure Kagi options if needed.
6. Send to Kagi.

## Kagi options in popup

- **Prompt behavior**
  - `q`: submits immediately.
  - `qvalue`: pre-fills prompt without submitting.
- **Profile**: choose from bundled profiles list.
- **Internet override**: force `true` or `false`.
- **Lens**: set lens slug (for example `programming`).
  - If `lens` is set and `internet` is not explicitly set, the extension auto-sets `internet=true`.

The bundled profile list is maintained in [src/profiles.js](src/profiles.js).

## Examples

- Highlight a paragraph + ask: “Summarize this in 5 bullets.”
- No highlight + ask: “What is the main argument of this page?”
- Set `qvalue` if you want to review/edit prompt first in Kagi.
- Set `profile` + `lens` for model- and domain-specific behavior.

## Troubleshooting

- **Popup says page is not supported**
  - Open a normal `http/https` page (not browser-internal pages such as `chrome://*`, `edge://*`, `vivaldi://*`, etc.).
- **No useful context in preview**
  - Try selecting text manually and reopen popup.
- **Kagi opens but output is odd**
  - Reduce question length and/or clear lens/profile overrides.
- **Very long pages**
  - URL transport has practical limits; highlight only relevant parts for best reliability.

## Permissions

- `activeTab` – access currently active tab after user action.
- `scripting` – execute extraction logic in page context.
- `tabs` – open Kagi Assistant in a new tab.
- `storage` – persist popup options (`mode`, `profile`, `internet`, `lens`).

## Architecture

- `manifest.json` – MV3 extension configuration.
- `src/background.js` – service worker that handles popup messages and opens Kagi Assistant.
- `src/extractContext.js` – page-context extraction logic (`selection`, fallback text, title, URL).
- `src/promptBuilder.js` – query/prompt composition.
- `src/kagi.js` – Kagi Assistant URL builder.
- `src/profiles.js` – bundled Kagi profile list for popup dropdown.
- `popup.html` + `popup.js` – popup UI, preview, settings, and send action.

## Status

MVP implementation is in place and ready for local testing in Chromium-based browsers.

## URL Size Considerations

- Kagi may accept large text input, but browser URL length is still a practical limit.
- This extension keeps context concise (selection first, fallback snippet second) to reduce the risk of truncated URLs.
- For very large payloads, a future API-based integration (POST request) is the robust approach.

## Notes

- Restricted pages (browser-internal pages like `chrome://*`, `edge://*`, `vivaldi://*`, etc.) are not supported by design.
- This MVP uses URL query transfer and does not use a Kagi API key.

## Next Steps

- Add programmable button integration flow once target user code path is finalized.
- Add optional prompt preview formatting controls.
- Add lightweight telemetry/debug logging (optional, local only).

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).