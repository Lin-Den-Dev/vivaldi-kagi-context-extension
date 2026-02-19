const MAX_QUERY_CHARS = 12000;

function compactWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

export function buildKagiQuery({ question, context }) {
  const safeQuestion = compactWhitespace(typeof question === "string" ? question : "");
  const safeContextType = context.contextType || "page content";
  const safeContextText = compactWhitespace(context.contextText || "");
  const safeUrl = context.url || "";
  const safeTitle = compactWhitespace(context.title || "");

  const lines = [];
  if (safeQuestion) {
    lines.push(`Question: ${safeQuestion}`);
  } else {
    lines.push("Question: Please analyze the context below.");
  }

  if (safeTitle) {
    lines.push(`Page Title: ${safeTitle}`);
  }

  lines.push(
    "",
    safeContextType === "highlighted text"
      ? `Selected Context: \"${safeContextText}\"`
      : `Page Content: ${safeContextText}`,
    "",
    `URL: ${safeUrl}`
  );

  const query = lines.join("\n").trim();
  return query.slice(0, MAX_QUERY_CHARS);
}
