import { AArrowDown } from "lucide-react";
import Toast from "./components/Toast";
import Header from "./components/Header";
import SummaryCard from "./components/SummaryCard";
import AddExpensesForm from "./components/AddExpensesForm";
import FilterTab from "./components/FilterTab";
import ExpensesList from "./components/ExpensesList";
import { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    date: "",
    type: "income",
  });

  const [editingId, setIsEditingId] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState("all");
  const [toast, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    const toast = { id, message, type };
    setToasts((prev) => [...prev, toast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const totalIncome = expenses
    .filter((exp) => exp.type === "income")
    .reduce((acc, exp) => acc + exp, 0);
  const totalExpenses = expenses
    .filter((exp) => exp.type === "expenses")
    .reduce((acc, exp) => acc + exp.amount, 0);

  const balance = totalIncome - totalExpenses;
  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-950 p-4">
        {/* TOAST */}
        <Toast toast={toast} removeToast={removeToast} />

        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <Header />
          {/* SUMMARYCARD */}
          <SummaryCard
            balance={balance}
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
          />

          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
            {/* Add Expenses Form */}
            <div className="xl:col-span-2">
              <AddExpensesForm
                formData={formData}
                setFormData={setFormData}
                editingId={editingId}
                setIsEditingId={setIsEditingId}
                expenses={expenses}
                setExpenses={setExpenses}
                showToast={showToast}
              />
            </div>
            <div className="xl:col-span-3">
              <div className="bg-white/5 backdrop-blur-lg rounded-#xl border border-white/10 shadow-2xl overflow-hidden">
                <FilterTab />
                <ExpensesList />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
