const metaEl = document.getElementById("meta");
const previewEl = document.getElementById("preview");
const questionEl = document.getElementById("question");
const sendButtonEl = document.getElementById("sendButton");
const errorEl = document.getElementById("error");

let currentContext = null;

function setError(message) {
  if (!message) {
    errorEl.textContent = "";
    errorEl.classList.add("hidden");
    return;
  }

  errorEl.textContent = message;
  errorEl.classList.remove("hidden");
}

function truncate(value, max) {
  return value.length > max ? `${value.slice(0, max)}…` : value;
}

async function request(type, payload = {}) {
  return chrome.runtime.sendMessage({ type, ...payload });
}

async function loadContext() {
  const response = await request("GET_CONTEXT");
  if (!response?.ok) {
    throw new Error(response?.error || "Could not load page context.");
  }

  currentContext = response.context;

  const sourceLabel = currentContext.contextType === "highlighted text"
    ? "Using highlighted text"
    : "Using page content fallback";

  metaEl.textContent = `${sourceLabel} • ${truncate(currentContext.title || "Untitled page", 80)}`;
  previewEl.textContent = truncate(currentContext.contextText || "", 500);
}

async function sendToKagi() {
  if (!currentContext) {
    setError("Context is not loaded yet.");
    return;
  }

  sendButtonEl.disabled = true;
  setError("");

  try {
    const response = await request("SEND_TO_KAGI", {
      question: questionEl.value,
      context: currentContext
    });

    if (!response?.ok) {
      throw new Error(response?.error || "Could not open Kagi Assistant.");
    }

    window.close();
  } catch (error) {
    setError(error instanceof Error ? error.message : "Unexpected error.");
  } finally {
    sendButtonEl.disabled = false;
  }
}

sendButtonEl.addEventListener("click", sendToKagi);

(async () => {
  try {
    await loadContext();
  } catch (error) {
    setError(error instanceof Error ? error.message : "Unexpected error.");
    metaEl.textContent = "Context unavailable";
    previewEl.textContent = "";
    sendButtonEl.disabled = true;
  }
})();
