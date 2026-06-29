const express = require('express');
const router = express.Router();
const path = require('path');



// let react router handle everything else
router.get('/', (req, res) => {
  res.json({'message' : 'welcome in home'})
});

module.exports = router;