import React, { useState } from 'react';
import { Wallet, Plus, Users, ArrowRight } from 'lucide-react';

import Modal from '../components/common/Modal';

const Wallets = () => {
    const [filter, setFilter] = useState('All');
    const [isAddWalletOpen, setIsAddWalletOpen] = useState(false);

    const wallets = [
        { id: 1, name: 'Personal Cash', balance: '₹4,500', type: 'Personal', members: [] },
        { id: 2, name: 'Trip to Goa', balance: '₹8,200', type: 'Shared', members: ['A', 'B', 'C'] },
        { id: 3, name: 'Flat Expenses', balance: '₹12,100', type: 'Shared', members: ['A', 'D'] },
        { id: 4, name: 'Savings', balance: '₹50,000', type: 'Personal', members: [] },
    ];

    const filteredWallets = filter === 'All' ? wallets : wallets.filter(w => w.type === filter);

    const handleAddWallet = (e) => {
        e.preventDefault();
        alert('Wallet Created! (Demo)');
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl text-gray-800 font-semibold">All Wallets</h1>
                <div className="flex gap-4">
                    <div className="bg-slate-200 p-1 rounded-xl flex">
                        {['All', 'Personal', 'Shared'].map((f) => (
                            <button
                                key={f}
                                className={`border-none bg-none px-4 py-2 rounded-lg font-medium cursor-pointer transition-all duration-200 ${filter === f
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                onClick={() => setFilter(f)}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <button
                        className="btn btn-primary flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                        onClick={() => setIsAddWalletOpen(true)}
                    >
                        <Plus size={18} />
                        Add Wallet
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
                {filteredWallets.map((wallet) => (
                    <div
                        key={wallet.id}
                        className={`flex flex-col justify-between min-h-[220px] transition-transform duration-200 rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10 p-6 ${wallet.type === 'Shared'
                            ? 'bg-gradient-to-br from-indigo-600 to-indigo-400 text-white border-none'
                            : 'bg-white border border-gray-100'
                            }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2.5 rounded-xl inline-flex ${wallet.type === 'Shared' ? 'bg-white/20' : 'bg-white/90 shadow-sm'}`}>
                                <Wallet size={24} color={wallet.type === 'Shared' ? 'white' : '#4f46e5'} />
                            </div>
                            {wallet.type === 'Shared' && (
                                <span className="bg-white/20 px-2 py-1 rounded-md text-xs font-semibold">Shared</span>
                            )}
                        </div>

                        <div className="mb-8">
                            <h3 className={`text-lg font-medium mb-2 ${wallet.type === 'Shared' ? 'text-white' : 'text-gray-500'}`}>{wallet.name}</h3>
                            <h2 className={`text-3xl font-bold ${wallet.type === 'Shared' ? 'text-white' : 'text-gray-800'}`}>{wallet.balance}</h2>
                        </div>

                        <div className="flex justify-between items-center mt-auto">
                            {wallet.type === 'Shared' ? (
                                <div className="flex items-center">
                                    <div className="flex mr-2">
                                        {wallet.members.map((m, i) => (
                                            <div key={i} className="w-7 h-7 rounded-full bg-slate-300 border-2 border-white -ml-2.5 flex items-center justify-center text-[0.7rem] text-gray-800 font-bold first:ml-0">{m}</div>
                                        ))}
                                    </div>
                                    <span className="text-sm opacity-80">{wallet.members.length} members</span>
                                </div>
                            ) : (
                                <span className="text-sm text-gray-500 font-medium">Private Wallet</span>
                            )}
                            <button className={`border-none w-9 h-9 rounded-full flex items-center justify-center cursor-pointer opacity-70 transition-opacity duration-200 hover:opacity-100 ${wallet.type === 'Shared'
                                ? 'bg-white/20 text-white'
                                : 'bg-black/5 text-gray-800 hover:bg-black/10'
                                }`}>
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add New Placeholder */}
                <button
                    className="border-2 border-dashed border-slate-300 rounded-2xl bg-transparent flex flex-col items-center justify-center gap-4 text-slate-400 cursor-pointer min-h-[220px] transition-all duration-200 hover:border-indigo-600 hover:text-indigo-600 hover:bg-teal-50 group"
                    onClick={() => setIsAddWalletOpen(true)}
                >
                    <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center transition-transform duration-200 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-90">
                        <Plus size={32} />
                    </div>
                    <span className="font-medium">Create New Wallet</span>
                </button>
            </div>

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
                            placeholder="e.g. Summer Trip"
                            className="w-full p-3 rounded-lg border border-gray-200"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">Type</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input type="radio" name="type" defaultChecked /> Personal
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="radio" name="type" /> Shared
                            </label>
                        </div>
                    </div>
                    <button type="submit" className="mt-4 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold">
                        Create Wallet
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Wallets;
