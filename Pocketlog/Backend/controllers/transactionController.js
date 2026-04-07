const pool = require('../config/db');

// @desc    Get user transactions
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
    try {
        // Get ONLY personal transactions the user owns
        const result = await pool.query(`
            SELECT DISTINCT t.*, w.name as wallet_name 
            FROM transactions t
            JOIN wallets w ON t.wallet_id = w.id
            WHERE w.created_by = $1 AND w.type = 'personal'
            ORDER BY t.created_at DESC
        `, [req.user.id]);
        
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching transactions' });
    }
};

// @desc    Add a new transaction
// @route   POST /api/transactions
// @access  Private
const addTransaction = async (req, res) => {
    const { wallet_id, amount, type, category, description } = req.body;

    if (!wallet_id || !amount || !type) {
        return res.status(400).json({ message: 'Please provide wallet_id, amount, and type' });
    }

    try {
        // Security check - verify ownership or membership
        const walletResult = await pool.query(`
            SELECT w.* FROM wallets w 
            LEFT JOIN wallet_members wm ON w.id = wm.wallet_id 
            WHERE w.id = $1 AND (w.created_by = $2 OR wm.user_id = $2)
        `, [wallet_id, req.user.id]);
        
        if (walletResult.rows.length === 0) {
            return res.status(403).json({ message: 'Not authorized for this wallet' });
        }

        const wallet = walletResult.rows[0];

        // Shared Wallets Guard
        if (wallet.type === 'shared' && type === 'income') {
            return res.status(400).json({ message: 'Income transactions are not allowed in Shared Wallets' });
        }

        const result = await pool.query(
            'INSERT INTO transactions (wallet_id, paid_by, amount, type, category, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [wallet_id, req.user.id, amount, type, category || null, description || null]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error creating transaction' });
    }
};

// @desc    Get user shared transactions
// @route   GET /api/transactions/shared
// @access  Private
const getSharedTransactions = async (req, res) => {
    try {
        // Get user transactions from owned OR joined shared wallets
        const result = await pool.query(`
            SELECT DISTINCT t.*, w.name as wallet_name 
            FROM transactions t
            JOIN wallets w ON t.wallet_id = w.id
            LEFT JOIN wallet_members wm ON w.id = wm.wallet_id
            WHERE (w.created_by = $1 OR wm.user_id = $1) AND w.type = 'shared'
            ORDER BY t.created_at DESC
        `, [req.user.id]);
        
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching shared transactions' });
    }
};

module.exports = { getTransactions, getSharedTransactions, addTransaction };
