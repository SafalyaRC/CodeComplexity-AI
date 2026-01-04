import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to get current user
export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// Helper to sign in with Google
export async function signInWithGoogle() {
  // Force Google OAuth to redirect back to the app root `/` after callback
  const redirectUrl = `${window.location.origin}/api/auth/callback?returnTo=%2F`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.error("Sign in error:", error);
    // Keep alert for now as fallback
    alert(
      "Failed to sign in with Google. Please check if Google OAuth is enabled in Supabase."
    );
  }

  return { data, error };
}

// Helper to sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

// Helper to save analysis
export async function saveAnalysis(analysis: {
  code: string;
  language: string;
  timeComplexity: string;
  spaceComplexity: string;
  explanation: string;
  optimizations?: string;
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("analyses")
    .insert({
      user_id: user.id,
      code: analysis.code,
      language: analysis.language,
      time_complexity: analysis.timeComplexity,
      space_complexity: analysis.spaceComplexity,
      explanation: analysis.explanation,
      optimizations: analysis.optimizations,
    })
    .select()
    .single();

  return { data, error };
}

// Helper to get user's analyses
export async function getUserAnalyses(limit = 20) {
  const user = await getCurrentUser();
  if (!user) return { data: [], error: null };

  const { data, error } = await supabase
    .from("analyses")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  return { data, error };
}
