import { personalizeProfile } from "@/lib/actions/onboarding";
import { COUNTRIES } from "@/lib/countries";
import { TimezoneField } from "@/components/onboarding/timezone-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PersonalizePage() {
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="text-center">
        <span className="text-muted-foreground text-xs font-medium">Step 2 of 3</span>
        <CardTitle className="font-heading text-xl font-medium">Personalise Litigo</CardTitle>
        <CardDescription>A few basics so dates, search, and your profile feel right.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={personalizeProfile} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="country_code">Country</Label>
            <Select name="country_code" defaultValue="IN">
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
            <Label htmlFor="professional_title">Professional title</Label>
            <Input
              id="professional_title"
              name="professional_title"
              placeholder="e.g. Advocate, Barrister, Solicitor"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="jurisdiction_name">Primary jurisdiction</Label>
            <Input
              id="jurisdiction_name"
              name="jurisdiction_name"
              placeholder="e.g. Calcutta High Court, West Bengal"
            />
          </div>

          <TimezoneField defaultValue="Asia/Kolkata" />

          <Button type="submit" className="mt-2 w-full">
            Continue
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
