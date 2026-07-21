import { Wallet, ShoppingBag, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

import StatCard from "../Components/home/StatCard";
import Loading from '../Components/Loading';
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
  getTotalBalanceEvolution
} from "../api/endpoints/transactions";
import { getAllAccountsByUserId } from "../api/endpoints/accounts";



//random color generator
function generateColor(index) {
  const hue = (index * 137.508) % 360; // golden angle - keeps every color well spaced from its neighbors
  const saturation = 65 + (index % 3) * 5;  // 65-75%, vibrant but not neon
  const lightness = 55 + (index % 4) * 4;   // 55-67%, readable on light/dark backgrounds
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}



export default function Home() {
  const [categoryData, setCategoryData] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [balanceHistory, setBalanceHistory] = useState ([]);
  const [soldeTotal, setSoldeTotal] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [catRes, topRes, balRes, incomeRes, countRes, txRes, evolRes] = await Promise.all([
          getMonthExpenseByCategory(),
          getTopCategories(),
          getAllAccountsByUserId(),
          getMonthIncome(),
          getMonthTransactionsCount(),
          getAllTransactions(),
          getTotalBalanceEvolution()
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
            color: generateColor(i),
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
        setBalanceHistory (evolRes.data || []);
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
      <Loading message= 'Loading dashboard...'/>
    )
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ExpensesByCategoryCard data={categoryData} />
        <BalanceEvolutionCard data={balanceHistory} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TopCategoriesCard categories={topCategories} />
        <MonthSummaryCard transactionCount={transactionCount} unreadAlerts={0} />
      </div>

      <TransactionsTable transactions={transactions} />
    </div>
  );
}