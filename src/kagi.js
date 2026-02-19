const KAGI_ASSISTANT_BASE_URL = "https://kagi.com/assistant";

function normalizeMode(mode) {
  return mode === "qvalue" ? "qvalue" : "q";
}

export function buildKagiAssistantUrl(query, options = {}) {
  const searchParams = new URLSearchParams();
  const mode = normalizeMode(options.mode);

  searchParams.set(mode, query);

  if (typeof options.profile === "string" && options.profile.trim()) {
    searchParams.set("profile", options.profile.trim());
  }

  if (options.internet === "true" || options.internet === "false") {
    searchParams.set("internet", options.internet);
  }

  if (typeof options.lens === "string" && options.lens.trim()) {
    searchParams.set("lens", options.lens.trim().toLowerCase());
  }

  return `${KAGI_ASSISTANT_BASE_URL}?${searchParams.toString()}`;
}
