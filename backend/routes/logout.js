const express = require('express');
const router = express.Router();


router.post('/', (req, res) => {
  res.clearCookie('jwt',{ httpOnly: true});
  return res.sendStatus(200);
});

module.exports = router;