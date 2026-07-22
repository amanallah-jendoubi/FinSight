import { Link } from "react-router-dom";

export default function TransactionsTable({ transactions }) {
  const recent = transactions.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">Recent Transactions</h3>

      {/* Table view: 800px and up */}
      <div className="hidden min-[800px]:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 text-xs uppercase tracking-wide">
              <th className="font-medium pb-2 pr-4">Date</th>
              <th className="font-medium pb-2 pr-4">Description</th>
              <th className="font-medium pb-2 pr-4">Category/Source</th>
              <th className="font-medium pb-2 pr-4">Type</th>
              <th className="font-medium pb-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-400">
                  No transactions made yet
                </td>
              </tr>
            ) : (
              recent.map((t, i) => (
                <tr key={i} className="border-t border-gray-50">
                  <td className="py-2 pr-4 text-gray-500">{t.date}</td>
                  <td className="py-2 pr-4 text-gray-800">{t.description}</td>
                  <td className="py-2 pr-4 text-gray-500">{t.categorySource}</td>
                  <td className="py-2 pr-4 text-gray-500">{t.type}</td>
                  <td
                    className={`py-2 text-right font-medium ${
                      t.type === "income" ? "text-emerald-500" : "text-gray-900"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"}
                    {t.amount.toLocaleString("en-Us")} DT
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Card view: below 800px */}
      <div className="min-[800px]:hidden">
        {recent.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-slate-400">
            No transactions made yet
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {recent.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-start px-5 py-4">
                  <span className="font-medium text-gray-900">{t.description}</span>
                </div>

                <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-sm">
                  <span className="text-gray-400">Date</span>
                  <span className="text-gray-800">{t.date}</span>
                </div>
                <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-sm">
                  <span className="text-gray-400">Category/Source</span>
                  <span className="text-gray-800">{t.categorySource}</span>
                </div>
                <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-sm">
                  <span className="text-gray-400">Type</span>
                  <span className="text-gray-800">{t.type}</span>
                </div>
                <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-sm">
                  <span className="text-gray-400">Amount</span>
                  <span
                    className={`font-semibold ${
                      t.type === "income" ? "text-emerald-500" : "text-gray-900"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"}
                    {t.amount.toLocaleString("en-US")} DT
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Link
        to="/transactions"
        className="mt-4 text-sm text-blue-500 hover:text-blue-600 font-medium inline-block"
      >
        See all transactions →
      </Link>
    </div>
  );
}