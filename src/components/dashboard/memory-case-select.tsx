import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Radix Select items can't carry an empty-string value, so "no case" is
// submitted as the sentinel "none" — lib/actions/memories.ts translates it
// back to a real null before it touches the database.
export function MemoryCaseSelect({
  id,
  cases,
  defaultValue,
}: {
  id: string;
  cases: { id: string; title: string }[];
  defaultValue?: string | null;
}) {
  return (
    <Select name="case_id" defaultValue={defaultValue ?? "none"}>
      <SelectTrigger id={id} className="w-full">
        <SelectValue placeholder="No case" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">No case</SelectItem>
        {cases.map((c) => (
          <SelectItem key={c.id} value={c.id}>
            {c.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
