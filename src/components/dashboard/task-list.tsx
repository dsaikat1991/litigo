import { ListChecks } from "lucide-react";
import type { Task } from "@/lib/types";
import { dateKeyInTimeZone } from "@/lib/utils";
import { EmptyStatePanel } from "@/components/dashboard/empty-state-panel";
import { TaskRow } from "@/components/dashboard/task-row";

function Group({
  label,
  tasks,
  overdue,
  locale,
  timeZone,
  hearingOptions,
}: {
  label: string;
  tasks: Task[];
  overdue: boolean;
  locale: string;
  timeZone: string;
  hearingOptions: { id: string; label: string }[];
}) {
  if (tasks.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">{label}</p>
      <ul className="flex flex-col gap-3">
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            overdue={overdue}
            locale={locale}
            timeZone={timeZone}
            hearingOptions={hearingOptions}
          />
        ))}
      </ul>
    </div>
  );
}

export function TaskList({
  tasks,
  locale,
  timeZone,
  hearingOptions,
}: {
  tasks: Task[];
  locale: string;
  timeZone: string;
  hearingOptions: { id: string; label: string }[];
}) {
  if (tasks.length === 0) {
    return (
      <EmptyStatePanel
        icon={ListChecks}
        title="No tasks yet"
        description="Track what needs doing on this case — hearing prep, filings, follow-ups."
        action={<p className="text-muted-foreground text-xs">Use the form above to add one.</p>}
      />
    );
  }

  const todayKey = dateKeyInTimeZone(new Date(), timeZone);
  // No-due-date tasks aren't overdue by definition, so they fall into
  // Upcoming rather than a fourth bucket.
  const overdue = tasks.filter((t) => !t.is_done && t.due_date && t.due_date < todayKey);
  const upcoming = tasks.filter((t) => !t.is_done && !(t.due_date && t.due_date < todayKey));
  const completed = tasks.filter((t) => t.is_done);

  return (
    <div className="flex flex-col gap-5">
      <Group label="Overdue" tasks={overdue} overdue locale={locale} timeZone={timeZone} hearingOptions={hearingOptions} />
      <Group label="Upcoming" tasks={upcoming} overdue={false} locale={locale} timeZone={timeZone} hearingOptions={hearingOptions} />
      <Group label="Completed" tasks={completed} overdue={false} locale={locale} timeZone={timeZone} hearingOptions={hearingOptions} />
    </div>
  );
}
