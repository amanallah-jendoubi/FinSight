import { useEffect, useState } from "react";
import ImportFile from "../Components/importcsv/ImportFile";
import Papa from "papaparse";
import dayjs from "dayjs";
import { importTransactions } from "../api/endpoints/transactions";
import { getAllAccountsByUserId } from "../api/endpoints/accounts";


export default function ImportCsv() {
  const [accounts, setAccounts] = useState ([]);
  const [transactions, setTransactions] = useState ([]);
  const [fileName, setFileName] = useState (null);
  const [form, setForm] = useState("");
  const [error, setError] = useState("");
  const handleClick = async()=>{
    if (!form) setError("Select an accout first");
    else{
      try{
        const aiRes = await importTransactions (form, transactions) ;  // ai will autocategorize and set source and type (if type === '')
      }catch (err){
        console.log (err.message);
      }
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
              type = 'expense'
            } 
            else if (debit !== null){
              amount = debit;
              type = 'income';
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
  );
}