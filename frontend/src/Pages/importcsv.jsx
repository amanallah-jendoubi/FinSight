import { useEffect, useState } from "react";
import ImportFile from "../Components/importcsv/ImportFile";
import Papa from "papaparse";
import dayjs from "dayjs";
import toast from "react-hot-toast"
import { importTransactions, createTransactions } from "../api/endpoints/transactions";
import { getAllAccountsByUserId } from "../api/endpoints/accounts";
import { getAllCategories } from "../api/endpoints/categories";
import TransactionsTable from "../Components/transactions/TransactionsTable";
import Pagination from "../Components/transactions/Pagination";




export default function ImportCsv() {
  const [accounts, setAccounts] = useState ([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState ([]);
  const [stat, setStat] = useState ({ detected: 0, duplicates: 0 });
  const [fileName, setFileName] = useState (null);
  const [form, setForm] = useState("");
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const handleEdit = (id, data) => {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === id
          ? {
              ...transaction,
              date: data.date,
              description: data.description,
              amount: Number(data.amount),
              type: data.type,
              categorySource:
                data.type === "expense"
                  ? data.categoryName ?? transaction.categorySource
                  : data.source ?? transaction.categorySource,
            }
          : transaction
      )
    );
  };

  const handleDelete = (id) => {
    setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
  };

  const handleClick = async()=>{
    if (!form) setError("Select an accout first");
    else{
      try{
        const [aiRes, catRes] = await Promise.all([
          importTransactions(form, transactions),
          getAllCategories(),
        ]);
        const result = aiRes.data.transactions.map(({ category, source, ...rest }, index) => ({
          ...rest,
          id: `${Date.now()}-${index}`,
          categorySource: category ?? source,
        }));
        setTransactions(result);
        setStat ({ duplicates: aiRes.data.duplicates, detected: aiRes.data.detected });
        setShowPreview(true);
        setCategories((catRes.data || []).map((c) => c.name));
      }catch (err){
        toast.error ("Transactions already saved !")
        console.log (err.message);
      }
    }
  }

  const handleSave = async () => {
     try {
      const result = transactions.map(({ categorySource, ...rest }) => ({
        ...rest,
        categoryName: rest.type === 'expense' ? categorySource : null,
        source: rest.type === 'expense' ? null : categorySource,
      }));
      await createTransactions(form, result);
      toast.success("Transactions saved successfully!");
      setShowPreview (!showPreview)
      setFileName (null);
    }catch(err){
      toast.error("Unable to save transactions");
    }
  }





  useEffect(()=>{
    async function loadAccounts () {
      try{
        const accRes = (await getAllAccountsByUserId());
        setAccounts((accRes.data.accounts || []).map((a) => ({name:a.name,id: a.id})));
      }catch(err){
        console.log(err.message);
      }
    }
    loadAccounts();
  }, []);





  const FIELD_MAP = {
    date: [
      "Date", "Booking Date", "Value Date", "Transaction Date",
      "Operation Date", "Posting Date", "Date opération", "Date Operation",
      "Date Opération", "Date de l'opération", "Date comptable",
      "Date valeur", "Date de valeur",
    ],
    description: [
      "Description", "Operation", "Libellé", "Libelle", "Libellé opération",
      "Libelle operation", "Transaction", "Transaction Details", "Details",
      "Label", "Merchant", "Intitulé", "Nature", "Motif",
    ],
    amount: ["Amount", "Montant", "Net Amount", "Valeur"],
    debit: ["Debit", "Débit", "Withdrawal", "Sortie", "Débit (TND)", "Montant Débit", "Montant débit"],
    credit: ["Credit", "Crédit", "Deposit", "Entrée", "Crédit (TND)", "Montant Crédit", "Montant crédit"],
  };

  function getValue(row, possibleKeys) {
    for (const key of possibleKeys) {
      if (row[key] !== undefined && row[key] !== null && row[key] !== "") {
        return row[key];
      }
    }
    return undefined;
  }

  function parseNumber(value) {
    if (value === undefined || value === null || value === "") return null;
    let str = String(value).trim();
    str = str.replace(/[A-Za-z€$£₫د.تDTN]/g, "");
    str = str.replace(/\s/g, "");
    str = str.replace(",", ".");
    const number = Number(str);
    return Number.isNaN(number) ? null : number;
  }

  const onFileSelect = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async ({ data }) => {
        const trans = data.map((row) => {
          const date = getValue(row, FIELD_MAP.date) || dayjs().format("YYYY-MM-DD");
          const description = getValue(row, FIELD_MAP.description) || "";

          let amount = parseNumber(getValue(row, FIELD_MAP.amount));
          let type = "" ;//empyt string initially 

          if (amount === null) {
            const debit = parseNumber(getValue(row, FIELD_MAP.debit));
            const credit = parseNumber(getValue(row, FIELD_MAP.credit));

            if (credit !== null){
              amount = credit;
              type = 'income'
            } 
            else if (debit !== null){
              amount = debit;
              type = 'expense';
            }
            else amount = "";
          }
          return { date, description, amount, type };
        });
        setTransactions(trans);
      },
      error: (err) => {
        console.error(err);
      },
    });
  };

  return (
    <>
      {showPreview ? 
      (
        <div className="bg-slate-50 p-6 min-h-[100vh]">
          <div className="mx-auto max-w-6xl space-y-4">
            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Extracted transactions</h2>
                  <p className="text-sm text-slate-500">
                    {stat.detected} detected • {stat.duplicates} duplicates
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={ ()=>{setShowPreview(!showPreview)}}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={ handleSave }
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    Save transactions
                  </button>
                </div>
              </div>
              <TransactionsTable
                editAccount={false}
                currentPage={currentPage}
                transactions={transactions}
                categories={categories}
                accounts={accounts}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
            {(Math.ceil(transactions.length / 6) > 1) &&
              <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(transactions.length / 6)}
                  onPageChange={setCurrentPage}
                />
              </div>
            }
          </div>
        </div>
      ) : (
        <>
          <ImportFile onFileSelect={onFileSelect} fileName={fileName} setFileName={setFileName} />
          {fileName &&
            <div className="w-[60%] mx-auto">
              <div className="mt-6">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Account</label>
                <select
                  value={form}
                  onChange={(e) => {setForm(e.target.value); setError("")}}
                  className={`rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm transition-colors focus:outline-none focus:ring-2 ${
                    error
                      ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                      : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                  }`}
                >
                  <option className="w-[60%] mx-auto" value="">Select an account</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
                {error && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                    {error}
                  </p>
                )}
              </div>

              <button className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50" onClick={handleClick}>
                Show extracted transactions
              </button>
            </div>
          }
        </>
      )}
    </>
  );
}