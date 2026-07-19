import { ShieldAlert, Wallet } from "lucide-react";
import dayjs from "dayjs";


const typeConfig = {
  unusual: {
    label: "Unusual transaction",
    badgeClass: "bg-red-50 text-red-500",
    iconBg: "bg-red-50",
    iconClass: "text-red-500",
    icon: ShieldAlert,
  },
  budget_warning: {
    label: "Budget warning",
    badgeClass: "bg-orange-50 text-orange-500",
    iconBg: "bg-orange-50",
    iconClass: "text-orange-500",
    icon: Wallet,
  },
    budget_exceeded: {
    label: "Budget exceeded",
    badgeClass: "bg-red-50 text-red-500",
    iconBg: "bg-red-50",
    iconClass: "text-red-500",
    icon: Wallet,
  },
};
const read = {
  badgeClass :"bg-gray-100 text-gray-500" ,
  iconBg : "bg-gray-100" ,
  iconClass : "text-gray-400"
}






export default function AlertItem({ alert, handleClick }) {
  const { id, type, title, message, createdat, isread} = alert;
  const baseConfig = typeConfig[type] ?? typeConfig.unusual;
  const config = isread ? { ...baseConfig, ...read } : baseConfig;
  const Icon = config.icon;
  const date = dayjs(createdat).format("DD/MM/YYYY");
  const time = dayjs(createdat).format("hh:mm A");

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-2xl p-4 sm:p-5 shadow-sm">
      <div className="flex items-start gap-3 sm:gap-4 min-w-0">
        <div
          className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${config.iconBg}`}
        >
          <Icon className={`w-5 h-5 ${config.iconClass}`} />
        </div>

        <div className="min-w-0">
          <span
            className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-1 ${config.badgeClass}`}
          >
            {config.label}
          </span>
          <h3 className="font-semibold text-slate-900 text-sm sm:text-base truncate">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 wrap-break-word">
            {message}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pl-13 sm:pl-0">
        <span className="text-xs sm:text-sm text-slate-400 whitespace-nowrap">
          {date} • {time}       
       </span>
        {!isread && 
          <button
            onClick={() => handleClick(id)}
            className="text-xs sm:text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-indigo-50 whitespace-nowrap"
          >
            Mark as read
          </button> 
        }
      </div>
    </div>
  );
}