import { createClient } from "@/lib/supabase/server";
import { addDaysToKey, dateKeyInTimeZone, monthEndKey } from "@/lib/utils";
import type {
  Case,
  CaseEvent,
  HearingDiaryEntry,
  HearingDocument,
  HearingTask,
  NotificationSchedule,
} from "@/lib/types";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

function groupBy<T>(rows: T[], keyOf: (row: T) => string): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const row of rows) {
    const k = keyOf(row);
    const list = map.get(k) ?? [];
    list.push(row);
    map.set(k, list);
  }
  return map;
}

// Full history for a case's Timeline tab — every event, oldest work first
// undone, newest event on top, each with its own tasks/documents attached.
export async function getCaseEvents(caseId: string): Promise<CaseEvent[]> {
  const supabase = await createClient();
  const { data: events, error } = await supabase
    .from("case_events")
    .select("*")
    .eq("case_id", caseId)
    .order("event_date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  if (!events || events.length === 0) return [];

  const eventIds = events.map((e) => e.id);
  const [tasksRes, docsRes] = await Promise.all([
    supabase
      .from("hearing_tasks")
      .select("*")
      .in("event_id", eventIds)
      .order("created_at", { ascending: true }),
    supabase
      .from("hearing_documents")
      .select("*")
      .in("event_id", eventIds)
      .order("created_at", { ascending: true }),
  ]);
  if (tasksRes.error) throw tasksRes.error;
  if (docsRes.error) throw docsRes.error;

  const tasksByEvent = groupBy<HearingTask>(tasksRes.data ?? [], (t) => t.event_id);
  const docsByEvent = groupBy<HearingDocument>(docsRes.data ?? [], (d) => d.event_id);

  return events.map((event) => ({
    ...event,
    tasks: tasksByEvent.get(event.id) ?? [],
    documents: docsByEvent.get(event.id) ?? [],
  }));
}

async function attachDiaryContext(supabase: SupabaseClient, cases: Case[]): Promise<HearingDiaryEntry[]> {
  if (cases.length === 0) return [];
  const caseIds = cases.map((c) => c.id);

  const { data: events, error: eventsError } = await supabase
    .from("case_events")
    .select("*")
    .in("case_id", caseIds)
    .order("event_date", { ascending: false })
    .order("created_at", { ascending: false });
  if (eventsError) throw eventsError;

  const latestEventByCase = new Map<string, CaseEvent>();
  for (const event of events ?? []) {
    if (!latestEventByCase.has(event.case_id)) latestEventByCase.set(event.case_id, event);
  }

  const latestEventIds = [...latestEventByCase.values()].map((e) => e.id);
  const { data: tasks, error: tasksError } =
    latestEventIds.length > 0
      ? await supabase.from("hearing_tasks").select("*").in("event_id", latestEventIds).eq("is_done", false)
      : { data: [] as HearingTask[], error: null };
  if (tasksError) throw tasksError;

  const tasksByEvent = groupBy<HearingTask>(tasks ?? [], (t) => t.event_id);

  return cases.map((c) => {
    const latestEvent = latestEventByCase.get(c.id) ?? null;
    return {
      case: c,
      latestEvent,
      pendingTasks: latestEvent ? (tasksByEvent.get(latestEvent.id) ?? []) : [],
    };
  });
}

export type DiaryScope = "today" | "week" | "month";

// One row per case with an upcoming hearing inside the window, each carrying
// its most recent recorded event (for purpose/stage context) and whatever
// prep tasks are still open from that event. Windows deliberately overlap
// (Today's hearing also shows under Week and Month) rather than being
// mutually exclusive slices — that matches how an advocate actually scans a
// diary: "what's on today" and "what's coming this week" are both real
// questions, not complementary partitions.
export async function getUpcomingHearings(scope: DiaryScope, timeZone: string): Promise<HearingDiaryEntry[]> {
  const supabase = await createClient();
  const todayKey = dateKeyInTimeZone(new Date(), timeZone);
  const toKey = scope === "today" ? todayKey : scope === "week" ? addDaysToKey(todayKey, 7) : monthEndKey(todayKey);

  const { data: cases, error } = await supabase
    .from("cases")
    .select("*")
    .gte("next_hearing_date", todayKey)
    .lte("next_hearing_date", toKey)
    .order("next_hearing_date", { ascending: true });
  if (error) throw error;

  return attachDiaryContext(supabase, cases ?? []);
}

// Reverse-chronological feed of everything already recorded — every event
// type, not just "hearing", since a past Order or Judgment is just as much
// part of the diary's history as a past hearing.
export async function getPastCaseEvents(timeZone: string, limit = 50): Promise<CaseEvent[]> {
  const supabase = await createClient();
  const todayKey = dateKeyInTimeZone(new Date(), timeZone);
  const { data, error } = await supabase
    .from("case_events")
    .select("*, case:cases(title, court)")
    .lt("event_date", todayKey)
    .order("event_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit)
    .returns<CaseEvent[]>();
  if (error) throw error;
  return data ?? [];
}

// The in-app notification bell reads this live — remind_at <= today and
// unread — rather than requiring a cron to "fire" in-app rows into a sent
// state first. Only the email channel needs a proactive scheduled push.
export async function getDueInAppNotifications(timeZone: string, limit = 20): Promise<NotificationSchedule[]> {
  const supabase = await createClient();
  const todayKey = dateKeyInTimeZone(new Date(), timeZone);
  const { data, error } = await supabase
    .from("notification_schedules")
    .select("*, case:cases(title, court)")
    .eq("channel", "in_app")
    .is("read_at", null)
    .neq("status", "cancelled")
    .lte("remind_at", todayKey)
    .order("remind_at", { ascending: false })
    .limit(limit)
    .returns<NotificationSchedule[]>();
  if (error) throw error;
  return data ?? [];
}
