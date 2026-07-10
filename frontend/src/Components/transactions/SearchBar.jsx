import { Search } from "lucide-react";

/**
 * SearchBar
 * Free-text search input (by description) plus a reset-filters button.
 *
 * Props:
 * - value: string
 * - onChange: (value) => void
 * - onReset: () => void
 */
export default function SearchBar({ value = "", onChange = () => {}, onReset = () => {} }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by description..."
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <button
        type="button"
        onClick={onReset}
        className="whitespace-nowrap rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
      >
        Reset
      </button>
    </div>
  );
}