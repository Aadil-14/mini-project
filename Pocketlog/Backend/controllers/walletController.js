const pool = require('../config/db');

// @desc    Get all wallets for logged in user (owned & joined)
// @route   GET /api/wallets
// @access  Private
const getWallets = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT DISTINCT w.* 
            FROM wallets w
            LEFT JOIN wallet_members wm ON w.id = wm.wallet_id
            WHERE w.created_by = $1 OR wm.user_id = $1
            ORDER BY w.created_at DESC
        `, [req.user.id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching wallets' });
    }
};

// @desc    Create a new wallet
// @route   POST /api/wallets
// @access  Private
const createWallet = async (req, res) => {
    const { name, type, members } = req.body;

    if (!name || !type) {
        return res.status(400).json({ message: 'Please provide a name and type' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO wallets (name, type, created_by) VALUES ($1, $2, $3) RETURNING *',
            [name, type, req.user.id]
        );
        const newWallet = result.rows[0];

        // Safely process incoming members array
        if (type === 'shared' && Array.isArray(members) && members.length > 0) {
            for (let member_id of members) {
                if (member_id == req.user.id) continue; // Prevent adding self to members table
                
                try {
                    const userExists = await pool.query('SELECT id FROM users WHERE id = $1', [member_id]);
                    if (userExists.rows.length > 0) {
                        await pool.query(
                            'INSERT INTO wallet_members (wallet_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                            [newWallet.id, member_id]
                        );
                    }
                } catch(e) {
                    console.error("Failed to add specific member ID: ", member_id, e);
                }
            }
        }

        res.status(201).json(newWallet);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error creating wallet' });
    }
};

// @desc    Add member to shared wallet
// @route   POST /api/wallets/:id/members
// @access  Private (Owner only)
const addWalletMember = async (req, res) => {
    const { member_id } = req.body;
    const wallet_id = req.params.id;

    if (!member_id) return res.status(400).json({ message: 'Provide a User Number' });

    try {
        const wallet = await pool.query('SELECT * FROM wallets WHERE id = $1 AND created_by = $2', [wallet_id, req.user.id]);
        if (wallet.rows.length === 0) return res.status(403).json({ message: 'Only the wallet owner can add members' });

        const userExists = await pool.query('SELECT id, name FROM users WHERE id = $1', [member_id]);
        if (userExists.rows.length === 0) return res.status(404).json({ message: 'User Number not found' });

        const existing = await pool.query('SELECT * FROM wallet_members WHERE wallet_id = $1 AND user_id = $2', [wallet_id, member_id]);
        if (existing.rows.length > 0) return res.status(400).json({ message: 'User is already a member' });

        // Insert new member
        await pool.query(
            'INSERT INTO wallet_members (wallet_id, user_id) VALUES ($1, $2)',
            [wallet_id, member_id]
        );

        res.status(200).json({ message: 'Member added successfully!', user: userExists.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error adding member' });
    }
};

// @desc    Get members of a wallet
// @route   GET /api/wallets/:id/members
// @access  Private
const getWalletMembers = async (req, res) => {
    const wallet_id = req.params.id;
    try {
        // Ensure user has access
        const accessCheck = await pool.query(`
            SELECT id FROM wallets w
            LEFT JOIN wallet_members wm ON w.id = wm.wallet_id
            WHERE w.id = $1 AND (w.created_by = $2 OR wm.user_id = $2)
        `, [wallet_id, req.user.id]);
        
        if (accessCheck.rows.length === 0) return res.status(403).json({ message: 'Access denied' });

        const members = await pool.query(`
            SELECT u.id AS user_id, u.name, u.email, 'member' AS role 
            FROM users u
            JOIN wallet_members wm ON u.id = wm.user_id
            WHERE wm.wallet_id = $1
            UNION
            SELECT u.id AS user_id, u.name, u.email, 'owner' AS role
            FROM users u
            JOIN wallets w ON u.id = w.created_by
            WHERE w.id = $1
        `, [wallet_id]);

        res.json(members.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error grabbing members' });
    }
};

// @desc    Remove member from shared wallet
// @route   DELETE /api/wallets/:id/members/:memberId
// @access  Private (Owner only)
const removeWalletMember = async (req, res) => {
    const wallet_id = req.params.id;
    const member_id = req.params.memberId;

    try {
        const wallet = await pool.query('SELECT * FROM wallets WHERE id = $1 AND created_by = $2', [wallet_id, req.user.id]);
        if (wallet.rows.length === 0) return res.status(403).json({ message: 'Only wallet owners can remove members' });

        if (member_id == req.user.id) return res.status(400).json({ message: 'Cannot remove the owner' });

        await pool.query('DELETE FROM wallet_members WHERE wallet_id = $1 AND user_id = $2', [wallet_id, member_id]);
        
        res.status(200).json({ message: 'Member removed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error removing member' });
    }
};

module.exports = { getWallets, createWallet, addWalletMember, getWalletMembers, removeWalletMember };
