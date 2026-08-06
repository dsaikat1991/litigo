export type CaseStatus = "ongoing" | "disposed" | "archived";
export type NoteOutcome = "worked" | "failed" | "untested";
export type ResearchSourceType = "statute" | "judgment" | "article" | "other";
export type LicenceVerificationStatus = "unverified" | "pending" | "verified" | "rejected";

export type CaseEventType =
  | "hearing"
  | "filing"
  | "order"
  | "judgment"
  | "adjournment"
  | "evidence"
  | "notice"
  | "compliance"
  | "settlement"
  | "appeal"
  | "execution"
  | "internal_note"
  | "case_disposal";

export type NotificationTiming = "7_day" | "3_day" | "1_day" | "same_day";
export type NotificationChannel = "in_app" | "email";
export type NotificationStatus = "pending" | "sent" | "cancelled";

export type NotificationPreferences = Record<NotificationTiming, Record<NotificationChannel, boolean>>;

export interface Case {
  id: string;
  owner_id: string;
  title: string;
  case_number: string | null;
  court: string | null;
  case_type: string | null;
  parties: string | null;
  status: CaseStatus;
  stage: string | null;
  next_hearing_date: string | null;
  decided_on: string | null;
  decision_nature: string | null;
  decision_outcome: string | null;
  summary: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
  argument_count?: number;
  research_count?: number;
  memory_count?: number;
  document_count?: number;
  order_count?: number;
  latest_memory?: { id: string; content: string; created_at: string } | null;
}

export interface ArgumentNote {
  id: string;
  case_id: string;
  owner_id: string;
  issue: string | null;
  content: string;
  outcome: NoteOutcome | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ResearchNote {
  id: string;
  case_id: string;
  owner_id: string;
  source_type: ResearchSourceType | null;
  citation: string | null;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Memory {
  id: string;
  owner_id: string;
  case_id: string | null;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  case?: { title: string } | null;
}

export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  case_id: string;
  owner_id: string;
  event_id: string | null;
  title: string;
  due_date: string | null;
  priority: TaskPriority;
  assignee: string | null;
  is_done: boolean;
  created_at: string;
  completed_at: string | null;
}

export interface HearingDocument {
  id: string;
  case_id: string;
  event_id: string;
  owner_id: string;
  name: string;
  created_at: string;
}

export interface CaseDocument {
  id: string;
  case_id: string | null;
  owner_id: string;
  storage_path: string;
  file_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
  case?: { id: string; title: string } | null;
}

export interface CaseEvent {
  id: string;
  case_id: string;
  owner_id: string;
  event_type: CaseEventType;
  event_date: string;
  title: string;
  description: string | null;
  stage: string | null;
  hearing_purpose: string | null;
  arguments_made: string | null;
  court_direction: string | null;
  next_hearing_date: string | null;
  next_hearing_purpose: string | null;
  created_at: string;
  updated_at: string;
  tasks?: Task[];
  documents?: HearingDocument[];
  case?: { title: string; court: string | null } | null;
}

export interface NotificationSchedule {
  id: string;
  case_id: string;
  event_id: string;
  owner_id: string;
  hearing_date: string;
  timing: NotificationTiming;
  channel: NotificationChannel;
  remind_at: string;
  status: NotificationStatus;
  read_at: string | null;
  created_at: string;
  sent_at: string | null;
  case?: { title: string; court: string | null } | null;
}

// Upcoming/past hearing rows for the Court Diary — a case joined with the
// most recent case_event (for purpose/stage context) and its open tasks.
export interface HearingDiaryEntry {
  case: Case;
  latestEvent: CaseEvent | null;
  pendingTasks: Task[];
}

export interface ProfessionalLicence {
  id: string;
  user_id: string;
  country_code: string;
  jurisdiction_name: string | null;
  licensing_authority: string | null;
  registration_number: string | null;
  admission_date: string | null;
  is_primary: boolean;
  verification_status: LicenceVerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface PracticeArea {
  id: string;
  name: string;
  created_at: string;
}

export type BlogPostStatus = "draft" | "published";

export interface BlogPost {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  status: BlogPostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author?: { full_name: string | null; avatar_url: string | null } | null;
}

export type SubscriptionPlan = "basic_monthly" | "basic_annual" | "pro_monthly" | "pro_annual";
export type SubscriptionStatus =
  | "created"
  | "pending"
  | "active"
  | "halted"
  | "cancelled"
  | "completed"
  | "expired";

export interface Subscription {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
  razorpaySubscriptionId: string;
}
