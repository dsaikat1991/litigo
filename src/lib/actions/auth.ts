"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function getOrigin(): Promise<string> {
  const headersList = await headers();
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const host = headersList.get("host");
  return `${protocol}://${host}`;
}

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "");

  const supabase = await createClient();
  const origin = await getOrigin();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      // Without this, Supabase falls back to the project's bare Site URL
      // for the confirmation link — landing the user on the homepage,
      // signed out, instead of /auth/callback where the session actually
      // gets created. Must also be in Supabase's Redirect URLs allow-list.
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  // With "Confirm email" on, signUp creates the user but returns no session
  // until they click the link — send them to check their inbox instead of
  // straight into onboarding, which needs an active session to load.
  if (!data.session) {
    redirect(`/signup/confirm?email=${encodeURIComponent(email)}`);
  }

  redirect("/onboarding/personalize");
}

export async function resendConfirmationEmail(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return;

  const supabase = await createClient();
  const origin = await getOrigin();
  await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });

  redirect(`/signup/confirm?email=${encodeURIComponent(email)}&resent=1`);
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Supabase's own message here ("Email not confirmed") is accurate but
    // easy to miss as plain red text and gives no way to act on it — route
    // this specific case to the same "check your inbox" page signup uses,
    // resend button included, instead of a generic error banner.
    if (error.message.toLowerCase().includes("email not confirmed")) {
      redirect(`/signup/confirm?email=${encodeURIComponent(email)}&unconfirmed=1`);
    }
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}

export async function signOut() {
  // No redirect() here — this is invoked directly from a DropdownMenuItem's
  // onSelect (not a <form>), and a server action's redirect() wasn't
  // reliably reaching the client through that call path (session cleared
  // correctly, but the page would just sit on /dashboard until a manual
  // refresh). The caller drives navigation explicitly once this resolves.
  const supabase = await createClient();
  await supabase.auth.signOut();
}

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return;

  const supabase = await createClient();
  const origin = await getOrigin();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  // Always redirect to the same confirmation, whether or not the email
  // exists — don't let this endpoint be used to enumerate accounts.
  redirect("/forgot-password?sent=1");
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (password.length < 6) {
    redirect(`/reset-password?error=${encodeURIComponent("Password must be at least 6 characters")}`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/login?error=${encodeURIComponent("Reset link expired — request a new one")}`);
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    redirect(`/reset-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}

// One combined Save covering both fields — only acts on whichever actually
// changed (email left as-is submits unchanged; password left blank means
// "don't change it"), then redirects with whichever banner(s) apply. Email
// and password are still two independent Supabase Auth calls under the
// hood (different consequences — email needs confirmation via link sent to
// both addresses, password takes effect immediately), just triggered by one
// button instead of two.
export async function updateAccountDetails(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const newEmail = String(formData.get("email") ?? "").trim();
  const newPassword = String(formData.get("password") ?? "");
  const emailChanged = !!newEmail && newEmail.toLowerCase() !== (user.email ?? "").toLowerCase();
  const passwordChanged = newPassword.length > 0;

  if (passwordChanged && newPassword.length < 6) {
    redirect(`/dashboard/settings?error=${encodeURIComponent("Password must be at least 6 characters")}`);
  }

  if (emailChanged) {
    const origin = await getOrigin();
    const { error } = await supabase.auth.updateUser(
      { email: newEmail },
      { emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent("/dashboard/settings?emailChanged=1")}` },
    );
    if (error) {
      redirect(`/dashboard/settings?error=${encodeURIComponent(error.message)}`);
    }
  }

  if (passwordChanged) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      redirect(`/dashboard/settings?error=${encodeURIComponent(error.message)}`);
    }
  }

  const params = new URLSearchParams();
  if (emailChanged) params.set("emailPending", "1");
  if (passwordChanged) params.set("passwordChanged", "1");
  redirect(`/dashboard/settings?${params.toString()}`);
}

export async function deleteAccount() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // The id that gets deleted comes only from this verified session — never
  // from anything client-supplied — so this can only ever delete the
  // caller's own account, despite needing the admin client to do it at all
  // (there's no non-admin "delete yourself" API).
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    redirect(`/dashboard/settings?error=${encodeURIComponent(error.message)}`);
  }

  // Best-effort — the user row is already gone at this point, this just
  // clears the now-dangling session cookie.
  await supabase.auth.signOut();
  redirect("/login?deleted=1");
}
