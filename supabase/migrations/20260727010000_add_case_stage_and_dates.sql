-- Stage and hearing/decision dates for the case-card redesign. All free text /
-- nullable like case_type — litigation stage vocabulary and hearing cadence
-- vary too much across courts and matter types to force onto a fixed enum.
-- next_hearing_date and decided_on are separate columns (not one reused field)
-- because a disposed matter can still have a pending hearing (e.g. execution
-- proceedings) while also having a decision date on record.

alter table public.cases
  add column stage text,
  add column next_hearing_date date,
  add column decided_on date;
