function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-lg font-semibold tracking-tight">{value}</span>
      <span className="text-muted-foreground text-xs">{label}</span>
    </div>
  );
}

export function PracticeStats({
  caseCount,
  argumentCount,
  researchCount,
  memoryCount,
  orderCount,
}: {
  caseCount: number;
  argumentCount: number;
  researchCount: number;
  memoryCount: number;
  orderCount: number;
}) {
  return (
    <div className="rounded-xl border p-4">
      <h3 className="text-sm font-medium">Your Practice</h3>
      <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-5">
        <Stat label={caseCount === 1 ? "Case" : "Cases"} value={caseCount} />
        <Stat label={argumentCount === 1 ? "Argument" : "Arguments"} value={argumentCount} />
        <Stat label={researchCount === 1 ? "Research Note" : "Research Notes"} value={researchCount} />
        <Stat label={memoryCount === 1 ? "Memory" : "Memories"} value={memoryCount} />
        <Stat label={orderCount === 1 ? "Order" : "Orders"} value={orderCount} />
      </div>
    </div>
  );
}
