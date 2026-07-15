import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import NewBudget from "./NewBudget";
import BudgetProgressBar from "./BudgetProgressBar";

export default function BudgetTableRow({ id, category, budget, spent, percentage, handleEdit, handleDelete}) {
  const [show, setShow]= useState (false);
  return (
    <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors">
      <td className="py-3.5 pr-4 text-sm font-medium text-gray-800">{category}</td>
      <td className="py-3.5 pr-4 text-sm tabular-nums text-gray-600 whitespace-nowrap">
        {budget.toLocaleString("fr-FR")} DT
      </td>
      <td className="py-3.5 pr-4 text-sm tabular-nums text-gray-600 whitespace-nowrap">
        {spent.toLocaleString("fr-FR")} DT
      </td>
      <td className="py-3.5 pr-4">
        <BudgetProgressBar percentage={percentage} />
      </td>
      <td className="py-3.5">
        <div className="flex items-center justify-center gap-3">
          <button type="button" className="text-slate-400 transition-colors hover:text-indigo-500 " onClick={()=>{setShow(true)}}>
            <Pencil className="h-4 w-4" />
          </button>
          <button type="button" className="text-slate-400 transition-colors hover:text-rose-500" onClick= {()=>handleDelete(id)} >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
      {show && <NewBudget onClose={() => setShow(false)} onSubmit={(updatedData)=>{handleEdit(updatedData.id, updatedData.amount); setShow(false)} }  budgetData = {{id, category, budget}}  formTitle = "Update budget" />}
    </tr>
  );
}