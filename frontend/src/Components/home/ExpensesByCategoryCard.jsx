import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

/**
 * ExpensesByCategoryCard
 * Donut chart + legend, e.g. "Répartition des dépenses par catégorie".
 *
 * Props:
 * - data: [{ name: string, value: number, color: string }]
 */
export default function ExpensesByCategoryCard({ data }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">
        Répartition des dépenses par catégorie
      </h3>

      <div className="flex items-center gap-6">
        <div className="w-32 h-32 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius="65%"
                outerRadius="100%"
                paddingAngle={2}
                stroke="none"
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className="flex flex-col gap-2">
          {data.map((entry) => (
            <li key={entry.name} className="flex items-center gap-2 text-sm text-gray-600">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="w-20">{entry.name}</span>
              <span className="text-gray-400">{entry.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}