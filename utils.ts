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
