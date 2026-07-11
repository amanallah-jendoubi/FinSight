import { Pencil, Trash2 } from "lucide-react";
import {Transaction} from "./Transaction";
import { useState } from "react";


export default function TransactionRow({ transaction, categories, accounts, onEdit, onDelete}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id, date, description, categorySource, type, amount, accountId } = transaction;
  const isPositive = (type  === 'income');
  const formattedMontant = `${isPositive ? "+" : "-"}${amount.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  return (
    <tr className="border-t border-slate-100 hover:bg-slate-50/60">
      <td className="px-6 py-4 text-sm text-slate-600">{date}</td>
      <td className="px-6 py-4 text-sm font-medium text-slate-800">{description}</td>
      <td className="px-6 py-4 text-sm text-slate-600">{categorySource}</td>
      <td className="px-6 py-4 text-sm text-slate-600">{type}</td>
      <td
        className={`px-6 py-4 text-right text-sm font-semibold ${
          isPositive ? "text-emerald-500" : "text-gray-900"
        }`}
      >
        {formattedMontant}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={()=>setIsModalOpen (true)}
            aria-label={`Modifier ${description}`}
            className="text-slate-400 transition-colors hover:text-indigo-500"
          >
            <Pencil className="h-4 w-4" />
          </button>
          {isModalOpen && (
            <Transaction
              oldFields = {{date, description, categorySource, type, amount, accountId }}
              transactionText = "Update transaction"
              categories={categories}
              accounts = {accounts}
                onClose={() => setIsModalOpen(false)}
                onSubmit= {(_,data) =>{
                   onEdit(id, data);
                   setIsModalOpen(true);
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
      </td>
    </tr>
  );
}