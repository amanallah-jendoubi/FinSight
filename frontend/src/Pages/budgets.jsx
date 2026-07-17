import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { createBudget, getAllBudgets, updateBudget, deleteBudget } from '../api/endpoints/budget'
import BudgetTableRow from "../Components/budgets/BudgetTableRow";
import BudgetCard from "../Components/budgets/BudgetCard";
import NewBudget from "../Components/budgets/NewBudget";
import toast from "react-hot-toast";

export default function Budgets() {
  const [showForm, setShowForm] = useState(false);
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    async function loadBudgets() {
      try {
        const budRes = (await getAllBudgets()).data;
        const mapped = budRes.map((b) => {
          const budget = Number(b.limitamount);
          const spent = Number(b.moneyspent);
          return {
            id : b.id ,
            category: b.name,
            budget,
            spent,
            percentage: Math.round((spent / budget) * 100),
          };
        });
        setBudgets(mapped || []);
      } catch (err) {
        console.error(err.message);
      }
    }
    loadBudgets();
  }, []);

  async function handleSubmit(formData) {
    try {
      const res = (await createBudget(formData)).data;
      const newBudget = {
        id : res.id,
        category: res.categoryName,
        budget: Number(res.limitamount),
        spent: Number(res.moneyspent),
        percentage:
          Number(res.limitamount) > 0
            ? Math.round((Number(res.moneyspent) / Number(res.limitamount)) * 100)
            : 0,
      };
      setBudgets((prev) => [...prev, newBudget]);
      setShowForm(false);
      toast.success("Budget added successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Unable to add budget");
    }
  }

  async function handleEdit (budgetId, updatedAmount){
    try{
      const res = (await updateBudget(budgetId, {updatedAmount})).data;
       const updatedBudget = {
        id : res.id,
        category: res.categoryName,
        budget: Number(res.limitamount),
        spent: Number(res.moneyspent),
        percentage:
          Number(res.limitamount) > 0
            ? Math.round((Number(res.moneyspent) / Number(res.limitamount)) * 100)
            : 0,
      };
      setBudgets((prev) =>
        prev.map((b) => (b.id === updatedBudget.id ? updatedBudget : b))
      );   
      toast.success("budget updated successfully!")
    }catch (err){
      toast.error("Unable to update budget");
    }
  }

  async function handleDelete (budgetId){
    try{
      (await deleteBudget(budgetId))
      setBudgets((prev) => prev.filter((b) => b.id !== budgetId));
      toast.success("budget deleted successfully!")
    }catch (err){
      toast.error("Unable to delete budget");
    }
  }


  return (
    <div className="w-[95%] md:w-[80%] mx-auto mt-14 rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm">
      {/* Header */}
      <div className="mb-3 flex justify-end">
        <button
          onClick={() => setShowForm(true)}
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 sm:px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 active:bg-indigo-800"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          <span>Add a budget</span>
        </button>
        {showForm && <NewBudget onClose={() => setShowForm(false)} onSubmit={handleSubmit} formTitle= "Add budget" />}
      </div>

      {budgets.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">
          No budget at the moment — add one to get started
        </p>
      ) : (
        <>
          {/* Table — sm and up */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left">
                  <th className="pb-2 pr-4 text-sm font-medium text-gray-400">Category</th>
                  <th className="pb-2 pr-4 text-sm font-medium text-gray-400">Budget</th>
                  <th className="pb-2 pr-4 text-sm font-medium text-gray-400">Spent</th>
                  <th className="pb-2 pr-4 text-sm font-medium text-gray-400">Progress</th>
                  <th className="pb-2 text-sm font-medium text-gray-400 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {budgets.map((row) => (
                  <BudgetTableRow key={row.id} {...row}  handleEdit={handleEdit} handleDelete={handleDelete} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards — below sm */}
          <div className="sm:hidden space-y-3">
            {budgets.map((row) => (
              <BudgetCard key={row.category} {...row}   handleEdit={handleEdit} handleDelete={handleDelete} />
            ))}
          </div>
        </>
      )}

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-4 border-t border-gray-50 pt-3">
        <LegendItem color="bg-emerald-500" label="0 - 50% (OK)" />
        <LegendItem color="bg-amber-500" label="50 - 80% (Attention)" />
        <LegendItem color="bg-red-500" label="> 80% (Exceeded)" />
      </div>
    </div>
  );
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      <span className="text-xs sm:text-sm text-gray-400">{label}</span>
    </div>
  );
}