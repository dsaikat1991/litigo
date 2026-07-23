import Link from "next/link";
import { getPracticeAreas } from "@/lib/data/practice-areas";
import { saveProfessionalDetails } from "@/lib/actions/onboarding";
import { PracticeAreaPicker } from "@/components/onboarding/practice-area-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function ProfessionalDetailsPage() {
  const practiceAreas = await getPracticeAreas();

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="text-center">
        <span className="text-muted-foreground text-xs font-medium">Step 3 of 3</span>
        <CardTitle className="font-heading text-xl font-medium">
          Optional professional details
        </CardTitle>
        <CardDescription>
          Helps your memory feel like yours. Skip this and fill it in later if you&apos;d rather.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={saveProfessionalDetails} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="organisation_name">Organisation</Label>
            <Input
              id="organisation_name"
              name="organisation_name"
              placeholder="e.g. your chamber or firm name"
            />
          </div>

          <PracticeAreaPicker practiceAreas={practiceAreas} />

          <div className="flex flex-col gap-2">
            <Label htmlFor="licensing_authority">Licensing authority</Label>
            <Input
              id="licensing_authority"
              name="licensing_authority"
              placeholder="e.g. Bar Council of West Bengal"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="registration_number">Registration number</Label>
              <Input id="registration_number" name="registration_number" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="admission_date">Admission date</Label>
              <Input id="admission_date" name="admission_date" type="date" />
            </div>
          </div>

          <Button type="submit" className="mt-2 w-full">
            Save and finish
          </Button>
          <Link
            href="/dashboard"
            className="text-muted-foreground text-center text-sm underline underline-offset-4"
          >
            Skip for now
          </Link>
        </form>
      </CardContent>
    </Card>
  );
}
