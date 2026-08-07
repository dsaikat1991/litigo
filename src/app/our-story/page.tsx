import Link from "next/link";
import type { Metadata } from "next";
import { ContentPage } from "@/components/marketing/content-page";
import { OUR_STORY_TITLE, OUR_STORY_MARKDOWN } from "@/content/our-story";

export const metadata: Metadata = {
  title: "Our Story — Litigo",
  description: "Why Litigo exists, and why it's built India-first, in the founder's own words.",
};

export default function OurStoryPage() {
  return (
    <ContentPage
      eyebrow="Our Story"
      title={OUR_STORY_TITLE}
      markdown={OUR_STORY_MARKDOWN}
      afterContent={
        <p className="font-manrope text-foreground/90 -mt-4 text-[15px] leading-tight">
          — <span className="font-semibold">Saikat Das</span>
          <br />
          Founder, Litigo
        </p>
      }
      footer={
        <div className="flex items-center gap-3">
          <Link
            href="/signup"
            className="bg-foreground text-background rounded-lg px-4 py-2 text-sm font-medium"
          >
            Start building your memory
          </Link>
          <Link
            href="/"
            className="text-muted-foreground text-sm underline underline-offset-4 hover:text-foreground"
          >
            Back to home
          </Link>
        </div>
      }
    />
  );
}
