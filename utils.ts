export function wrapURLs(text: string): string {
  // Requisites:
  // - The URL starts with either HTTP or HTTPS and
  // - then followed by :// and
  // - then it must contain www. and
  // - then followed by a subdomain of length (2, 256) and
  // - The last part contains the domain.
  const urlPattern =
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

  // Check string for any url patterns and wrap them in anchor tags
  return text.replace(
    urlPattern,
    (url) =>
      `<br /><a class="text-indigo-600 hover:text-stone-600" target="_blank" href="${url.trim()}">${url.trim()}</a>`
  );
}

export function slugify(text: string): string {
  return text
    .normalize("NFKD") // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
    .toLowerCase() // Convert the string to lowercase letters
    .trim() // Remove whitespace from both sides of a string (optional)
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\_/g, "-") // Replace _ with -
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/\-$/g, ""); // Remove trailing -
}

export async function urlToBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = response.headers.get("content-type") || "image/jpeg";
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error("Error converting URL to base64:", error);
    return url; // Fallback to original URL if conversion fails
  }
}
