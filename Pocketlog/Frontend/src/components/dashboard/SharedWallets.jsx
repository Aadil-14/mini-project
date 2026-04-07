import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Wallet, Search, ChevronLeft, ChevronRight, Edit2, Trash2, Coffee, Car, Home as HomeIcon, HelpCircle } from 'lucide-react';
import Modal from '../common/Modal';

const getCategoryDetails = (category) => {
    switch (category) {
        case 'Food & Dining': return { icon: <Coffee size={16} />, color: 'bg-orange-100 text-orange-600' };
        case 'Transportation': return { icon: <Car size={16} />, color: 'bg-blue-100 text-blue-600' };
        case 'Housing': return { icon: <HomeIcon size={16} />, color: 'bg-indigo-100 text-indigo-600' };
        default: return { icon: <HelpCircle size={16} />, color: 'bg-gray-100 text-gray-600' };
    }
};

const SharedWallets = () => {
    const [sharedWallets, setSharedWallets] = useState([]);
    const [allTransactions, setAllTransactions] = useState([]);
    const [walletMembers, setWalletMembers] = useState({});
    
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Search and Pagination for the detailed modal table
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const loadSharedData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const headers = { Authorization: `Bearer ${token}` };

                const balRes = await axios.get('http://127.0.0.1:5000/api/split/balances', { headers });
                setSharedWallets(balRes.data);

                const txRes = await axios.get('http://127.0.0.1:5000/api/transactions/shared', { headers });
                setAllTransactions(txRes.data);
            } catch (err) {
                console.error("Error loading shared wallets", err);
            }
        };
        loadSharedData();
    }, []);

    const handleOpenWallet = async (wallet) => {
        setSelectedWallet(wallet);
        setIsModalOpen(true);
        setSearchTerm('');
        setCurrentPage(1);

        try {
            const token = localStorage.getItem('token');
            const memRes = await axios.get(`http://127.0.0.1:5000/api/wallets/${wallet.id}/members`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWalletMembers(prev => ({...prev, [wallet.id]: memRes.data}));
        } catch (e) {
            console.error("Error loading members", e);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedWallet(null), 200);
    };

    // Filter transactions for the selected wallet
    const filteredTransactions = useMemo(() => {
        if (!selectedWallet) return [];
        const walletTxs = allTransactions.filter(t => t.wallet_id === selectedWallet.id);
        
        return walletTxs.filter(t => {
            const note = t.description || '';
            const cat = t.category || '';
            return note.toLowerCase().includes(searchTerm.toLowerCase()) || 
                   cat.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [selectedWallet, searchTerm, allTransactions]);

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Reset pagination when search changes
    useMemo(() => setCurrentPage(1), [searchTerm]);

    return (
        <section className="flex flex-col gap-6 h-full">
            {/* Shared Wallets List Card matching "Trip Wallet" style */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white overflow-hidden rounded-2xl p-0 flex flex-col h-full shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h3 className="text-lg font-bold text-white">Shared Wallets</h3>
                    <div className="bg-white/20 p-1.5 rounded-lg flex items-center justify-center">
                        <Wallet size={18} color="white" />
                    </div>
                </div>

                <div className="flex flex-col p-2 flex-1">
                    {sharedWallets.length === 0 && (
                        <div className="text-center p-8 text-slate-400">
                            No shared wallets constructed yet.
                        </div>
                    )}
                    {sharedWallets.map(wallet => (
                        <div 
                            key={wallet.id}
                            onClick={() => handleOpenWallet(wallet)}
                            className="bg-white/10 hover:bg-white/20 text-white m-2 rounded-xl p-4 transition-colors cursor-pointer border border-white/5"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-lg font-semibold">{wallet.name}</h4>
                            </div>
                            <div className="flex justify-between items-end mb-3">
                                <div>
                                    <p className="text-xs text-slate-300 mb-1">Your Net Balance</p>
                                    <h3 className={`text-xl font-bold ${wallet.balance < 0 ? 'text-rose-400' : wallet.balance > 0 ? 'text-emerald-400' : 'text-white'}`}>
                                        {wallet.balance < 0 ? '-' : wallet.balance > 0 ? '+' : ''}₹{Math.abs(wallet.balance).toLocaleString()}
                                    </h3>
                                </div>
                            </div>

                            {/* Specific Debts Preview */}
                            <div className="flex flex-col gap-1 mt-auto border-t border-white/10 pt-3">
                                {(wallet.owes?.length === 0 && wallet.owedBy?.length === 0) ? (
                                    <span className="text-xs text-slate-400">All settled</span>
                                ) : (
                                    <>
                                        {wallet.owes?.slice(0, 2).map((d, i) => (
                                            <div key={`o-${i}`} className="flex justify-between text-xs">
                                                <span className="text-slate-300">You owe: <span className="text-white font-medium">{d.toName}</span></span>
                                                <span className="text-rose-300 font-semibold">-₹{d.amount}</span>
                                            </div>
                                        ))}
                                        {wallet.owedBy?.slice(0, 2).map((c, i) => (
                                            <div key={`ob-${i}`} className="flex justify-between text-xs">
                                                <span className="text-slate-300"><span className="text-white font-medium">{c.fromName}</span> owes you:</span>
                                                <span className="text-emerald-300 font-semibold">+₹{c.amount}</span>
                                            </div>
                                        ))}
                                        {(wallet.owes?.length + wallet.owedBy?.length > 2) && (
                                            <span className="text-[10px] text-indigo-300 mt-1 cursor-pointer hover:text-white" onClick={(e) => { e.stopPropagation(); handleOpenWallet(wallet); }}>+ {wallet.owes.length + wallet.owedBy.length - 2} more connections</span>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detailed Shared Wallet Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedWallet ? selectedWallet.name : 'Shared Wallet Details'}
                maxWidth="max-w-4xl"
            >
                {selectedWallet && (
                    <div className="flex flex-col gap-6">
                        {/* Header Section */}
                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-1">Your Balance In Wallet</h2>
                                <p className={`text-2xl font-black ${selectedWallet.balance < 0 ? 'text-rose-600' : selectedWallet.balance > 0 ? 'text-emerald-600' : 'text-gray-800'}`}>
                                    {selectedWallet.balance < 0 ? '-' : selectedWallet.balance > 0 ? '+' : ''}₹{Math.abs(selectedWallet.balance).toLocaleString()}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-500">Members:</span>
                                <div className="flex">
                                    {(walletMembers[selectedWallet.id] || []).map((m, idx) => (
                                        <div key={idx} className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white -ml-2 first:ml-0 flex items-center justify-center text-xs text-white font-bold shadow-sm" title={m.name}>
                                            {m.name.charAt(0).toUpperCase()}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Transactions Section */}
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
                            {/* Toolbar */}
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 className="font-bold text-gray-700">Transactions</h3>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input 
                                        type="text" 
                                        placeholder="Search..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full sm:w-64 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-left border-collapse min-w-[800px]">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                                            <th className="p-4 rounded-tl-xl rounded-bl-xl">Category</th>
                                            <th className="p-4">Note</th>
                                            <th className="p-4">Paid By (ID)</th>
                                            <th className="p-4">Date</th>
                                            <th className="p-4 text-right">Amount</th>
                                            <th className="p-4 text-center w-24">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {paginatedTransactions.length > 0 ? (
                                            paginatedTransactions.map((tx) => {
                                                const details = getCategoryDetails(tx.category);
                                                return (
                                                <tr key={tx.id} className="border-b border-gray-50 hover:bg-slate-50/80 transition-colors group">
                                                    <td className="p-4 rounded-tl-xl rounded-bl-xl">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0 ${details.color}`}>
                                                                {details.icon}
                                                            </div>
                                                            <span className="font-semibold text-gray-800 whitespace-nowrap">{tx.category || 'Uncategorized'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-gray-600 min-w-[140px]">{tx.description || '-'}</td>
                                                    <td className="p-4">
                                                        <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-700 font-medium text-xs">
                                                            User #{tx.paid_by}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-gray-500 whitespace-nowrap font-medium text-xs">
                                                        {new Date(tx.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </td>
                                                    <td className={`p-4 text-right font-bold whitespace-nowrap ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                        {tx.type === 'income' ? '+' : '-'}₹{parseFloat(tx.amount).toLocaleString()}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="Edit">
                                                                <Edit2 size={14} />
                                                            </button>
                                                            <button className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors" title="Delete">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                )
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="p-8 text-center text-gray-500">
                                                    No transactions found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {filteredTransactions.length > 0 && (
                                <div className="p-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
                                    <span className="text-xs text-gray-500 font-medium">
                                        Showing <span className="font-bold text-gray-700">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-gray-700">{Math.min(currentPage * itemsPerPage, filteredTransactions.length)}</span> of <span className="font-bold text-gray-700">{filteredTransactions.length}</span>
                                    </span>

                                    <div className="flex items-center gap-1">
                                        <button 
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="p-1 rounded text-gray-500 hover:bg-white border border-transparent hover:border-gray-200 disabled:opacity-50 disabled:pointer-events-none transition-all"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                        
                                        <span className="text-xs font-semibold px-2">Page {currentPage} of {totalPages}</span>

                                        <button 
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages || totalPages === 0}
                                            className="p-1 rounded text-gray-500 hover:bg-white border border-transparent hover:border-gray-200 disabled:opacity-50 disabled:pointer-events-none transition-all"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </section>
    );
};

export default SharedWallets;
