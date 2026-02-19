import { extractContextInPage, normalizeContext, MAX_FALLBACK_CHARS } from "./extractContext.js";
import { buildKagiQuery } from "./promptBuilder.js";
import { buildKagiAssistantUrl } from "./kagi.js";

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    throw new Error("No active tab found.");
  }
  return tab;
}

function isSupportedUrl(url) {
  return typeof url === "string" && /^https?:\/\//i.test(url);
}

async function collectContext(tabId) {
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: extractContextInPage,
    args: [MAX_FALLBACK_CHARS]
  });

  return normalizeContext(result);
}

async function handleGetContext() {
  const tab = await getActiveTab();
  if (!isSupportedUrl(tab.url)) {
    return {
      ok: false,
      error: "This page is not supported. Open an http/https page and try again."
    };
  }

  const context = await collectContext(tab.id);
  if (!context.contextText) {
    return {
      ok: false,
      error: "Could not extract text content from this page."
    };
  }

  return {
    ok: true,
    context
  };
}

async function handleSendToKagi(question, context) {
  const safeContext = normalizeContext(context);
  if (!safeContext.contextText) {
    throw new Error("Missing context text.");
  }

  const query = buildKagiQuery({ question, context: safeContext });
  const url = buildKagiAssistantUrl(query);

  await chrome.tabs.create({ url });
  return { ok: true };
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  (async () => {
    try {
      if (message?.type === "GET_CONTEXT") {
        sendResponse(await handleGetContext());
        return;
      }

      if (message?.type === "SEND_TO_KAGI") {
        sendResponse(await handleSendToKagi(message.question, message.context));
        return;
      }

      sendResponse({ ok: false, error: "Unknown message type." });
    } catch (error) {
      sendResponse({
        ok: false,
        error: error instanceof Error ? error.message : "Unexpected error."
      });
    }
  })();

  return true;
});
