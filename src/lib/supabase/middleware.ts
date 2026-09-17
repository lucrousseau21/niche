import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (code && !request.nextUrl.pathname.startsWith("/auth/callback")) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/callback";
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/signup") &&
    !request.nextUrl.pathname.startsWith("/auth") &&
    !request.nextUrl.pathname.startsWith("/") &&
    request.nextUrl.pathname !== "/"
  ) {
    // allow public access to home, login, signup, auth endpoints
    // everything else (like dashboard) needs auth
    // Wait, home page is public.
    // The condition above: if NOT user AND path is not explicitly public -> redirect to login.
    // Public paths: /login, /signup, /auth (callbacks), / (home), /pricing, /about (header links)
  }

  // Actually, let's just refresh session here. Protecting routes can be done here or per-page.
  // Standard supabase middleware creates the client to refresh the session token if needed.
  // We can add simple protection logic here too.

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Check if user has admin grade in profil table
    const { data: profiles } = await supabase
      .from("profil")
      .select("grade")
      .eq("user_id", user.id);

    const isAdmin = profiles?.some((p) => p.grade === "admin");

    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}
