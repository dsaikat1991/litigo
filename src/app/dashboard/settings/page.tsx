import Link from "next/link";
import { getCurrentProfile, getNotificationPreferences } from "@/lib/data/profile";
import { updateNotificationPreferences } from "@/lib/actions/settings";
import { Button } from "@/components/ui/button";
import { NotificationPreferencesGrid } from "@/components/dashboard/notification-preferences-grid";
import { AccountSection } from "@/components/dashboard/account-section";
import { DeleteAccountButton } from "@/components/dashboard/delete-account-button";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    saved?: string;
    error?: string;
    emailPending?: string;
    passwordChanged?: string;
  }>;
}) {
  const { saved, error, emailPending, passwordChanged } = await searchParams;
  const [prefs, profile] = await Promise.all([getNotificationPreferences(), getCurrentProfile()]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-medium">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Your profile, jurisdiction, and practice details live on the{" "}
          <Link href="/dashboard/profile" className="text-foreground underline underline-offset-4">
            profile page
          </Link>
          .
        </p>
      </div>

      {saved && (
        <p className="border-verified/30 bg-verified/10 text-verified rounded-lg border px-3 py-2 text-sm">
          Settings saved.
        </p>
      )}
      {emailPending && (
        <p className="border-verified/30 bg-verified/10 text-verified rounded-lg border px-3 py-2 text-sm">
          Check your inbox — confirm the change from links sent to both your old and new email
          address.
        </p>
      )}
      {passwordChanged && (
        <p className="border-verified/30 bg-verified/10 text-verified rounded-lg border px-3 py-2 text-sm">
          Password updated.
        </p>
      )}
      {error && <p className="text-destructive text-sm">{error}</p>}

      <form action={updateNotificationPreferences}>
        <section className="flex flex-col gap-4 rounded-lg border p-4">
          <NotificationPreferencesGrid prefs={prefs} />
          <div className="flex justify-end border-t pt-4">
            <Button type="submit">Save changes</Button>
          </div>
        </section>
      </form>

      <AccountSection email={profile?.email ?? ""} />

      <section className="border-destructive/30 flex flex-col gap-4 rounded-lg border p-4">
        <div>
          <h2 className="text-destructive text-xs font-medium tracking-wider uppercase">
            Danger zone
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Permanently delete your account and everything in it. This can&apos;t be undone.
          </p>
        </div>
        <DeleteAccountButton email={profile?.email ?? ""} />
      </section>
    </div>
  );
}
