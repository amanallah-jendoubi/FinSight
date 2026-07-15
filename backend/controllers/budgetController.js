const bugdgetService = require('../services/budgetService');
const transactionsService = require('../services/transactionsService');
const {getUserAccountIds} = require ('./transactionsController');

const createBudget = async (req, res) => {
    try {
      const accountIds = await getUserAccountIds(req.userId);
      if (accountIds.length === 0) {
        return res.status(200).json({ message : "user has no accounts" });
      }
      const { categoryName, amount } = req.body;
      const expenses = await transactionsService.getMonthExpenseByCategory(accountIds);// [{ name: 'Food', amount: 500, value: 45.45 }, ...]
      const match = expenses.find((e) => e.name === categoryName);
      const moneySpent = match ? match.amount : 0;
      const budget = await bugdgetService.createBudget(req.userId, categoryName, amount, moneySpent);
      res.status(201).json(budget);
  } catch (err) {
    if (err.message === 'A budget for this category already exists.') {
      return res.status(409).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
};

const getAllBudgets = async (req, res) => {
  try {
    const budgets = await bugdgetService.getAllBudgetsByUserId(req.userId);
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const updateBudget = async (req, res) => {
  try {
    const { budgetId } = req.params;
    const {updatedAmount} = req.body; 
    const result = await bugdgetService.updateBudget( budgetId, updatedAmount );
    return res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const deleteBudget = async (req, res) => {
  try {
    const { budgetId } = req.params;
    await bugdgetService.deleteBudget( budgetId);
    return res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



module.exports = {
    createBudget, 
    getAllBudgets,
    updateBudget,
    deleteBudget
}