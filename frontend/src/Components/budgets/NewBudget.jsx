import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import dayjs from 'dayjs';
import { getAllCategories } from "../../api/endpoints/categories";
import { createPortal } from "react-dom";




export default function NewBudget({ onClose, onSubmit, budgetData = null, formTitle }) {
  const [form, setForm] = useState({
    id: budgetData?.id || null,
    category: budgetData?.category || "",
    budget :  budgetData?.budget || ""
  });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    async function loadCategories() {
      try {
        const catRes = await getAllCategories();
        setCategories((catRes.data || []).map((c) => c.name));
      } catch (err) {
        console.error(err.message);
      }
    }
    if (!form.category){
      loadCategories();
    }
  }, []);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear the error for this field as soon as the user fixes it
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validate = () => {
    const errObj = {};
    if (!form.budget) {
      errObj.budget = "Required field";
    }
    else if (form.budget === "" || Number.isNaN(Number(form.budget)) || Number(form.budget) <= 0) {
      errObj.budget = "Enter a valid budget";
    }
    if (!form.category) errObj.category = "Required field";
    setErrors(errObj);
    return Object.keys(errObj).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const payload = {
      id : form.id,
      categoryName: form.category ,
      amount : form.budget,
    };
    await onSubmit(payload);
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

 return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div
        className="sm:w-full w-[90%] max-w-md rounded-xl bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">{ formTitle }</h2>
          <button onClick={onClose} aria-label="close">
            <X className="h-5 w-5 text-slate-400 hover:text-slate-600" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Budget */}
            <div>
              <label className={labelClass}>Amount</label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={form.budget}
                  onChange={(e) => update("budget", e.target.value)}
                  placeholder="Ex: 100.00"
                  className={`${inputClass("budget")} pr-9`}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  DT
                </span>
              </div>
              <ErrorText field="budget" />
            </div>

          {!budgetData &&
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
            Save Budget
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}