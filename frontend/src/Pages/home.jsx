import { Wallet, ShoppingBag, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

import StatCard from "../Components/home/StatCard";
import ExpensesByCategoryCard from "../Components/home/ExpensesByCategoryCard";
import BalanceEvolutionCard from "../Components/home/BalanceEvolutionCard";
import TopCategoriesCard from "../Components/home/TopCategoriesCard";
import MonthSummaryCard from "../Components/home/MonthSummaryCard";
import TransactionsTable from "../Components/home/TransactionsTable";
import {
  getMonthExpenseByCategory,
  getTopCategories,
  getMonthIncome,
  getMonthTransactionsCount,
  getAllTransactions,
} from "../api/endpoints/transactions";
import { getAllAccountsByUserId } from "../api/endpoints/accounts";

const colors = [
  "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
  "#FF8A80", "#80DEEA", "#A5D6A7", "#FFD54F", "#CE93D8", "#EF9A9A",
];

// TODO: replace with real balance-history endpoint once available
const balanceHistory = [
  { date: "01/05", value: 8000 },
  { date: "08/05", value: 11000 },
  { date: "15/05", value: 9500 },
  { date: "22/05", value: 14000 },
  { date: "29/05", value: 6500 },
  { date: "31/05", value: 12500 },
];

export default function Home() {
  const [categoryData, setCategoryData] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [soldeTotal, setSoldeTotal] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [catRes, topRes, balRes, incomeRes, countRes, txRes] = await Promise.all([
          getMonthExpenseByCategory(),
          getTopCategories(),
          getAllAccountsByUserId(),
          getMonthIncome(),
          getMonthTransactionsCount(),
          getAllTransactions(),
        ]);

        const rawTopCategories = topRes.data || [];
        setTopCategories(
          rawTopCategories.map((item, index) => ({ rank: index + 1, ...item }))
        );

        let sumTotal = 0;
        for (let i = 0; i < rawTopCategories.length; i++) {
          sumTotal += Number(rawTopCategories[i].amount);
        }
        setTotalValue(sumTotal);

        setSoldeTotal(balRes.data.totalBalance);

        setCategoryData(
          (catRes.data || []).map((item, i) => ({
            name: item.name,
            value: Number(item.value),
            color: colors[i % colors.length],
          }))
        );

        setTransactions(
          (txRes.data || []).map((item) => ({
            date: item.date,
            description: item.description,
            categorySource: item.categoryname ?? item.source,
            type: item.type,
            amount: Number(item.amount),
          }))
        );

        setMonthlyIncome(incomeRes.data.total);
        setTransactionCount(countRes.data.count);
      } catch (err) {
        console.error("Failed to load dashboard", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600" />
          <p className="text-sm text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <StatCard
          icon={<Wallet className="w-5 h-5 text-blue-500" />}
          iconBg="bg-blue-50"
          label="Total Balance"
          value={`${soldeTotal} DT`}
        />
        <StatCard
          icon={<ShoppingBag className="w-5 h-5 text-orange-500" />}
          iconBg="bg-orange-50"
          label="Monthly Expenses"
          value={`${totalValue} DT`}
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
          iconBg="bg-emerald-50"
          label="Monthly Income"
          value={`${monthlyIncome} DT`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ExpensesByCategoryCard data={categoryData} />
        <BalanceEvolutionCard data={balanceHistory} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopCategoriesCard categories={topCategories} />
        <MonthSummaryCard transactionCount={transactionCount} unreadAlerts={0} />
      </div>

      <TransactionsTable transactions={transactions} />
    </div>
  );
}