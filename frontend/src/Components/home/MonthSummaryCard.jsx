import React from "react";
import { Bell } from "lucide-react";

/**
 * MonthSummaryCard
 * e.g. "Résumé du mois".
 *
 * Props:
 * - transactionCount: number
 * - unreadAlerts: number
 */
export default function MonthSummaryCard({ transactionCount, unreadAlerts }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-800">Résumé du mois</h3>
        <Bell className="w-4 h-4 text-blue-400" />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Nombre de transactions</span>
          <span className="text-sm font-medium text-gray-900">{transactionCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Alertes non lues</span>
          <span className="text-sm font-medium text-gray-900">{unreadAlerts}</span>
        </div>
      </div>
    </div>
  );
}