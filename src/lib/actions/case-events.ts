"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { addDaysToKey, dateKeyInTimeZone } from "@/lib/utils";
import type { CaseEventType, NotificationChannel, NotificationTiming } from "@/lib/types";

const EVENT_TYPES: CaseEventType[] = [
  "hearing",
  "filing",
  "order",
  "judgment",
  "adjournment",
  "evidence",
  "notice",
  "compliance",
  "settlement",
  "appeal",
  "execution",
  "internal_note",
  "case_disposal",
];

function parseLines(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

// Offsets are negative days-from-hearing, so addDaysToKey(hearingDate, offset)
// lands on the reminder's own fire date (e.g. -7 days before the hearing).
const REMINDER_OFFSETS: { timing: NotificationTiming; days: number }[] = [
  { timing: "7_day", days: -7 },
  { timing: "3_day", days: -3 },
  { timing: "1_day", days: -1 },
  { timing: "same_day", days: 0 },
];
const NOTIFICATION_CHANNELS: NotificationChannel[] = ["in_app", "email"];

export async function recordHearing(formData: FormData) {
  const caseId = String(formData.get("case_id") ?? "");
  const eventType = String(formData.get("event_type") ?? "");
  const eventDate = String(formData.get("event_date") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  if (!caseId || !EVENT_TYPES.includes(eventType as CaseEventType) || !eventDate || !title) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const stage = String(formData.get("stage") ?? "").trim() || null;
  const nextHearingDate = String(formData.get("next_hearing_date") ?? "").trim() || null;
  const nextHearingPurpose = String(formData.get("next_hearing_purpose") ?? "").trim() || null;

  const { data: event, error: eventError } = await supabase
    .from("case_events")
    .insert({
      case_id: caseId,
      owner_id: user.id,
      event_type: eventType,
      event_date: eventDate,
      title,
      description: String(formData.get("description") ?? "").trim() || null,
      stage,
      hearing_purpose: String(formData.get("hearing_purpose") ?? "").trim() || null,
      arguments_made: String(formData.get("arguments_made") ?? "").trim() || null,
      court_direction: String(formData.get("court_direction") ?? "").trim() || null,
      next_hearing_date: nextHearingDate,
      next_hearing_purpose: nextHearingPurpose,
    })
    .select("id")
    .single();
  if (eventError || !event) {
    redirect(
      `/dashboard/cases/${caseId}?error=${encodeURIComponent(eventError?.message ?? "Could not record hearing")}`,
    );
  }

  const tasks = parseLines(String(formData.get("tasks") ?? ""));
  const documents = parseLines(String(formData.get("documents") ?? ""));

  await Promise.all([
    tasks.length > 0
      ? supabase.from("hearing_tasks").insert(
          tasks.map((description) => ({
            case_id: caseId,
            event_id: event.id,
            owner_id: user.id,
            description,
          })),
        )
      : Promise.resolve(),
    documents.length > 0
      ? supabase.from("hearing_documents").insert(
          documents.map((name) => ({
            case_id: caseId,
            event_id: event.id,
            owner_id: user.id,
            name,
          })),
        )
      : Promise.resolve(),
    // The case's own next_hearing_date/stage are a denormalized "current
    // state" convenience for cards/lists — case_events is the permanent
    // record, this is just kept in sync with the latest one.
    supabase
      .from("cases")
      .update({
        next_hearing_date: nextHearingDate,
        ...(stage ? { stage } : {}),
      })
      .eq("id", caseId),
  ]);

  await scheduleHearingReminders({
    supabase,
    caseId,
    eventId: event.id,
    ownerId: user.id,
    nextHearingDate,
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/diary");
  revalidatePath(`/dashboard/cases/${caseId}`);
}

// Cancels every pending reminder for the case (regardless of which earlier
// event scheduled it) before generating fresh ones — this is what makes a
// reschedule safe: the old event stays in the timeline untouched, only its
// now-stale reminders get cancelled, and the new date gets its own set.
async function scheduleHearingReminders({
  supabase,
  caseId,
  eventId,
  ownerId,
  nextHearingDate,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  caseId: string;
  eventId: string;
  ownerId: string;
  nextHearingDate: string | null;
}) {
  await supabase
    .from("notification_schedules")
    .update({ status: "cancelled" })
    .eq("case_id", caseId)
    .eq("status", "pending");

  if (!nextHearingDate) return;

  // India-first app; reminders are date-only (no time-of-day component), so
  // Asia/Kolkata is a reasonable fixed default here rather than threading a
  // per-user timezone through a server action just for this comparison.
  const todayKey = dateKeyInTimeZone(new Date(), "Asia/Kolkata");

  const rows = REMINDER_OFFSETS.flatMap(({ timing, days }) => {
    const remindAt = addDaysToKey(nextHearingDate, days);
    if (remindAt < todayKey) return [];
    return NOTIFICATION_CHANNELS.map((channel) => ({
      case_id: caseId,
      event_id: eventId,
      owner_id: ownerId,
      hearing_date: nextHearingDate,
      timing,
      channel,
      remind_at: remindAt,
    }));
  });

  if (rows.length > 0) {
    await supabase.from("notification_schedules").insert(rows);
  }
}

export async function toggleHearingTask(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const caseId = String(formData.get("case_id") ?? "");
  const isDone = String(formData.get("is_done") ?? "") === "true";
  if (!id || !caseId) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("hearing_tasks")
    .update({ is_done: isDone, completed_at: isDone ? new Date().toISOString() : null })
    .eq("id", id);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/diary");
  revalidatePath(`/dashboard/cases/${caseId}`);
}

export async function markNotificationRead(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("notification_schedules").update({ read_at: new Date().toISOString() }).eq("id", id);

  revalidatePath("/dashboard");
}

export async function markAllNotificationsRead() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("notification_schedules")
    .update({ read_at: new Date().toISOString() })
    .eq("owner_id", user.id)
    .eq("channel", "in_app")
    .is("read_at", null);

  revalidatePath("/dashboard");
}
