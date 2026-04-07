const pool = require('../config/db');

// @desc    Get split balances for the user across all shared wallets
// @route   GET /api/split/balances
// @access  Private
const getBalances = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // 1. Get all wallets the user belongs to (owned or joined) where type = 'shared'
        const walletsRes = await pool.query(`
            SELECT w.id, w.name, w.created_by 
            FROM wallets w
            LEFT JOIN wallet_members wm ON w.id = wm.wallet_id
            WHERE (w.created_by = $1 OR wm.user_id = $1) AND w.type = 'shared'
        `, [userId]);
        
        const sharedWallets = walletsRes.rows;
        const balances = [];

        // 2. Mathematically crunch each shared wallet
        for (let wallet of sharedWallets) {
            // Get all members of this specific wallet (including the owner)
            const membersRes = await pool.query(`
                SELECT u.id AS user_id, u.name 
                FROM users u
                JOIN wallet_members wm ON u.id = wm.user_id
                WHERE wm.wallet_id = $1
                UNION
                SELECT u.id AS user_id, u.name
                FROM users u
                JOIN wallets w ON u.id = w.created_by
                WHERE w.id = $1
            `, [wallet.id]);
            
            const members = membersRes.rows;
            const memberCount = members.length;
            
            if (memberCount <= 1) {
                // Cannot split expenses with yourself
                balances.push({ id: wallet.id, name: wallet.name, balance: 0, owes: [], owedBy: [] });
                continue;
            }

            // Get all split-eligible expenses in this wallet
            const txsRes = await pool.query(`
                SELECT paid_by, amount 
                FROM transactions 
                WHERE wallet_id = $1 AND type = 'expense'
            `, [wallet.id]);
            const transactions = txsRes.rows;

            // Greedy Resolution Setup
            const memberBalances = {};
            members.forEach(m => {
                memberBalances[m.user_id] = { id: m.user_id, name: m.name, balance: 0 };
            });

            // Calculate total credits & debits
            for (let tx of transactions) {
                const amount = parseFloat(tx.amount);
                const splitAmount = amount / memberCount;
                
                if (memberBalances[tx.paid_by]) {
                    memberBalances[tx.paid_by].balance += amount;
                }
                
                members.forEach(m => {
                    memberBalances[m.user_id].balance -= splitAmount;
                });
            }

            const debtors = [];
            const creditors = [];

            Object.values(memberBalances).forEach(m => {
                if (m.balance > 0.01) creditors.push({ ...m });
                if (m.balance < -0.01) debtors.push({ ...m });
            });

            // Settle largest debts to largest creditors first
            creditors.sort((a, b) => b.balance - a.balance);
            debtors.sort((a, b) => a.balance - b.balance);

            const settlements = [];

            let i = 0; // debtors index
            let j = 0; // creditors index

            while(i < debtors.length && j < creditors.length){
                let debtor = debtors[i];
                let creditor = creditors[j];
                
                let amount = Math.min(Math.abs(debtor.balance), creditor.balance);
                
                settlements.push({
                    from: debtor.id,
                    fromName: debtor.name,
                    to: creditor.id,
                    toName: creditor.name,
                    amount: Math.round(amount * 100) / 100
                });
                
                debtor.balance += amount;
                creditor.balance -= amount;
                
                if (Math.abs(debtor.balance) < 0.01) i++;
                if (creditor.balance < 0.01) j++;
            }

            const owes = settlements.filter(s => s.from == userId);
            const owedBy = settlements.filter(s => s.to == userId);
            const myNetBalance = memberBalances[userId] ? memberBalances[userId].balance : 0;
            
            balances.push({
                id: wallet.id,
                name: wallet.name,
                balance: myNetBalance,
                owes,
                owedBy
            });
        }

        res.json(balances);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error calculating balances' });
    }
};

module.exports = { getBalances };
