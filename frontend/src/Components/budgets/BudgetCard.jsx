import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import BudgetProgressBar from "./BudgetProgressBar";

export default function BudgetCard({ category, budget, spent, percentage }) {
  return (
    <div className="rounded-xl border border-gray-100 p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-800">{category}</span>
        <div className="flex items-center gap-3">
          <button type="button" className="text-slate-400 hover:text-indigo-500">
            <Pencil className="h-4 w-4" />
          </button>
          <button type="button" className="text-slate-400 hover:text-rose-500">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between text-sm text-gray-600">
        <span>{spent.toLocaleString("fr-FR")} DT spent</span>
        <span className="text-gray-400">of {budget.toLocaleString("fr-FR")} DT</span>
      </div>

      <BudgetProgressBar percentage={percentage} />
    </div>
  );
}