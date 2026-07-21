import { useState } from "react";
import { MoreHorizontal, Plus, X } from "lucide-react";
import AddAccountModal from './AddAccountModal';

function TypeBadge({ children }) {
  return (
    <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-600">
      {children}
    </span>
  );
}


export default function BankAccountsCard({
  accounts,
  handleAddAccount,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-[15px] font-semibold text-gray-900">
        Bank accounts management
      </h2>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-xs text-gray-400">
            <th className="pb-3 font-medium">Bank</th>
            <th className="pb-3 font-medium">Type</th>
            <th className="pb-3 font-medium">Balance</th>
          </tr>
        </thead>
        <tbody>
           {accounts.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-4 py-10 text-center text-sm text-slate-400">
                Create an account to get started
              </td>
            </tr>
          ) : (
            accounts.map((account) => (
            <tr key={account.id} className="border-t border-gray-50">
              <td className="py-3">
                <p className="font-medium text-gray-900 px-1">{account.bankname}</p>
              </td>
              <td className="py-3">
                <TypeBadge>{account.type}</TypeBadge>
              </td>
              <td className="py-3 font-medium text-gray-900">
                {account.balance + " DT"}
              </td>
              <td className="py-3 text-right">
                <button
                  type="button"
                  aria-label="Account options"
                  onClick={() => {}}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <MoreHorizontal size={18} />
                </button>
              </td>
            </tr>
          ))
          )}
        </tbody>
      </table>

      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="inline-flex items-center bg-indigo-600 gap-1.5 mt-3 rounded-lg  px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 active:bg-indigo-800"
      >
        <Plus size={14} />
        Add an account
      </button>
    { modalOpen && 
      <AddAccountModal
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddAccount}
      />
    }
    </div>
  );
}