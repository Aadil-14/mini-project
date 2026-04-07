const express = require('express');
const router = express.Router();
const { getBalances } = require('../controllers/splitController');
const { protect } = require('../middleware/authMiddleware');

router.route('/balances').get(protect, getBalances);

module.exports = router;
