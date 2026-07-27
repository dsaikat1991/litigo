import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { NotificationTiming } from "@/lib/types";

const SITE_URL = "https://mylitigo.com";
const FROM_ADDRESS = "Litigo <hello@mylitigo.com>";

interface DueEmailRow {
  id: string;
  case_id: string;
  hearing_date: string;
  timing: NotificationTiming;
  owner_id: string;
  case: { title: string; court: string | null } | { title: string; court: string | null }[] | null;
}

// Content deliberately differs by how far out the hearing is — a 7-day
// reminder is a heads-up to start preparing, a same-day one is an action
// prompt, not just a heads-up.
function buildEmail(timing: NotificationTiming, caseTitle: string, court: string | null, caseId: string) {
  const courtLine = court ? ` at ${court}` : "";
  const caseLink = `${SITE_URL}/dashboard/cases/${caseId}`;

  switch (timing) {
    case "7_day":
      return {
        subject: `Hearing in 7 days — ${caseTitle}`,
        body: `${caseTitle}${courtLine} has a hearing in 7 days. Good time to begin preparation.\n\n${caseLink}`,
      };
    case "3_day":
      return {
        subject: `Hearing in 3 days — ${caseTitle}`,
        body: `${caseTitle}${courtLine} has a hearing in 3 days. Check that tasks and documents are in order.\n\n${caseLink}`,
      };
    case "1_day":
      return {
        subject: `Hearing tomorrow — ${caseTitle}`,
        body: `${caseTitle}${courtLine} has a hearing tomorrow. Final readiness check.\n\n${caseLink}`,
      };
    case "same_day":
      return {
        subject: `Hearing today — ${caseTitle}`,
        body: `${caseTitle}${courtLine} has a hearing today.\n\nRecord the outcome after: ${caseLink}`,
      };
  }
}

async function sendEmail(to: string, subject: string, body: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Notification schedule + content are fully wired; only actual delivery
    // is pending an API key. Logging (not throwing) keeps the cron run
    // marking rows as processed so nothing double-sends once the key lands.
    console.log(`[email stub] would send to ${to}: ${subject}`);
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to,
      subject,
      text: body,
    }),
  });
  if (!res.ok) {
    throw new Error(`Resend send failed (${res.status}): ${await res.text()}`);
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const todayKey = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

  const { data: due, error } = await supabase
    .from("notification_schedules")
    .select("id, case_id, hearing_date, timing, owner_id, case:cases(title, court)")
    .eq("channel", "email")
    .eq("status", "pending")
    .lte("remind_at", todayKey)
    .returns<DueEmailRow[]>();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!due || due.length === 0) {
    return NextResponse.json({ processed: 0 });
  }

  const emailCache = new Map<string, string | null>();
  async function emailFor(ownerId: string): Promise<string | null> {
    if (emailCache.has(ownerId)) return emailCache.get(ownerId)!;
    const { data } = await supabase.auth.admin.getUserById(ownerId);
    const email = data.user?.email ?? null;
    emailCache.set(ownerId, email);
    return email;
  }

  const processedIds: string[] = [];
  for (const row of due) {
    const caseInfo = Array.isArray(row.case) ? row.case[0] : row.case;
    if (!caseInfo) continue;

    const recipient = await emailFor(row.owner_id);
    if (!recipient) continue;

    const { subject, body } = buildEmail(row.timing, caseInfo.title, caseInfo.court, row.case_id);
    try {
      await sendEmail(recipient, subject, body);
      processedIds.push(row.id);
    } catch (err) {
      console.error(`Failed to send reminder ${row.id}:`, err);
    }
  }

  if (processedIds.length > 0) {
    await supabase
      .from("notification_schedules")
      .update({ status: "sent", sent_at: new Date().toISOString() })
      .in("id", processedIds);
  }

  return NextResponse.json({ processed: processedIds.length, found: due.length });
}
