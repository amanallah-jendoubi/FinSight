import React from "react";

/**
 * StatCard
 * Reusable summary card used for "Solde Total", "Dépenses du mois", "Revenus du mois".
 *
 * Props:
 * - icon: React node (e.g. <Wallet className="w-5 h-5" />)
 * - iconBg: tailwind bg class for the icon circle (e.g. "bg-blue-50")
 * - label: string, small label above the value
 * - value: string, main value (already formatted, e.g. "12 500 DT")
 */
export default function StatCard({ icon, iconBg = "bg-blue-50", label, value }) {

  return (
    <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3 min-w-[200px]">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-gray-500">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-gray-900">{value}</span>
        </div>
      </div>
    </div>
  );
}