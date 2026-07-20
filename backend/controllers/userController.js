const userService = require('../services/userService');
const bcrypt = require('bcrypt');


const getUserInfo = async (req, res) => {
  try {
    const result = await userService.getUserInfo(req.userId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const updateUserInfo = async (req, res) => {
  try {
    const userId = req.userId;
    const { newPassword} = req.body;
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    const result = await userService.updateUserInfo( userId, newPasswordHash );
    return res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



module.exports = { getUserInfo, updateUserInfo }