export const MAX_FALLBACK_CHARS = 5000;

export function extractContextInPage(maxChars = MAX_FALLBACK_CHARS) {
  const selection = window.getSelection()?.toString().trim() || "";
  const bodyText = document.body?.innerText?.trim() || "";
  const fallbackText = bodyText.slice(0, maxChars);
  const contextType = selection ? "highlighted text" : "page content";
  const contextText = selection || fallbackText;

  return {
    url: window.location.href,
    title: document.title || "",
    selection,
    fallbackText,
    contextType,
    contextText
  };
}

export function normalizeContext(context) {
  return {
    url: typeof context?.url === "string" ? context.url : "",
    title: typeof context?.title === "string" ? context.title : "",
    selection: typeof context?.selection === "string" ? context.selection : "",
    fallbackText: typeof context?.fallbackText === "string" ? context.fallbackText : "",
    contextType: typeof context?.contextType === "string" ? context.contextType : "page content",
    contextText: typeof context?.contextText === "string" ? context.contextText : ""
  };
}
