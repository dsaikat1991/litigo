export type CaseStatus = "ongoing" | "disposed" | "archived";
export type NoteOutcome = "worked" | "failed" | "untested";
export type ResearchSourceType = "statute" | "judgment" | "article" | "other";

export interface Case {
  id: string;
  owner_id: string;
  title: string;
  case_number: string | null;
  court: string | null;
  case_type: string | null;
  parties: string | null;
  status: CaseStatus;
  summary: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
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
