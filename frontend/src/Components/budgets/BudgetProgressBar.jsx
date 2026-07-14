function getBarColor(percentage) {
  if (percentage <= 50) return "bg-emerald-500";
  if (percentage >= 80) return "bg-red-500";
  return "bg-amber-500";
}

export default function BudgetProgressBar({ percentage }) {
  const clampedWidth = Math.min(percentage, 100);
  const barColor = getBarColor(percentage);

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-2 w-full rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${clampedWidth}%` }}
        />
      </div>
      <span className="w-10 shrink-0 text-right text-xs font-medium tabular-nums text-gray-500">
        {percentage}%
      </span>
    </div>
  );
}