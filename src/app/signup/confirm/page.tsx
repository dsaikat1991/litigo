import Link from "next/link";
import { resendConfirmationEmail } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function ConfirmSignupPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; resent?: string; unconfirmed?: string }>;
}) {
  const { email, resent, unconfirmed } = await searchParams;

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-sm border-none shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="font-heading text-xl font-medium">
            {unconfirmed ? "Confirm your email to sign in" : "Check your email"}
          </CardTitle>
          <CardDescription>
            {resent
              ? "Sent again — "
              : unconfirmed
                ? "Your account isn't confirmed yet. We've sent a confirmation link to "
                : "We've sent a confirmation link to "}
            {email && <span className="text-foreground font-medium">{email}</span>}
            {". Click it to activate your account. If it's not in your inbox in a couple of minutes, check spam."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {email && (
            <form action={resendConfirmationEmail}>
              <input type="hidden" name="email" value={email} />
              <Button type="submit" variant="outline" size="sm">
                Resend confirmation email
              </Button>
            </form>
          )}
          <p className="text-center text-sm text-muted-foreground">
            <Link href="/login" className="text-foreground underline underline-offset-4">
              Back to sign in
            </Link>
            {" · "}
            <Link href="/signup" className="text-foreground underline underline-offset-4">
              Sign up again
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
