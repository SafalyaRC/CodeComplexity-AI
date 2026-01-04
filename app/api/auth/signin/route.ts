import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const provider = (body.provider as string) || null;
    const returnTo = (body.returnTo as string) || null;
    const email = (body.email as string) || null;
    const password = (body.password as string) || null;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const origin =
      request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "";

    // If email+password provided -> sign in with credentials
    if (email && password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Email sign-in error:", error);
        return NextResponse.json(
          { error: error.message || "Email sign-in failed" },
          { status: 400 }
        );
      }

      // Return session and user info to client
      return NextResponse.json({
        session: data.session || null,
        user: data.user || null,
      });
    }

    // Otherwise if provider specified (e.g., google) use OAuth
    const usedProvider = provider || "google";
    const redirectTo = returnTo
      ? `${origin}${returnTo}`
      : `${origin}/api/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: usedProvider as any,
      options: { redirectTo },
    });

    if (error) {
      console.error("Sign-in error:", error);
      return NextResponse.json(
        { error: error.message || "Sign-in failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: (data as any)?.url || null });
  } catch (err: any) {
    console.error("Signin route error:", err);
    return NextResponse.json(
      { error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
