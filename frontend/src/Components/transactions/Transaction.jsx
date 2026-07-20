import { useState } from 'react';
import { X } from 'lucide-react';
import dayjs from 'dayjs';


export function Transaction({ oldFields = null, editAccount ,categories, accounts,  onClose, onSubmit, transactionText }) {
  const [form, setForm] = useState({
    date: oldFields?.date ||dayjs().format('YYYY-MM-DD'),
    description: oldFields?.description || "",
    amount: oldFields?.amount || "",
    type: oldFields?.type || "expense",
    category: oldFields?.categorySource ||"",
    source: oldFields?.categorySource || "",
    accountId: oldFields?.accountId || "",
  });
  const [errors, setErrors] = useState({});

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear the error for this field as soon as the user fixes it
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validate = () => {
    const errObj = {};

    if (!form.date) errObj.date = "Required field";
    if (!form.description.trim()) errObj.description = "Required field";
    if (form.type === 'expense' && !form.category) errObj.category = "Required field";
    if (form.type === 'income' && !form.source) errObj.source = "Required field";
    const amountNum = Number(form.amount);
    if (!form.amount.toString().trim()) {
      errObj.amount = "Required field";
    } else if (Number.isNaN(amountNum) || amountNum <= 0) {
      errObj.amount = "Enter a valid amount";
    }

    if (editAccount && !form.accountId) errObj.accountId = "Required field";

    setErrors(errObj);
    return Object.keys(errObj).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const payload = {
      date: form.date,
      description: form.description.trim(),
      amount: Number(form.amount),
      type: form.type,
      categoryName: form.type === "expense" ? form.category : null,
      source: form.type === "income" ? form.source.trim() : null,
      accountId: Number(form.accountId),
    };
    await onSubmit(payload.accountId,payload);
  };

  const inputClass = (field) =>
    `w-full rounded-lg border px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 ${
      errors[field]
        ? "border-red-400 focus:border-red-500 focus:ring-red-200"
        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
    }`;
  const labelClass = "mb-1 block text-sm font-medium text-slate-700";

  const ErrorText = ({ field }) =>
    errors[field] ? (
      <p className="mt-1 text-xs text-red-500">{errors[field]}</p>
    ) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">{transactionText}</h2>
          <button onClick={onClose} aria-label="close">
            <X className="h-5 w-5 text-slate-400 hover:text-slate-600" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Date */}
          <div>
            <label className={labelClass}>Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              className={inputClass("date")}
            />
            <ErrorText field="date" />
          </div>

          {/* Description + Amount */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Description</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Ex: Courses, Salary, Rent..."
                className={inputClass("description")}
              />
              <ErrorText field="description" />
            </div>
            <div>
              <label className={labelClass}>Amount</label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={form.amount}
                  onChange={(e) => update("amount", e.target.value)}
                  placeholder="Ex: 100.00"
                  className={`${inputClass("amount")} pr-9`}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  DT
                </span>
              </div>
              <ErrorText field="amount" />
            </div>
          </div>

          {/* Type toggle */}
          <div>
            <label className={labelClass}>Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => update("type", "expense")}
                className={`flex items-center justify-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  form.type === "expense"
                    ? "border-red-300 bg-red-50 text-red-600"
                    : "border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => update("type", "income")}
                className={`flex items-center justify-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  form.type === "income"
                    ? "border-emerald-300 bg-emerald-50 text-emerald-600"
                    : "border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                Income
              </button>
            </div>
          </div>

          {/* Category or Source */}
          {form.type === "expense" ? (
            <div>
              <label className={labelClass}>Category</label>
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className={inputClass("category")}
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ErrorText field="category" />
            </div>  
          ) : (
            <div>
              <label className={labelClass}>Source</label>
              <input
                type="text"
                value={form.source}
                onChange={(e) => update("source", e.target.value)}
                className={inputClass("source")}
                placeholder="e.g. Salary, Freelance..."
              />
              <ErrorText field="source" />
            </div>
          )}

          {/* Account */}
          {editAccount &&
            <div>
              <label className={labelClass}>Account</label>
              <select
                value={form.accountId}
                onChange={(e) => update("accountId", e.target.value)}
                className={inputClass("accountId")}
              >
                <option value="">Select an account</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>{a.type}</option>
                ))}
              </select>
              <ErrorText field="accountId" />
            </div>
          }
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Save transaction
          </button>
        </div>
      </div>
    </div>
  );
}