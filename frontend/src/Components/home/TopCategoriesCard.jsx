import React from "react";
import { Star } from "lucide-react";

/**
 * TopCategoriesCard
 * e.g. "Top 3 catégories (dépenses)".
 *
 * Props:
 * - categories: [{ rank: number, name: string, amount: string }]
 */
export default function TopCategoriesCard({ categories }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-800">Top 3 categories (expenses)</h3>
        <Star className="w-4 h-4 text-blue-400" />
      </div>

      <ul className="flex flex-col gap-3">
        {categories.map((cat) => (
          <li key={cat.rank} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-500 text-xs font-semibold flex items-center justify-center">
                {cat.rank}
              </span>
              <span className="text-sm text-gray-700">{cat.name}</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{cat.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}