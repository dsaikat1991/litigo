import { createArgumentNote } from "@/lib/actions/notes";
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

export function AddArgumentNoteForm({ caseId }: { caseId: string }) {
  return (
    <form action={createArgumentNote} className="flex flex-col gap-3 rounded-lg border p-4">
      <input type="hidden" name="case_id" value={caseId} />
      <div className="flex flex-col gap-2">
        <Label htmlFor="issue">Issue</Label>
        <Input id="issue" name="issue" placeholder="e.g. Limitation under Article 54" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="content">Argument</Label>
        <Textarea id="content" name="content" rows={3} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="outcome">Outcome</Label>
          <Select name="outcome">
            <SelectTrigger id="outcome">
              <SelectValue placeholder="Untested" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="worked">Worked</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="untested">Untested</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="tags">Tags</Label>
          <Input id="tags" name="tags" placeholder="comma-separated" />
        </div>
      </div>
      <Button type="submit" size="sm" className="self-start">
        Add argument
      </Button>
    </form>
  );
}
