import { AlertCircle, Plus, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";

function AddExpensesForm({
  formData,
  setFormData,
  editingId,
  setIsEditingId,
  expenses,
  setExpenses,
  showToast,
}) {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }
    if (!formData.category) {
      newErrors.category = "Amount is required";
    }
    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      showToast("Please fix the errors in the form", "error");
      return;
    }

    const expenseData = {
      ...formData,
      amount: parseFloat(formData.amount),
      id: editingId || Date.now(),
    };

    if (editingId) {
      setExpenses((prev) =>
        prev.map((exp) => (exp.id === editingId ? expenseData : exp)),
      );
      setIsEditingId(null);
      showToast("Entry updated successfully", "success");
    } else {
      setExpenses([...expenses, expenseData]);
      showToast(
        `${formData.type === "income" ? "income" : "Expense"} added successfully`,
        "success",
      );
      setFormData({
        description: "",
        amount: "",
        category: "",
        date: "",
        type: "expense",
      });
      setErrors({});
    }
  };
  const cancelEdit = () => {
    setIsEditingId(null);
    setFormData({
      description: "",
      amount: "",
      category: "",
      date: "",
      type: "expense",
    });
    setErrors({});
    showToast("Edit cancelled", "info");
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white shadow-2xl">
      <h2>
        <div className="text-xl font-bold text-white mb-8 flex items-center">
          <div className="p-2 bg-linear-to-r from-purple-500 to-pink-500 rounded-xl mr-3">
            <Plus className="w-6 h-6 text-white" />
          </div>
          {editingId ? "Edit Entry" : "Add New Entry"}
        </div>
      </h2>
      <div className="space-y-6">
        <div>
          <label
            htmlFor=""
            className="block text-gray-300 text-sm font-semibold mb-3 uppercase tracking-wide"
          >
            Entry Type
          </label>
          <div className="flex space-x-4">
            <label
              className={`flex-1 flex items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all border-gray-400/20 bg-gray-800/20 text-gray-100/50 ${formData.type === "expense" && "border-red-500 bg-red-500/30 text-white"}`}
            >
              <input
                type="radio"
                name="type"
                className="sr-only"
                value="expense"
                checked={formData.type === "expense"}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    type: e.target.value,
                    category: "",
                  });
                  setErrors({});
                }}
              />
              <TrendingDown className="w-5 h-5 mr-2" />
              <span className="font-medium">Expense</span>
            </label>
            <label
              className={`flex-1 flex items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all  border-gray-400/20 bg-gray-800/20 text-gray-100/50 ${formData.type === "income" && "border-green-500 bg-green-500/30 text-white"}`}
            >
              <input
                type="radio"
                name="type"
                className="sr-only"
                value="income"
                checked={formData.type === "income"}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    type: e.target.value,
                    category: "",
                  });
                  setErrors({});
                }}
              />
              <TrendingUp className="w-5 h-5 mr-2" />
              <span className="font-medium">Income</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-semibold mb-3 uppercase tracking-wide">
            Description
          </label>
          <input
            type="text"
            value={formData.description}
            name="description"
            onChange={(e) => {
              setFormData({
                ...formData,
                type: e.target.value,
              });
              if (errors.description) {
                setErrors({ ...errors, description: "" });
              }
            }}
            placeholder="what's this for"
            className={`w-full px-6 py-4  border-2 rounded-2xl  border-gray-400/20 bg-gray-800/20 text-white  transition-all placeholder-gray-100/50 ${errors.description && "border-red-500"}`}
          />
          {errors.description && (
            <p className="text-red-400 text-sm mt-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.description}
            </p>
          )}
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-semibold mb-3 uppercase tracking-wide">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
              $
            </span>
            <input
              type="number"
              value={formData.amount}
              name="amount"
              step="0.01"
              nChange={(e) => {
                setFormData({
                  ...formData,
                  type: e.target.value,
                });
                if (errors.amount) {
                  setErrors({ ...errors, amount: "" });
                }
              }}
              className={`w-full pl-12 pr-6 py-4  appearance-none px-6  border-2 rounded-2xl  border-gray-400/20 bg-gray-800/20 text-white  transition-all placeholder-gray-100/50 ${errors.amount && "border-red-500"}`}
              placeholder="0.00"
            />
          </div>
          {errors.amount && (
            <p className="text-red-400 text-sm mt-2 flex items-center ">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.amount}
            </p>
          )}
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-semibold mb-3 uppercase tracking-wide">
            Category
          </label>
          <select
            value={formData.category}
            name="category"
            nChange={(e) => {
              setFormData({
                ...formData,
                type: e.target.value,
              });
              if (errors.category) {
                setErrors({ ...errors, category: "" });
              }
            }}
            className={`w-full px-6 py-4 appearance-none border-2 rounded-2xl  border-gray-400/20 bg-gray-800/20   transition-all text-gray-100/50 ${errors.category && "border-red-500"}`}
          >
            <option value="">Choose Category</option>
          </select>
          {errors.category && (
            <p className="text-red-400 text-sm mt-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              Error Message
            </p>
          )}
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-semibold mb-3 uppercase tracking-wide">
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            name="date"
            nChange={(e) => {
              setFormData({
                ...formData,
                type: e.target.value,
              });
              if (errors.date) {
                setErrors({ ...errors, date: "" });
              }
            }}
            className={`w-full px-6 py-4  appearance-none   border-2 rounded-2xl  border-gray-400/20 bg-gray-800/20 text-white  transition-all placeholder-gray-100/50  ${errors.date && "border-red-500"}`}
          />
          {errors.date && (
            <p className="text-red-400 text-sm mt-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.date}
            </p>
          )}
        </div>
        <div>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 bg-linear-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {editingId ? "Update" : "Add Entry"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="px-6 py-4 border-2 border-gray-600 text-gray-300 rounded-2xl hover:bg-gray-800/50 hover:border-gray-500 transition-all duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddExpensesForm;
