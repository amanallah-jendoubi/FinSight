import { useMemo, useState, useEffect } from "react";
import dayjs from "dayjs";
import toast from "react-hot-toast"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import FilterBar from "../Components/transactions/FilterBar";
import SearchBar from "../Components/transactions/SearchBar";
import TransactionsTable from "../Components/transactions/TransactionsTable";
import Pagination from "../Components/transactions/Pagination";
import { getAllTransactions, deleteTransaction, updateTransaction, createTransaction } from "../api/endpoints/transactions";
import { getAllCategories } from "../api/endpoints/categories";
import {getAllAccountsByUserId} from "../api/endpoints/accounts";
import Loading from '../Components/Loading';


dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const INITIAL_FILTERS = {
  dateStart: dayjs().startOf('month').format('YYYY-MM-DD'),
  dateEnd: dayjs().endOf('month').format('YYYY-MM-DD'),
  category: "All",
  type: "All",
  minAmount: "",
  maxAmount: "",
};

export default function TransactionsDashboard() {
  const [transactions, setTransactions] = useState([]); 
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState ([]);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(INITIAL_FILTERS); // only updates on "Filtrer" click
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [txRes, catRes, accRes] = await Promise.all([
          getAllTransactions(),
          getAllCategories(),
          getAllAccountsByUserId()
        ]);

        const transactionsData = (txRes.data || []).map((item) => ({
          id: item.id,
          date: item.date,
          description: item.description,
          categorySource: item.categoryname ?? item.source,
          type: item.type,
          accountId: item.accountid,
          amount: Number(item.amount),
        }));
        setTransactions(transactionsData);
        setAccounts((accRes.data.accounts || []).map((a) => ({name:a.name,id : a.id})));
        setCategories((catRes.data || []).map((c) => c.name));
      } catch (err) {
        console.error("Failed to load dashboard", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const handleFilterChange = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const handleReset = () => {
    setFilters(INITIAL_FILTERS);
    setAppliedFilters(INITIAL_FILTERS);
    setSearch("");
    setCurrentPage(1);
  };

  const handleDelete = async (id, type) => {
    try {
      const deletedTransaction = await deleteTransaction(id, type);
      setTransactions(prev => prev.filter(transaction => transaction.id !== id));
      toast.success("Transaction deleted successfully!");
    }catch(err){
      toast.error("Transaction creation failed");
    }
  } 

  const handleSubmit = async(accountId, data) =>{
    try {
      const response = (await createTransaction(accountId, data)).data;
      const normalized = {
        id: response.id,
        date: response.date,
        description: response.description,
        categorySource: response.categoryname ?? response.source,
        type: response.type,
        amount: Number(response.amount),
        accountId: response.accountid,
      };
    setTransactions (prev => [...prev, normalized]);
      toast.success("Transaction created successfully!");
    }catch(err){
      toast.error("Transaction creation failed");
    }
  }




const handleEdit = async (id, data) => {
  try {
    const updated = (await updateTransaction(id, data)).data;
    const normalized = {
      id: updated.id,
      date: updated.date,
      description: updated.description,
      categorySource: updated.categoryname ?? updated.source,
      type: updated.type,
      amount: Number(updated.amount),
      accountId: updated.accountid,
    };
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? normalized : t))
    );
    toast.success("Transaction updated successfully!");
  } catch (err) {
    toast.error(err.message)
  }
};

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  };

  const visibleTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase());

      const txDate = dayjs(t.date);
      const matchesDateStart =
        !appliedFilters.dateStart || txDate.isSameOrAfter(dayjs(appliedFilters.dateStart), "day");
      const matchesDateEnd =
        !appliedFilters.dateEnd || txDate.isSameOrBefore(dayjs(appliedFilters.dateEnd), "day");

      const matchesCategory =
        appliedFilters.category === "All" || t.categorySource === appliedFilters.category;

      const matchesType =
        appliedFilters.type === "All" || t.type === appliedFilters.type.toLowerCase();

      const matchesMinAmount =
        appliedFilters.minAmount === "" || t.amount >= Number(appliedFilters.minAmount);
      const matchesMaxAmount =
        appliedFilters.maxAmount === "" || t.amount <= Number(appliedFilters.maxAmount);

      return (
        matchesSearch &&
        matchesDateStart &&
        matchesDateEnd &&
        matchesCategory &&
        matchesType &&
        matchesMinAmount &&
        matchesMaxAmount
      );
    });
  }, [transactions, search, appliedFilters, currentPage]);

  if (loading) {
    return (
      <Loading message= 'Loading transactions...'/>
    )
  }

  return (
    <div className="bg-slate-50 p-6 h-[100vh]">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <FilterBar filters={filters} categories={categories} accounts = {accounts} onChange={handleFilterChange} onFilter={handleApplyFilters} handleSubmit = {handleSubmit} />
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <SearchBar value={search} onChange={setSearch} onReset={handleReset} />
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <TransactionsTable
            currentPage = {currentPage}
            transactions={visibleTransactions}
            categories = {categories}
            accounts = {accounts}
            onEdit={ handleEdit }
            onDelete={ handleDelete }
          />
        </div>
        { (Math.ceil(visibleTransactions.length / 6) > 1) && 
          <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(visibleTransactions.length / 6)}
              onPageChange={setCurrentPage}
            />
          </div>
        }
      </div>
    </div>
  );
}