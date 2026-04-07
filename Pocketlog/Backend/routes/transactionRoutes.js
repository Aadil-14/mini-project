const express = require('express');
const router = express.Router();
const { getTransactions, getSharedTransactions, addTransaction } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getTransactions).post(protect, addTransaction);
router.route('/shared').get(protect, getSharedTransactions);

module.exports = router;
