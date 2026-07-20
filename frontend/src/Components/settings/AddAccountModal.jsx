import { useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const bankOptions = [
  "Société Tunisienne de Banque (STB)",
  "Banque Nationale Agricole (BNA)",
  "Banque de l'Habitat (BH)",
  "Banque de Financement des Petites et Moyennes entreprises (BFPME)",
  "Banque Tunisienne de Solidarité (BTS)",
  "Banque de Tunisie et des Emirats (BTE)",
  "Banque Tuniso-Libyenne (BTL)",
  "Tunisian Saudi Bank (TSB)",
  "Banque Zitouna",
  "Al Baraka Bank",
  "Al Wifak International Bank",
  "Amen Bank",
  "Attijari Bank",
  "Arab Tunisian Bank (ATB)",
  "Bank ABC Tunisie",
  "Banque Internationale Arabe de Tunisie (BIAT)",
  "Banque de Tunisie (BT)",
  "Banque Tuniso Koweitienne (BTK)",
  "Banque Franco Tunisienne (BFT)",
  "Citi Bank",
  "Qatar National Bank - Tunis (QNB-Tunis)",
  "Union Bancaire de Commerce et d'Industrie (UBCI)",
  "Union Internationale de Banque (UIB)",
];

const typeOptions = [
  "Main checking",
  "Savings account",
  "Foreign currency account",
  "Joint account",
  "Business account",
  "Student account",
  "Investment account",
  "Fixed deposit account",
  "Retirement account",
  "Payroll account",
  "Escrow account",
  "Brokerage account",
  "Trust account",
  "Non-resident account",
  "Offshore account",
];

export default function AddAccountModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    bankName : "",
    type : "",
    balance :  0,
  });
  const [errors, setErrors] = useState("");

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear the error for this field as soon as the user fixes it
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };


  const validate = () => {
    const errObj = {};
    if (!form.bankName) errObj.bankname = "Required field";
    if (!form.type) errObj.type = "Required field";
    const numericBalance = Number(form.balance);
    if (!form.balance.toString().trim()) {
      errObj.balance = "Required field";
    } else if (Number.isNaN(numericBalance) || numericBalance < 0) {
      errObj.balance = "Enter a valid amount";
    }
    setErrors(errObj);
    return Object.keys(errObj).length === 0;
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ bankName : form.bankName, type: form.type, balance: Number(form.balance) });
    onClose ();
  }
  const inputClass = (field) =>
    `w-full rounded-lg border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 ${
      errors[field]
        ? "border-red-400 focus:border-red-500 focus:ring-red-200"
        : "border-gray-200 focus:border-violet-400 focus:ring-violet-400"
    }`;
  const labelClass = "mb-1 block text-xs font-medium text-gray-500";
  
  const ErrorText = ({ field }) =>
    errors[field] ? (
      <p className="mt-1 text-xs text-red-500">{errors[field]}</p>
    ) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-gray-900">
            Add an account
          </h3>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>
              Bank
            </label>
            <select
              value={form.bankName}
              onChange={(e) => update("bankName", e.target.value)}
              className= {inputClass("bankName")}
            >
              <option value="" disabled>
                Select a bank
              </option>
              {bankOptions.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
            <ErrorText field="bankName" />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Type
            </label>
            <select
              value={form.type}
              onChange={(e) => update("type", e.target.value)}
              className={inputClass("type")}
            >
              <option value="" disabled>
                Select a type
              </option>
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <ErrorText field="type" />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Balance (DT)
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={form.balance}
              onChange={(e) => update("balance", e.target.value)}
              placeholder="0.000"
              className={inputClass("balance")}
            />
            <ErrorText field="balance" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Add account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}