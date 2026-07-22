import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import donut from "../../assets/donut-chart.png"


export default function ExpensesByCategoryCard({ data }) {
  return (
   
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">
        Expense distribution by category
      </h3>
      {data.length > 0 ? (
        <div className="flex items-center gap-0.5 sm:gap-6 ">
          <div className="w-32 h-32 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="65%"
                  outerRadius="100%"
                  paddingAngle={data.length > 1 ? 2 : 0}                
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
                <span className="w-15 sm:w-20">{entry.name}</span>
                <span className="text-gray-400">{entry.value}%</span>
              </li>
            ))}
          </ul>
        </div>
        )
        :(
        <div className="p-4 flex flex-col items-center gap-6 sm:gap-8 h-[90%] justify-between">
          <img src={donut} alt="description" className="w-45 h-45 flex-1 object-cover" />
            <div className="text-center">
              <h3 className="text-sm font-semibold text-gray-800">No expense data yet</h3>
              <p className="text-sm text-gray-400 mt-1">
                Start adding expenses to see where your money goes
              </p>
            </div>
          </div>
        )
      }
    </div>
  );
}