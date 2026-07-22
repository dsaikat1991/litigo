import { createResearchNote } from "@/lib/actions/notes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AddResearchNoteForm({ caseId }: { caseId: string }) {
  return (
    <form action={createResearchNote} className="flex flex-col gap-3 rounded-lg border p-4">
      <input type="hidden" name="case_id" value={caseId} />
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="source_type">Source type</Label>
          <Select name="source_type">
            <SelectTrigger id="source_type">
              <SelectValue placeholder="Other" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="statute">Statute</SelectItem>
              <SelectItem value="judgment">Judgment</SelectItem>
              <SelectItem value="article">Article</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="citation">Citation</Label>
          <Input id="citation" name="citation" placeholder="e.g. Section 144, CrPC" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="content">Notes</Label>
        <Textarea id="content" name="content" rows={3} required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="tags">Tags</Label>
        <Input id="tags" name="tags" placeholder="comma-separated" />
      </div>
      <Button type="submit" size="sm" className="self-start">
        Add research note
      </Button>
    </form>
  );
}
