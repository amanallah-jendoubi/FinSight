import TransactionRow from "./TransactionRow";

/**
 * TransactionsTable
 * Displays the list of transactions with sortable column headers.
 *
 * Props:
 * - transactions: Array<{ id, date, description, category, type, montant }>
 * - activeSort: { key: string, direction: 'asc' | 'desc' } | null
 * - onSort: (key) => void
 * - onEdit: (id) => void
 * - onDelete: (id) => void
 */
export default function TransactionsTable({
  editAccount = true,
  currentPage,
  transactions,
  categories,
  accounts,
  onEdit,
  onDelete,
}) {
  return (
    <div className="rounded-xl border border-slate-100">
      <table className="border-collapse w-full">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Description
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Category/Source
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Type
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
              Amount
            </th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400">
                No transactions match these criteria
              </td>
            </tr>
          ) : (
            transactions.slice((currentPage-1)*6,(currentPage-1)*6 + 6).map((t) => ( // limit to 6 transactions per page
              <TransactionRow key={t.id} editAccount= {editAccount} transaction={t} categories={categories} accounts={accounts} onEdit={onEdit} onDelete={onDelete} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}