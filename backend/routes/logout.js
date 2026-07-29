const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Log out a user
 */
router.post('/', async(req, res) => {
  try{
    if (req.userId){
      const result = await userService.deleteUserRefreshToken(req.userId);
    }
    res.clearCookie('jwt',{ httpOnly: true});
  }catch{}
  return res.sendStatus(200);
});

module.exports = router;