import {
  getFullProfile,
  getPrimaryLicence,
  getUserPracticeAreaIds,
} from "@/lib/data/profile";
import { getPracticeAreas } from "@/lib/data/practice-areas";
import { updateProfile } from "@/lib/actions/profile";
import { COUNTRIES } from "@/lib/countries";
import { PracticeAreaPicker, type Selection } from "@/components/onboarding/practice-area-picker";
import { TimezoneField } from "@/components/onboarding/timezone-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { redirect } from "next/navigation";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;

  const [profile, licence, practiceAreas, userPracticeAreaIds] = await Promise.all([
    getFullProfile(),
    getPrimaryLicence(),
    getPracticeAreas(),
    getUserPracticeAreaIds(),
  ]);
  if (!profile) redirect("/login");

  const selectedAreas: Selection[] = practiceAreas
    .filter((pa) => userPracticeAreaIds.includes(pa.id))
    .map((pa) => ({ id: pa.id, name: pa.name }));

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-lg font-medium">Your profile</h1>
        <p className="text-sm text-muted-foreground">
          Everything onboarding collected, editable in one place.
        </p>
      </div>

      {saved && (
        <p className="rounded-lg border border-verified/30 bg-verified/10 px-3 py-2 text-sm text-verified">
          Profile updated.
        </p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}

      <form action={updateProfile} className="flex flex-col gap-6">
        <section className="flex flex-col gap-4 rounded-lg border p-4">
          <h2 className="font-heading text-xs font-medium tracking-wider text-muted-foreground uppercase">
            About you
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input id="full_name" name="full_name" defaultValue={profile.fullName ?? ""} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="display_name">Display name</Label>
              <Input
                id="display_name"
                name="display_name"
                defaultValue={profile.displayName ?? ""}
                placeholder="How you'd like to be greeted"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="professional_title">Professional title</Label>
            <Input
              id="professional_title"
              name="professional_title"
              defaultValue={profile.professionalTitle ?? ""}
              placeholder="e.g. Advocate, Barrister, Solicitor"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" rows={3} defaultValue={profile.bio ?? ""} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="avatar_url">Avatar URL</Label>
            <Input
              id="avatar_url"
              name="avatar_url"
              type="url"
              defaultValue={profile.avatarUrl ?? ""}
              placeholder="https://…"
            />
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-lg border p-4">
          <h2 className="font-heading text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Jurisdiction &amp; region
          </h2>
          <div className="flex flex-col gap-2">
            <Label htmlFor="country_code">Country</Label>
            <Select name="country_code" defaultValue={profile.countryCode ?? "IN"}>
              <SelectTrigger id="country_code" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="jurisdiction_name">Primary jurisdiction</Label>
            <Input
              id="jurisdiction_name"
              name="jurisdiction_name"
              defaultValue={licence?.jurisdiction_name ?? ""}
              placeholder="e.g. Calcutta High Court, West Bengal"
            />
          </div>
          <TimezoneField defaultValue={profile.timezone} autoDetect={false} />
          <div className="flex flex-col gap-2">
            <Label htmlFor="locale">Locale</Label>
            <Input
              id="locale"
              name="locale"
              defaultValue={profile.locale}
              placeholder="e.g. en-IN"
            />
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-lg border p-4">
          <h2 className="font-heading text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Practice
          </h2>
          <PracticeAreaPicker practiceAreas={practiceAreas} initialSelected={selectedAreas} />
          <div className="flex flex-col gap-2">
            <Label htmlFor="licensing_authority">Licensing authority</Label>
            <Input
              id="licensing_authority"
              name="licensing_authority"
              defaultValue={licence?.licensing_authority ?? ""}
              placeholder="e.g. Bar Council of West Bengal"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="registration_number">Registration number</Label>
              <Input
                id="registration_number"
                name="registration_number"
                defaultValue={licence?.registration_number ?? ""}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="admission_date">Admission date</Label>
              <Input
                id="admission_date"
                name="admission_date"
                type="date"
                defaultValue={licence?.admission_date ?? ""}
              />
            </div>
          </div>
        </section>

        <Button type="submit" className="self-start">
          Save profile
        </Button>
      </form>
    </div>
  );
}
