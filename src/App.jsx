import { AArrowDown } from "lucide-react";
import Toast from "./components/Toast";
import Header from "./components/Header";
import SummaryCard from "./components/SummaryCard";
import AddExpensesForm from "./components/AddExpensesForm";
import FilterTab from "./components/FilterTab";
import ExpensesList from "./components/ExpensesList";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    const savedExpenses = JSON.parse(localStorage.getItem("expenses"));
    if (savedExpenses) {
      setExpenses(savedExpenses);
    }
  }, []);

  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem("expenses", JSON.stringify(expenses));
    }
  }, [expenses]);

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
  console.log(expenses)

  const totalIncome = expenses
    .filter((exp) => exp.type === "income")
    .reduce((acc, exp) => acc + exp.amount, 0);

  const totalExpenses = expenses
    .filter((exp) => exp.type === "expense")
    .reduce((acc, exp) => acc + exp.amount, 0);

  const balance = totalIncome - totalExpenses;
  const filteredExpenses = expenses.filter((exp) => {
    if (filter === "all") {
      return true;
    }
    return exp.type === filter;
  });

  const handleEdit = (expense) => {
    setExpenses({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date,
      type: expense.type,
    });
    setIsEditingId(expense.id);
    showToast("Entry loaded for editing", "info");
  };
  const handleDelete = (id) => {
    const expenseToDelete = expenses.find((expense) => expense.id === id);
    setExpenses(expenses.filter((exp) => exp.id !== id));
    showToast(
      `${expenseToDelete?.type === "income" ? "Income" : "Expense"} deleted sucessfully`,
      "error",
    );
  };
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
                <FilterTab filter={filter} setFilter={setFilter} />
                <ExpensesList
                  filteredExpenses={filteredExpenses}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
