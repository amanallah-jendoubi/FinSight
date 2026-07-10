const accountService = require('../services/accountService');

const createAccount = async (req, res) => {
  try {
    const { balance, bankName, name } = req.body;
    const account = await accountService.createAccount(req.userId, balance, bankName, name);
    res.status(201).json(account);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const getAccountInfo = async (req, res) => {
  try {
    const account = await accountService.getAccountById(req.params.accountId);
    res.json(account);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getAllAccounts = async (req, res) => {
  try {
    const summary = await accountService.getAllAccountsByUserId(req.userId);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
    createAccount,
    getAccountInfo,
    getAllAccounts
}