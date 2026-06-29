const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  res.json({'message' : 'Bye Bye'})
});

module.exports = router;