import { Link } from "react-router-dom";

/**
 * TransactionsTable
 * e.g. "Dernières transactions".
 *
 * Props:
 * - transactions: [{ date, description, category, type, amount, isPositive }]
 * - onViewAll: () => void
 */
export default function TransactionsTable({ transactions }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">Recent Transactions</h3>

      <div className="overflow-x-auto">
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
            {transactions.map((t, i) => (
              <tr key={i} className="border-t border-gray-50">
                <td className="py-2 pr-4 text-gray-500">{t.date}</td>
                <td className="py-2 pr-4 text-gray-800">{t.description}</td>
                <td className="py-2 pr-4 text-gray-500">{t.categorySource}</td>
                <td className="py-2 pr-4 text-gray-500">{t.type}</td>
                <td
                  className={`py-2 text-right font-medium ${
                    t.type === 'income' ? "text-emerald-500" : "text-gray-900"
                  }`}
                >
                  {t.type === 'income' ? "+" : "-"}
                  {t.amount} DT
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link
        to="/transactions"
        className="mt-4 text-sm text-blue-500 hover:text-blue-600 font-medium inline-block"
      >
        Voir toutes les transactions →
      </Link>
    </div>
  );
}