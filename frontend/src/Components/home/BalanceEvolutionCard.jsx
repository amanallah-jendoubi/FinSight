import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

/**
 * BalanceEvolutionCard
 * Line chart, e.g. "Évolution du solde".
 *
 * Props:
 * - data: [{ date: string, value: number }]
 */
export default function BalanceEvolutionCard({ data }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">Évolution du solde</h3>

      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#94A3B8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94A3B8" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v / 1000}K`}
            />
            <Tooltip
              formatter={(v) => [`${v.toLocaleString()} DT`, "Solde"]}
              contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid #E2E8F0" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 4, fill: "#fff", stroke: "#3B82F6", strokeWidth: 2 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}