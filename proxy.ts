import { NextResponse, type NextRequest } from "next/server";
import { isCategory } from "lib/categories";

export function proxy(request: NextRequest) {
  // Next's static matcher can serve /categoria/ropa for /categoria/Ropa
  // without running the page guard. Validate before static route resolution.
  const id = request.nextUrl.pathname.match(/^\/categoria\/([^/]+)\/?$/)?.[1];
  if (!id || !isCategory(id)) {
    const url = request.nextUrl.clone();
    url.pathname = "/_not-found";
    return NextResponse.rewrite(url, { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  // Keep canonical static pages out of Proxy, including a trailing slash.
  // Next requires a literal matcher; test:categories checks it against CATEGORIES.
  matcher: "/categoria/((?!(?:ropa|calzado|higiene|muebles|limpieza|peques)/?$).*)",
};
