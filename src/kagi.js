const KAGI_ASSISTANT_BASE_URL = "https://kagi.com/assistant?q=";

export function buildKagiAssistantUrl(query) {
  return `${KAGI_ASSISTANT_BASE_URL}${encodeURIComponent(query)}`;
}
