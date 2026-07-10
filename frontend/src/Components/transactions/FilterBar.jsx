import { ChevronDown, Plus } from "lucide-react";
import { Transaction as NewTransaction } from "./Transaction";
import { useEffect, useState } from "react";
//import toast from "react-hot-toast";



/**
 * FilterBar
 * Row of filter controls: date range, category, type, amount range, and a filter action button.
 *
 * Props:
 * - filters: { dateStart, dateEnd, category, type, montantMin, montantMax }
 * - categories: string[]
 * - types: string[]
 * - onChange: (key, value) => void
 * - onFilter: () => void
 */
export default function FilterBar({filters, categories, transactions, setTransactions, accounts, onChange, onFilter, handleSubmit}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="flex flex-wrap items-end gap-3">
      <FieldWrapper label="Start date">
        <div className="relative">
          <input
            type="date"
            value={filters.dateStart}
            onChange={(e) => onChange("dateStart", e.target.value)}
            className="w-36 rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </FieldWrapper>

      <FieldWrapper label="End date">
        <div className="relative">
          <input
            type="date"
            value={filters.dateEnd}
            onChange={(e) => onChange("dateEnd", e.target.value)}
            className="w-36 rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </FieldWrapper>

      {(filters.type === 'Expense') && 
      <FieldWrapper label="Category">
        <SelectField
          value={filters.category}
          options={['All', ...categories]}
          onChange={(v) => onChange("category", v)}
        />
      </FieldWrapper>
      }

      <FieldWrapper label="Type">
        <SelectField
          value={filters.type}
          options={['All', 'Expense', 'Income']}
          onChange={(v) => onChange("type", v)}
        />
      </FieldWrapper>

      <FieldWrapper label="Min amount">
        <input
          type="text"
          placeholder="Min"
          value={filters.minAmount}
          onChange={(e) => onChange("minAmount", e.target.value)}
          className="w-28 rounded-lg border border-slate-200 bg-white py-2 px-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
      </FieldWrapper>

      <FieldWrapper label="Max amount">
        <input
          type="text"
          placeholder="Max"
          value={filters.maxAmount}
          onChange={(e) => onChange("maxAmount", e.target.value)}
          className="w-28 rounded-lg border border-slate-200 bg-white py-2 px-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
      </FieldWrapper>

      <button
        type="button"
        onClick={onFilter}
        className="rounded-lg bg-indigo-50 px-5 py-2 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-100"
      >
        Filter
      </button>
      
      <button
        type="button"
        onClick = {()=>setIsModalOpen (true)}
        className="inline-flex items-center bg-indigo-600 gap-1.5 rounded-lg  px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 active:bg-indigo-800"
      >
        <Plus className="h-4 w-4" strokeWidth={2.5} />
        New transaction
      </button>
      {isModalOpen && (
        <NewTransaction
        transactionText= "New transaction"
        categories={categories}
        accounts = {accounts}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(id, data) =>{
          handleSubmit(id, data);
          setIsModalOpen(false);
        }
        }
        />
)}

    </div>
  );
}

function FieldWrapper({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function SelectField({ value, options, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-32 appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}