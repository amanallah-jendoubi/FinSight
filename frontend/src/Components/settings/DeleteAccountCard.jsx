import { AlertTriangle, Trash2 } from "lucide-react";

const warnings = [
  "All your data will be permanently deleted",
  "Your budgets, transactions, and reports will be lost",
  "This action cannot be undone",
];

export default function DeleteAccountCard({ onDelete }) {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-red-100 bg-red-50/40 p-6 sm:flex-row sm:items-center">
      <div className="flex gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500">
          <Trash2 size={16} />
        </div>
        <div>
          <p className="text-sm font-semibold text-red-600">
            Delete my account
          </p>
          <p className="mt-0.5 text-sm text-gray-600">
            Deleting your account is permanent and irreversible.
          </p>
          <ul className="mt-2 space-y-1">
            {warnings.map((warning) => (
              <li
                key={warning}
                className="flex items-center gap-1.5 text-xs text-gray-500"
              >
                <AlertTriangle size={12} className="text-red-400" />
                {warning}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        type="button"
        onClick={onDelete}
        className="flex shrink-0 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        <Trash2 size={14} />
        Delete my account
      </button>
    </div>
  );
}
