import type { LucideIcon } from "lucide-react";

export function EmptyStatePanel({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-10 text-center">
      <div className="flex size-10 items-center justify-center rounded-full bg-muted">
        <Icon className="size-5 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1 px-6">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-muted-foreground max-w-[30ch] text-sm">{description}</p>
      </div>
      {action}
    </div>
  );
}
