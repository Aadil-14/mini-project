import React, { useState, useEffect } from 'react';
import { Plus, CreditCard, UserPlus, TrendingUp, TrendingDown, Wallet, Users } from 'lucide-react';
import axios from 'axios';

import Modal from '../components/common/Modal';
import TransactionHistory from '../components/dashboard/TransactionHistory';
import SharedWallets from '../components/dashboard/SharedWallets';

const Home = () => {
    const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
    const [transactionType, setTransactionType] = useState('expense');
    const [isAddWalletOpen, setIsAddWalletOpen] = useState(false);
    const [isTransactionsOpen, setIsTransactionsOpen] = useState(false);
    const [isSharedTransactionsOpen, setIsSharedTransactionsOpen] = useState(false);
    const [wallets, setWallets] = useState([]);
    const [personalTransactions, setPersonalTransactions] = useState([]);
    
    // Add Wallet Flow State
    const [walletType, setWalletType] = useState('personal');
    const [invitees, setInvitees] = useState([]);
    const [inviteInput, setInviteInput] = useState('');

    const [sharedWallets, setSharedWallets] = useState([]);
    
    // Calculate total dynamically on render
    const totalOwed = sharedWallets.reduce((acc, wallet) => acc + wallet.balance, 0); 
    const absTotalOwed = Math.abs(totalOwed);

    // Calculate dynamic personal items 
    const totalIncome = personalTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        
    const totalExpense = personalTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        
    const myBalance = totalIncome - totalExpense;

    useEffect(() => {
        const fetchWalletsAndBalances = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const headers = { Authorization: `Bearer ${token}` };

                // Fetch basic personal wallets
                const res = await axios.get('http://127.0.0.1:5000/api/wallets', { headers });
                setWallets(res.data);
                
                // Fetch authentic personal transaction ledgers for math module
                const txRes = await axios.get('http://127.0.0.1:5000/api/transactions', { headers });
                setPersonalTransactions(txRes.data);

                // Fetch mathematical splits for the dashboard widgets
                const splitRes = await axios.get('http://127.0.0.1:5000/api/split/balances', { headers });
                setSharedWallets(splitRes.data);

            } catch (error) {
                console.error('Error fetching dashboard data', error);
            }
        };
        fetchWalletsAndBalances();
    }, []);

    const handleAddTransaction = async (e) => {
        e.preventDefault();
        const amount = e.target.amount.value;
        const wallet_id = e.target.wallet_id.value;
        const description = e.target.description ? e.target.description.value : e.target.source?.value;
        const category = e.target.category ? e.target.category.value : null;

        if (!amount || !wallet_id) {
            alert("Please fill amount and select a wallet.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://127.0.0.1:5000/api/transactions', {
                wallet_id,
                amount,
                type: transactionType,
                category,
                description
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsAddTransactionOpen(false);
            alert(`${transactionType === 'expense' ? 'Expense' : 'Income'} Added!`);
            window.location.reload(); // Quick refresh to show new data on dashboard
        } catch (error) {
            console.error('Error adding transaction', error);
            alert('Failed to add transaction');
        }
    };

    const handleAddInvitee = () => {
        const id = parseInt(inviteInput.trim());
        if (id && !isNaN(id) && id !== parseInt(userDetails.id)) {
            setInvitees([...new Set([...invitees, id])]);
            setInviteInput('');
        }
    };
    
    const handleRemoveInvitee = (id) => {
        setInvitees(invitees.filter(i => i !== id));
    };

    const handleAddWallet = async (e) => {
        e.preventDefault();
        const name = e.target.walletName.value;

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://127.0.0.1:5000/api/wallets', {
                name,
                type: walletType,
                members: invitees
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setWallets([res.data, ...wallets]);
            
            setIsAddWalletOpen(false);
            setWalletType('personal');
            setInvitees([]);
            setInviteInput('');
            
            if (walletType === 'shared') {
                window.location.reload(); // Refresh dash widgets automatically
            } else {
                alert('Wallet Created!');
            }
        } catch (error) {
            console.error('Error adding wallet', error);
            alert('Failed to create wallet');
        }
    };

    // Extract user details natively from token
    const token = localStorage.getItem('token');
    let userDetails = { id: '?', name: 'Traveller' };
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload && payload.user) {
                userDetails = payload.user;
            } else {
                userDetails.id = payload.id || '?';
                userDetails.name = payload.name || 'Traveller';
            }
        } catch(e) {}
    }

    return (
        <div className="max-w-6xl mx-auto">
            <header className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 mb-8">
                <div>
                    <h1 className="text-3xl text-gray-800 mb-1 font-semibold flex items-center gap-3">
                        Hi {userDetails.name} 👋
                        <span className="hidden sm:inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-700 text-sm font-bold px-3 py-1 rounded-full border border-indigo-200">
                            User #{userDetails.id}
                        </span>
                    </h1>
                    <p className="text-gray-500 text-base">Ready to manage your expenses?</p>
                </div>
                <button className="btn btn-primary flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors w-full md:w-auto justify-center" onClick={() => setIsAddTransactionOpen(true)}>
                    <Plus size={18} />
                    Add Transaction
                </button>
            </header>

            {/* Summary Cards */}
            <section className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 mb-8">
                <div
                    className="relative overflow-hidden border border-white/60 bg-gradient-to-br from-white/90 to-white/40 rounded-2xl p-6 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 cursor-pointer"
                    onClick={() => setIsTransactionsOpen(true)}
                >
                    <div className="flex justify-between items-center mb-4 text-gray-500 text-sm font-medium">
                        <span>My Balance</span>
                        <div className="text-indigo-600 bg-indigo-100 p-1 rounded-lg w-7 h-7 flex items-center justify-center">
                            <Wallet size={20} />
                        </div>
                    </div>
                    <h2 className={`text-3xl font-bold mb-2 ${myBalance < 0 ? 'text-rose-600' : 'text-gray-800'}`}>₹{myBalance.toLocaleString()}</h2>
                    <div className="flex items-center gap-2 text-sm">
                        <TrendingUp size={16} className="text-indigo-500" />
                        <span className="text-indigo-500">Tap for income/expense details</span>
                    </div>
                </div>

                <div
                    className="relative overflow-hidden border border-white/60 bg-gradient-to-br from-white/90 to-white/40 rounded-2xl p-6 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 cursor-pointer flex flex-col justify-between"
                    onClick={() => setIsSharedTransactionsOpen(true)}
                >
                    <div className="flex justify-between items-start mb-4 text-gray-500 text-sm font-medium">
                        <span>Owed Balance</span>
                        <div className="flex">
                            <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white -ml-2 first:ml-0 flex items-center justify-center text-[0.6rem] text-white font-bold">A</div>
                            <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white -ml-2 first:ml-0 flex items-center justify-center text-[0.6rem] text-white font-bold">B</div>
                        </div>
                    </div>
                    <div>
                        <h2 className={`text-3xl font-bold mb-2 ${totalOwed < 0 ? 'text-rose-600' : totalOwed > 0 ? 'text-emerald-600' : 'text-gray-800'}`}>
                            ₹{absTotalOwed.toLocaleString()}
                        </h2>
                        <div className="flex items-center gap-2 text-sm mt-auto">
                            <span className="text-gray-500 text-xs font-medium">
                                {totalOwed < 0 ? 'Overall, you owe money' : totalOwed > 0 ? 'Overall, you are owed money' : 'All accounts settled'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="relative overflow-hidden border border-white/60 bg-gradient-to-br from-white/90 to-white/40 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-4 text-gray-500 text-sm font-medium">
                        <span>This Month Spend</span>
                        <div className="w-4 h-4 rounded-full bg-rose-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">₹1,950</h2>
                    <div className="flex items-center gap-2 text-sm">
                        <TrendingDown size={16} className="text-emerald-500" />
                        <span className="text-emerald-500">10% less than last month</span>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
                {/* Recent Activity */}
                <TransactionHistory />

                {/* Shared Wallets */}
                <SharedWallets />
            </div>

            <Modal
                isOpen={isAddTransactionOpen}
                onClose={() => setIsAddTransactionOpen(false)}
                title="Add New Transaction"
            >
                <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
                    <button
                        type="button"
                        className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${transactionType === 'expense' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setTransactionType('expense')}
                    >
                        Expense
                    </button>
                    <button
                        type="button"
                        className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${transactionType === 'income' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setTransactionType('income')}
                    >
                        Income
                    </button>
                </div>

                <form onSubmit={handleAddTransaction} className="flex flex-col gap-4">
                    <div>
                        <label className="block mb-2 font-medium">Amount</label>
                        <input
                            type="number"
                            name="amount"
                            placeholder="0.00"
                            className="w-full p-3 rounded-lg border border-gray-200 text-xl"
                            required
                        />
                    </div>
                    {transactionType === 'income' && (
                        <>
                            <div>
                                <label className="block mb-2 font-medium">Source</label>
                                <input
                                    type="text"
                                    name="source"
                                    placeholder="e.g. Salary, Freelance"
                                    className="w-full p-3 rounded-lg border border-gray-200"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 font-medium">Date</label>
                                <input
                                    type="date"
                                    className="w-full p-3 rounded-lg border border-gray-200"
                                />
                            </div>
                        </>
                    )}
                    {transactionType === 'expense' && (
                        <>
                            <div>
                                <label className="block mb-2 font-medium">Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    placeholder="What is this for?"
                                    className="w-full p-3 rounded-lg border border-gray-200"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 font-medium">Category</label>
                                <select name="category" className="w-full p-3 rounded-lg border border-gray-200 bg-white">
                                    <option>Food & Dining</option>
                                    <option>Transportation</option>
                                    <option>Shopping</option>
                                    <option>Entertainment</option>
                                </select>
                            </div>
                        </>
                    )}
                    {transactionType === 'income' && (
                        <div>
                            <label className="block mb-2 font-medium">Description</label>
                            <input
                                type="text"
                                name="description"
                                placeholder="Additional details (optional)"
                                className="w-full p-3 rounded-lg border border-gray-200"
                            />
                        </div>
                    )}
                    <div>
                        <label className="block mb-2 font-medium">Wallet</label>
                        <select name="wallet_id" className="w-full p-3 rounded-lg border border-gray-200 bg-white" required>
                            <option value="">Select a wallet...</option>
                            {wallets
                                .filter(w => transactionType === 'expense' || w.type !== 'shared')
                                .map(w => (
                                <option key={w.id} value={w.id}>{w.name} ({w.type})</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="mt-4 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold">
                        Add {transactionType === 'expense' ? 'Expense' : 'Income'}
                    </button>
                </form>
            </Modal>

            <Modal
                isOpen={isAddWalletOpen}
                onClose={() => setIsAddWalletOpen(false)}
                title="Create New Wallet"
            >
                <form onSubmit={handleAddWallet} className="flex flex-col gap-4">
                    <div>
                        <label className="block mb-2 font-medium">Wallet Name</label>
                        <input
                            type="text"
                            name="walletName"
                            placeholder="e.g. Summer Trip"
                            className="w-full p-3 rounded-lg border border-gray-200"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">Type</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="type" checked={walletType === 'personal'} onChange={() => setWalletType('personal')} /> Personal
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="type" checked={walletType === 'shared'} onChange={() => setWalletType('shared')} /> Shared
                            </label>
                        </div>
                    </div>
                    
                    {walletType === 'shared' && (
                        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                            <label className="block mb-1 text-sm font-bold text-indigo-900">Add Members (Optional)</label>
                            <p className="text-xs text-indigo-700 mb-3">Invite friends immediately using their User Number.</p>
                            <div className="flex gap-2">
                                <input 
                                    type="number"
                                    value={inviteInput}
                                    onChange={(e) => setInviteInput(e.target.value)}
                                    placeholder="Friend's User #"
                                    className="flex-1 p-2.5 rounded-lg border border-indigo-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                />
                                <button type="button" onClick={handleAddInvitee} className="bg-indigo-600 text-white px-4 rounded-lg text-sm font-semibold hover:bg-indigo-700">Add</button>
                            </div>
                            
                            {invitees.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {invitees.map(inv => (
                                        <div key={inv} className="bg-white border border-indigo-200 px-3 py-1.5 rounded-full text-xs font-semibold text-indigo-800 flex items-center gap-2 shadow-sm">
                                            User #{inv}
                                            <button type="button" onClick={() => handleRemoveInvitee(inv)} className="text-rose-500 hover:text-rose-700 text-sm font-bold">&times;</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    
                    <button type="submit" className="mt-2 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold">
                        Create Wallet
                    </button>
                </form>
            </Modal>

            <Modal
                isOpen={isTransactionsOpen}
                onClose={() => setIsTransactionsOpen(false)}
                title="Balance Breakdown"
            >
                <div className="flex flex-col gap-6">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex items-center justify-between cursor-default">
                        <div>
                            <p className="text-emerald-700 font-semibold mb-1">Total Income</p>
                            <h3 className="text-3xl font-bold text-emerald-600">₹{totalIncome.toLocaleString()}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl border border-emerald-200 bg-emerald-100/50 flex flex-col items-center justify-center text-emerald-600">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    
                    <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 flex items-center justify-between cursor-default">
                        <div>
                            <p className="text-rose-700 font-semibold mb-1">Total Expenses</p>
                            <h3 className="text-3xl font-bold text-rose-600">₹{totalExpense.toLocaleString()}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl border border-rose-200 bg-rose-100/50 flex flex-col items-center justify-center text-rose-600">
                            <TrendingDown size={24} />
                        </div>
                    </div>
                    
                    <div className="mt-2 pt-4 border-t border-gray-100 flex justify-between items-center px-2">
                        <span className="font-bold text-gray-600 text-lg">Net Standing</span>
                        <span className={`font-bold text-2xl ${myBalance < 0 ? 'text-rose-600' : 'text-gray-800'}`}>
                            ₹{myBalance.toLocaleString()}
                        </span>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isSharedTransactionsOpen}
                onClose={() => setIsSharedTransactionsOpen(false)}
                title="Owed Balance Breakdown"
            >
                <div className="flex flex-col gap-4">
                    {sharedWallets.map((wallet) => (
                        <div key={wallet.id} className="flex flex-col p-4 rounded-xl transition-colors duration-100 hover:bg-gray-50 border border-gray-100 shadow-sm gap-3">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-indigo-50 text-indigo-600">
                                        <Wallet size={18} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{wallet.name}</p>
                                        <p className={`text-xs font-medium ${wallet.balance < 0 ? 'text-rose-600' : wallet.balance > 0 ? 'text-emerald-600' : 'text-gray-500'}`}>
                                            Net: {wallet.balance < 0 ? '-' : wallet.balance > 0 ? '+' : ''}₹{Math.abs(wallet.balance).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-lg border border-gray-100 p-3">
                                {(wallet.owes && wallet.owes.length > 0 || wallet.owedBy && wallet.owedBy.length > 0) ? (
                                    <div className="flex flex-col gap-2">
                                        {wallet.owes?.map((debt, idx) => (
                                            <div key={`owe-${idx}`} className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600">You owe <span className="font-bold text-gray-800">{debt.toName}</span></span>
                                                <span className="font-bold text-rose-600">₹{debt.amount.toLocaleString()}</span>
                                            </div>
                                        ))}
                                        {wallet.owedBy?.map((credit, idx) => (
                                            <div key={`credit-${idx}`} className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600"><span className="font-bold text-gray-800">{credit.fromName}</span> owes you</span>
                                                <span className="font-bold text-emerald-600">₹{credit.amount.toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-sm text-gray-400 block text-center">All debts settled.</span>
                                )}
                            </div>
                        </div>
                    ))}
                    
                    <div className="mt-2 pt-4 border-t border-gray-200 flex justify-between items-center px-4">
                        <span className="font-bold text-gray-800 text-lg">Net Total</span>
                        <div className="text-right">
                            <span className={`text-sm font-medium block ${totalOwed < 0 ? 'text-rose-600' : totalOwed > 0 ? 'text-emerald-600' : 'text-gray-500'}`}>
                                {totalOwed < 0 ? 'You owe overall' : totalOwed > 0 ? 'You should receive' : 'Settled'}
                            </span>
                            <span className={`font-bold text-xl ${totalOwed < 0 ? 'text-rose-600' : totalOwed > 0 ? 'text-emerald-600' : 'text-gray-800'}`}>
                                ₹{absTotalOwed.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Home;
