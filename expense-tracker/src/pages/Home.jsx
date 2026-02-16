import React, { useState } from 'react';
import { Plus, CreditCard, UserPlus, TrendingUp, TrendingDown, Wallet, Users } from 'lucide-react';

import Modal from '../components/common/Modal';

const Home = () => {
    const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
    const [isAddWalletOpen, setIsAddWalletOpen] = useState(false);
    const [isTransactionsOpen, setIsTransactionsOpen] = useState(false);
    const [isSharedTransactionsOpen, setIsSharedTransactionsOpen] = useState(false);

    const handleAddExpense = (e) => {
        e.preventDefault();
        // Logic to add expense would go here
        setIsAddExpenseOpen(false);
        alert('Expense Added! (Demo)');
    };

    const handleAddWallet = (e) => {
        e.preventDefault();
        setIsAddWalletOpen(false);
        alert('Wallet Created! (Demo)');
    };

    return (
        <div className="max-w-6xl mx-auto">
            <header className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl text-gray-800 mb-1 font-semibold">Hi Traveller 👋</h1>
                    <p className="text-gray-500 text-base">Ready to manage your expenses?</p>
                </div>
                <button className="btn btn-primary flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors" onClick={() => setIsAddExpenseOpen(true)}>
                    <Plus size={18} />
                    Add Expense
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
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">₹12,450</h2>
                    <div className="flex items-center gap-2 text-sm">
                        <TrendingUp size={16} className="text-emerald-500" />
                        <span className="text-emerald-500">+5,500</span>
                    </div>
                </div>

                <div
                    className="relative overflow-hidden border border-white/60 bg-gradient-to-br from-white/90 to-white/40 rounded-2xl p-6 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 cursor-pointer"
                    onClick={() => setIsSharedTransactionsOpen(true)}
                >
                    <div className="flex justify-between items-center mb-4 text-gray-500 text-sm font-medium">
                        <span>Shared Balance</span>
                        <div className="flex">
                            <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white -ml-2 first:ml-0 flex items-center justify-center text-[0.6rem] text-white font-bold">A</div>
                            <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white -ml-2 first:ml-0 flex items-center justify-center text-[0.6rem] text-white font-bold">B</div>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">₹8,200</h2>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500 text-xs text-right block w-full">2 shared wallets</span>
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
                <section className="bg-white rounded-2xl p-6 min-h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
                        <button className="bg-none border-none text-indigo-600 font-semibold cursor-pointer hover:underline">See All</button>
                    </div>

                    <div className="flex flex-col gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl transition-colors duration-100 hover:bg-gray-50">
                                <div className="flex flex-col items-center min-w-[40px] bg-slate-100 px-2 py-1 rounded-lg text-xs text-gray-500">
                                    <span className="font-bold text-base text-gray-800">23</span>
                                    <span>Apr</span>
                                </div>
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#e0f2fe', color: '#0ea5e9' }}>
                                    <CreditCard size={18} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800 mb-[2px]">Grocery</p>
                                    <p className="text-sm text-gray-500">Trip Wallet</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-800">₹1,200</p>
                                    <p className="text-xs text-emerald-500">+5,000</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Quick Actions / Shared Expenses Preview */}
                <section className="flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            className="flex flex-col items-center gap-2 p-5 bg-white border border-transparent w-full text-indigo-600 rounded-xl hover:border-indigo-600 hover:bg-slate-50 transition-colors shadow-sm"
                            onClick={() => setIsAddWalletOpen(true)}
                        >
                            <CreditCard size={20} />
                            <span>Add Wallet</span>
                        </button>
                        <button className="flex flex-col items-center gap-2 p-5 bg-white border border-transparent w-full text-indigo-600 rounded-xl hover:border-indigo-600 hover:bg-slate-50 transition-colors shadow-sm">
                            <UserPlus size={20} />
                            <span>Invite</span>
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white overflow-hidden rounded-2xl p-0">
                        <div className="p-6 flex justify-between items-center">
                            <div className="flex items-center gap-2 font-semibold">
                                <div className="bg-white/20 p-1.5 rounded-lg flex">
                                    <Wallet size={16} color="white" />
                                </div>
                                <span>Trip Wallet</span>
                            </div>
                            <span className="text-xl font-bold">₹8,200</span>
                        </div>

                        <div className="bg-white text-gray-800 m-2 rounded-xl p-4">
                            <div className="flex justify-between mb-2">
                                <h4 className="text-lg font-semibold">Fuel</h4>
                                <span className="text-xs text-gray-500">Added by Priya</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold">₹1,500</h3>
                                <span className="bg-amber-100 text-amber-600 text-xs px-2 py-1 rounded-md font-semibold">✋ Split Expense</span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <Modal
                isOpen={isAddExpenseOpen}
                onClose={() => setIsAddExpenseOpen(false)}
                title="Add New Expense"
            >
                <form onSubmit={handleAddExpense} className="flex flex-col gap-4">
                    <div>
                        <label className="block mb-2 font-medium">Amount</label>
                        <input
                            type="number"
                            placeholder="0.00"
                            className="w-full p-3 rounded-lg border border-gray-200 text-xl"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">Description</label>
                        <input
                            type="text"
                            placeholder="What is this for?"
                            className="w-full p-3 rounded-lg border border-gray-200"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">Category</label>
                        <select className="w-full p-3 rounded-lg border border-gray-200 bg-white">
                            <option>Food & Dining</option>
                            <option>Transportation</option>
                            <option>Shopping</option>
                            <option>Entertainment</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">Wallet</label>
                        <select className="w-full p-3 rounded-lg border border-gray-200 bg-white">
                            <option>Personal Cash</option>
                            <option>Trip to Goa (Shared)</option>
                            <option>Flat Expenses (Shared)</option>
                        </select>
                    </div>
                    <button type="submit" className="mt-4 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold">
                        Add Expense
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

            <Modal
                isOpen={isTransactionsOpen}
                onClose={() => setIsTransactionsOpen(false)}
                title="Transaction History"
            >
                <div className="flex flex-col gap-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl transition-colors duration-100 hover:bg-gray-50 border-b border-gray-50 last:border-none">
                            <div className="flex flex-col items-center min-w-[40px] bg-slate-100 px-2 py-1 rounded-lg text-xs text-gray-500">
                                <span className="font-bold text-base text-gray-800">{20 + i}</span>
                                <span>Apr</span>
                            </div>
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#e0f2fe', color: '#0ea5e9' }}>
                                <CreditCard size={18} />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800 mb-[2px]">Item {i}</p>
                                <p className="text-sm text-gray-500">Personal Cash</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-gray-800">₹{100 * i}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>

            <Modal
                isOpen={isSharedTransactionsOpen}
                onClose={() => setIsSharedTransactionsOpen(false)}
                title="Shared Expenses"
            >
                <div className="flex flex-col gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl transition-colors duration-100 hover:bg-gray-50 border-b border-gray-50 last:border-none">
                            <div className="flex flex-col items-center min-w-[40px] bg-slate-100 px-2 py-1 rounded-lg text-xs text-gray-500">
                                <span className="font-bold text-base text-gray-800">{15 + i}</span>
                                <span>Apr</span>
                            </div>
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#f5d0fe', color: '#c026d3' }}>
                                <Users size={18} />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800 mb-[2px]">Team Lunch {i}</p>
                                <p className="text-sm text-gray-500">Trip to Goa</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-gray-800">₹{500 * i}</p>
                                <span className="bg-amber-100 text-amber-600 text-xs px-2 py-1 rounded-md font-semibold">You owe ₹{150 * i}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>
        </div >
    );
};

export default Home;


