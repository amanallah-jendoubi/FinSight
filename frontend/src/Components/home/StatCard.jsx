import React from "react";


export default function StatCard({ icon, iconBg = "bg-blue-50", label, value }) {

  return (
    <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3 ">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
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