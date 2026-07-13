const transactionsService = require('../services/transactionsService');
const accountService = require('../services/accountService');
const {predictCategoriesBatch} = require('../services/mlService.js');





// shared helper function 
async function getUserAccountIds(userId) {
  const accountData = await accountService.getAllAccountsByUserId(userId);
  return accountData.accounts.map(account => account.id);
}

async function createTransaction(req, res) {
  try {
    const { accountId } = req.params;
    const { amount, date, description, type, source, categoryName} = req.body;

    if (!amount || (type === 'income' ? !source : !categoryName)) {
      return res.status(400).json({ error: 'required fields missing' });
    }

    const newTransaction = await transactionsService.createTransaction({
      accountId,
      amount,
      date,
      description,
      type,
      source,
      categoryName
    });

    return res.status(201).json(newTransaction); 
  } catch (error) {
    return res.status(500).json({message : "Transaction creation failed"});
  }
}
async function updateTransaction(req, res) {
  try {
    const { transactionId } = req.params;
    const { accountId, amount, date, description, type, source, categoryName } = req.body;
    const updatedTransaction = await transactionsService.updateTransaction(transactionId, {
      accountId,
      amount,
      date,
      description,
      type,
      source,
      categoryName
    });
    return res.status(200).json(updatedTransaction);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}


async function getAllTransactions(req, res) {
  try {
    const  userId  = req.userId;
    const accountIds  = await getUserAccountIds(userId);    
    if (accountIds.length === 0) { 
      return res.status(200).json({message : "user has no accounts"});
    }
    
    const transactions = await transactionsService.getAllTransactions(accountIds);
    return res.status(200).json(transactions);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getMonthTransactionsCount(req, res) {
  try {
    const  userId  = req.userId;
    const accountIds = await getUserAccountIds(userId);

    if (accountIds.length === 0) {
      return res.status(200).json({message : "user has no accounts"});
    }

    const count = await transactionsService.getMonthTransactionsCount(accountIds);
    return res.status(200).json({ count });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}



async function getMonthExpense(req, res) {
  try {
    const { accountId } = req.params;
    const userId = req.userId;

    let accountIds;

    if (accountId) {
      accountIds = [accountId];
    } else {
      accountIds = await getUserAccountIds(userId);
    }

    if (accountIds.length === 0) {
      return res.status(200).json({ message : "user has no accounts" });
    }

    const total = await transactionsService.getMonthExpense(accountIds);
    return res.status(200).json({ total });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}


async function getMonthIncome(req, res) {
  try {
    const { accountId } = req.params;
    const userId = req.userId;

    let accountIds;

    if (accountId) {
      accountIds = [accountId];
    } else {
      accountIds = await getUserAccountIds(userId);
    }

    if (accountIds.length === 0) {
      return res.status(200).json({ message : "user has no accounts" });
    }

    const total = await transactionsService.getMonthIncome(accountIds);
    return res.status(200).json({ total });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}


async function getTopCategories(req, res) {
  try {
    const userId = req.userId;

    const accountIds = await getUserAccountIds(userId);

    if (accountIds.length === 0) {
      return res.status(200).json({message : "user has no accounts"});
    }

    const topCategories = await transactionsService.getTopCategories(accountIds);
    return res.status(200).json(topCategories);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}



async function getMonthExpenseByCategory (req, res) {
  try {
    const { accountId } = req.params;
    const userId = req.userId;

    let accountIds;

    if (accountId) {
      accountIds = [accountId];
    } else {
      accountIds = await getUserAccountIds(userId);
    }

    if (accountIds.length === 0) {
      return res.status(200).json({ message : "user has no accounts" });
    }

    const result = await transactionsService.getMonthExpenseByCategory(accountIds);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}


async function deleteTransaction (req, res){
  const {transactionId} = req.params;
  const {type} = req.query;
  try{
    const result = await transactionsService.deleteTransaction({transactionId, type});
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}


async function importTransactions(req, res) {
  const { accountId } = req.params;
  const transactions = req.body;

  try {
    const filteredTransactions = await transactionsService.filterNewTransactions({ accountId, transactions });

    const transactionsPayload = filteredTransactions.map(t => ({
      description: t.description,
      type: t.type 
    }));

    const data  = await predictCategoriesBatch(transactionsPayload);
    // data.results: [{ description, type, type_guessed, category, confidence, source }]

    const enrichedTransactions = filteredTransactions.map((t, i) => ({
      ...t,
      type: data.results[i].type,
      category: data.results[i].category,
      source: data.results[i].source,
    }));


    return res.status(200).json({
      detected: transactions.length,
      duplicates : transactions.length - filteredTransactions.length,
      transactions : enrichedTransactions
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}



module.exports = {
  createTransaction,
  getAllTransactions,
  getMonthTransactionsCount,
  getMonthExpense,
  getMonthIncome,
  getTopCategories,
  getMonthExpenseByCategory,
  deleteTransaction,
  updateTransaction,
  importTransactions
};


























