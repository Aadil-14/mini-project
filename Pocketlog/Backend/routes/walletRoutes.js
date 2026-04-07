const express = require('express');
const router = express.Router();
const { getWallets, createWallet, addWalletMember, getWalletMembers, removeWalletMember } = require('../controllers/walletController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getWallets).post(protect, createWallet);
router.route('/:id/members').get(protect, getWalletMembers).post(protect, addWalletMember);
router.route('/:id/members/:memberId').delete(protect, removeWalletMember);

module.exports = router;
