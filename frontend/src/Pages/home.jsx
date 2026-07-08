import { Wallet, ShoppingBag, TrendingUp } from "lucide-react";

import StatCard from "../Components/home/StatCard";
import ExpensesByCategoryCard from "../Components/home/ExpensesByCategoryCard";
import BalanceEvolutionCard from "../Components/home/BalanceEvolutionCard";
import TopCategoriesCard from "../Components/home/TopCategoriesCard";
import MonthSummaryCard from "../Components/home/MonthSummaryCard";
import TransactionsTable from "../Components/home/TransactionsTable";
import {getMonthExpenseByCategory, getTopCategories, getMonthIncome, getMonthTransactionsCount, getAllTransactions} from "../api/endpoints/transactions";
import {getAllAccountsByUserId} from "../api/endpoints/accounts";

// --- Mock data — replace with data fetched from your API/store ---
const colors = [
  "#FF6384", // Pink/Red
  "#36A2EB", // Blue
  "#FFCE56", // Yellow
  "#4BC0C0", // Teal
  "#9966FF", // Purple
  "#FF9F40", // Orange
  "#FF8A80", // Light Red
  "#80DEEA", // Light Cyan
  "#A5D6A7", // Light Green
  "#FFD54F", // Amber
  "#CE93D8", // Light Purple
  "#EF9A9A", // Rose
];
const Data = (await getMonthExpenseByCategory ()).data || [];
const categoryData = Data.map((item, index) => ({
  name: item.name,
  value: Number(item.value), 
  color: colors[index % colors.length] 
}));


const balanceHistory = [
  { date: "01/05", value: 8000 },
  { date: "08/05", value: 11000 },
  { date: "15/05", value: 9500 },
  { date: "22/05", value: 14000 },
  { date: "29/05", value: 6500 },
  { date: "31/05", value: 12500 },
  { date: "31/05", value: 16500 },
];


const rawData = (await getTopCategories()).data || [];
const topCategories = rawData.map((item, index) => ({
  rank: index + 1,
  ...item,
}));


const soldeTotal = (await getAllAccountsByUserId()).data.totalBalance ;
let totalValue = 0;
for (let i = 0; i < rawData.length; i++) {
  totalValue += Number(rawData[i].amount);
}

const monthlyIncome = (await getMonthIncome()).data.total;
const transactionCount= (await getMonthTransactionsCount()).data.count;

const transactionsRawData = (await getAllTransactions()).data;
const transactions = transactionsRawData.map((item) => ({
  date: item.date,
  description: item.description,
  categorySource: item.categoryname ?? item.source,
  type: item.type,
  amount: Number(item.amount),
}));

/*const transactions = [
  { date: "31/05/2025", description: "Supermarché Monoprix", category: "Alimentation", type: "Dépense", amount: "85 DT" },
  { date: "30/05/2025", description: "Salaire", category: "Revenus", type: "Revenu", amount: "2 000 DT", isPositive: true },
  { date: "29/05/2025", description: "Station Service", category: "Transport", type: "Dépense", amount: "60 DT" },
  { date: "28/05/2025", description: "Café Central", category: "Loisirs", type: "Dépense", amount: "18 DT" },
  { date: "28/05/2025", description: "Freelance Projet", category: "Revenus", type: "Revenu", amount: "500 DT", isPositive: true },
];*/

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col gap-4">
      {/* Top stat row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <StatCard
          icon={<Wallet className="w-5 h-5 text-blue-500" />}
          iconBg="bg-blue-50"
          label="Total Balance"
          value = {`${soldeTotal} DT`}
        />
        <StatCard
          icon={<ShoppingBag className="w-5 h-5 text-orange-500" />}
          iconBg="bg-orange-50"
          label="Monthly Expenses"
          value= {`${totalValue} DT`}
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
          iconBg="bg-emerald-50"
          label="Monthly Income"
          value= {`${monthlyIncome} DT`}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ExpensesByCategoryCard data={categoryData} />
        <BalanceEvolutionCard data={balanceHistory} />
      </div>

      {/* Lists row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopCategoriesCard categories={topCategories} />
        <MonthSummaryCard transactionCount={transactionCount} unreadAlerts={0} />
      </div>

      {/* Transactions table */}
      <TransactionsTable
        transactions={transactions}
      />
    </div>
  );
}