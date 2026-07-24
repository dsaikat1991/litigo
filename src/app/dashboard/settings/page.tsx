import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-heading text-lg font-medium">Settings</h1>
      <p className="text-muted-foreground text-sm">
        Settings are coming soon. In the meantime, your profile, jurisdiction, and practice
        details live on the{" "}
        <Link href="/dashboard/profile" className="text-foreground underline underline-offset-4">
          profile page
        </Link>
        .
      </p>
    </div>
  );
}
