export type CaseStatus = "ongoing" | "disposed" | "archived";
export type NoteOutcome = "worked" | "failed" | "untested";
export type ResearchSourceType = "statute" | "judgment" | "article" | "other";
export type LicenceVerificationStatus = "unverified" | "pending" | "verified" | "rejected";

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
  argument_count?: number;
  research_count?: number;
  memory_count?: number;
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
