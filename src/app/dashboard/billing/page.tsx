import { getCurrentProfile } from "@/lib/data/profile";
import { getCurrentSubscription } from "@/lib/data/subscription";
import { BillingSection } from "@/components/dashboard/billing-section";

export default async function BillingPage() {
  const [profile, subscription] = await Promise.all([getCurrentProfile(), getCurrentSubscription()]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-medium">Billing</h1>
        <p className="text-muted-foreground text-sm">Manage your Litigo plan and subscription.</p>
      </div>

      <section className="flex flex-col gap-4 rounded-lg border p-4">
        <BillingSection
          subscription={subscription}
          fullName={profile?.fullName ?? null}
          email={profile?.email ?? null}
          locale={profile?.locale ?? "en-IN"}
          timeZone={profile?.timezone ?? "Asia/Kolkata"}
        />
      </section>
    </div>
  );
}
