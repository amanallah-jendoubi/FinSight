import { Wallet, ShoppingBag, TrendingUp } from "lucide-react";

import StatCard from "../Components/home/StatCard";
import ExpensesByCategoryCard from "../Components/home/ExpensesByCategoryCard";
import BalanceEvolutionCard from "../Components/home/BalanceEvolutionCard";
import TopCategoriesCard from "../Components/home/TopCategoriesCard";
import MonthSummaryCard from "../Components/home/MonthSummaryCard";
import TransactionsTable from "../Components/home/TransactionsTable";

// --- Mock data — replace with data fetched from your API/store ---
const categoryData = [
  { name: "Alimentation", value: 40, color: "#3B82F6" },
  { name: "Transport", value: 25, color: "#10B981" },
  { name: "Logement", value: 15, color: "#6366F1" },
  { name: "Loisirs", value: 10, color: "#F59E0B" },
  { name: "Santé", value: 5, color: "#EF4444" },
  { name: "Autres", value: 5, color: "#A855F7" },
];

const balanceHistory = [
  { date: "01/05", value: 8000 },
  { date: "08/05", value: 11000 },
  { date: "15/05", value: 9500 },
  { date: "22/05", value: 14000 },
  { date: "29/05", value: 6500 },
  { date: "31/05", value: 12500 },
  { date: "31/05", value: 16500 },
];

const topCategories = [
  { rank: 1, name: "Alimentation", amount: "940 DT" },
  { rank: 2, name: "Transport", amount: "590 DT" },
  { rank: 3, name: "Loisirs", amount: "360 DT" },
];

const transactions = [
  { date: "31/05/2025", description: "Supermarché Monoprix", category: "Alimentation", type: "Dépense", amount: "-85 DT" },
  { date: "30/05/2025", description: "Salaire", category: "Revenus", type: "Revenu", amount: "+2 000 DT", isPositive: true },
  { date: "29/05/2025", description: "Station Service", category: "Transport", type: "Dépense", amount: "-60 DT" },
  { date: "28/05/2025", description: "Café Central", category: "Loisirs", type: "Dépense", amount: "-18 DT" },
  { date: "28/05/2025", description: "Freelance Projet", category: "Revenus", type: "Revenu", amount: "+500 DT", isPositive: true },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col gap-4">
      {/* Top stat row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <StatCard
          icon={<Wallet className="w-5 h-5 text-blue-500" />}
          iconBg="bg-blue-50"
          label="Solde Total"
          value="12 500 DT"
        />
        <StatCard
          icon={<ShoppingBag className="w-5 h-5 text-orange-500" />}
          iconBg="bg-orange-50"
          label="Dépenses du mois"
          value="2 350 DT"
          trend={{ value: "8%", direction: "down" }}
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
          iconBg="bg-emerald-50"
          label="Revenus du mois"
          value="4 000 DT"
          trend={{ value: "12%", direction: "up" }}
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
        <MonthSummaryCard transactionCount={48} unreadAlerts={3} />
      </div>

      {/* Transactions table */}
      <TransactionsTable
        transactions={transactions}
        onViewAll={() => console.log("navigate to all transactions")}
      />
    </div>
  );
}