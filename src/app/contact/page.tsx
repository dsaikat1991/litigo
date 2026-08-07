import Link from "next/link";
import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContactMessage } from "@/lib/actions/contact";

export const metadata: Metadata = {
  title: "Contact — Litigo",
  description: "Get in touch with the Litigo team.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const { sent, error } = await searchParams;

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
          <Link href="/">
            <Logo />
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-4 py-16 sm:px-8">
        <div className="flex flex-col gap-3">
          <span className="text-muted-foreground text-[11px] font-medium tracking-[0.14em] uppercase">
            Contact
          </span>
          <h1 className="max-w-[20ch] text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Get in touch.
          </h1>
          <p className="font-manrope text-muted-foreground max-w-xl text-lg leading-relaxed text-balance">
            Questions, feedback, or just want to say hello — we&apos;d like to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-3">
              <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg">
                <MapPin className="size-4.5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-medium">Address</p>
                <p className="font-manrope text-muted-foreground text-sm leading-relaxed">
                  34 Garia Park, Kolkata – 700 084
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg">
                <Phone className="size-4.5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-medium">Phone</p>
                <a
                  href="tel:+917278605084"
                  className="font-manrope text-muted-foreground hover:text-foreground text-sm"
                >
                  +91 72786 05084
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg">
                <Mail className="size-4.5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-medium">Email</p>
                <a
                  href="mailto:contact@mylitigo.com"
                  className="font-manrope text-muted-foreground hover:text-foreground text-sm"
                >
                  contact@mylitigo.com
                </a>
              </div>
            </div>
          </div>

          <form action={submitContactMessage} className="flex flex-col gap-4 rounded-2xl border p-6">
            {sent && (
              <p className="border-verified/30 bg-verified/10 text-verified rounded-lg border px-3 py-2 text-sm">
                Thanks — we&apos;ve received your message and will get back to you soon.
              </p>
            )}
            {error && <p className="text-destructive text-sm">{error}</p>}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" rows={5} required />
            </div>
            <Button type="submit" className="self-start">
              Send message
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
