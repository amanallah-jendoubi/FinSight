import { Pencil, Trash2 } from "lucide-react";
import { Transaction } from "./Transaction";
import { useState } from "react";

export default function TransactionCard({ transaction, categories, accounts, editAccount, onEdit, onDelete }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id, date, description, categorySource, type, amount, accountId } = transaction;
  const isPositive = type === "income";
  const formattedMontant = `${isPositive ? "+" : "-"}${amount.toLocaleString("en-US")}`;

  return (
    <div className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4">
        <span className="text-sm font-semibold text-slate-800">{description}</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            aria-label={`Modifier ${description}`}
            className="text-slate-400 transition-colors hover:text-indigo-500"
          >
            <Pencil className="h-4 w-4" />
          </button>
          {isModalOpen && (
            <Transaction
              editAccount={editAccount}
              oldFields={{ date, description, categorySource, type, amount, accountId }}
              transactionText="Update transaction"
              categories={categories}
              accounts={accounts}
              onClose={() => setIsModalOpen(false)}
              onSubmit={(accountId, data) => {
                onEdit(id, data);
                setIsModalOpen(false);
              }}
            />
          )}
          <button
            type="button"
            onClick={() => onDelete(id, type)}
            aria-label={`Supprimer ${description}`}
            className="text-slate-400 transition-colors hover:text-rose-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Date</span>
        <span className="text-sm text-slate-600">{date}</span>
      </div>
      <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Category/Source</span>
        <span className="text-sm text-slate-600">{categorySource}</span>
      </div>
      <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Type</span>
        <span className="text-sm text-slate-600">{type}</span>
      </div>
      <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Amount</span>
        <span className={`text-sm font-semibold ${isPositive ? "text-emerald-500" : "text-gray-900"}`}>
          {formattedMontant}
        </span>
      </div>
    </div>
  );
}