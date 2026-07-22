import TransactionCard from "./TransactionCard";

export default function TransactionCards({
  editAccount = true,
  currentPage,
  transactions,
  categories,
  accounts,
  onEdit,
  onDelete,
}) {
  return (
    <div className="flex flex-col gap-3">
      {transactions.length === 0 ? (
        <div className="rounded-xl border border-slate-100 bg-white px-6 py-10 text-center text-sm text-slate-400 shadow-sm">
          No transactions match these criteria
        </div>
      ) : (
        transactions
          .slice((currentPage - 1) * 6, (currentPage - 1) * 6 + 6) // limit to 6 transactions per page
          .map((t) => (
            <TransactionCard
              key={t.id}
              editAccount={editAccount}
              transaction={t}
              categories={categories}
              accounts={accounts}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
      )}
    </div>
  );
}