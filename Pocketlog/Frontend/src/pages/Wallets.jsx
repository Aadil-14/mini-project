import React, { useState, useEffect } from 'react';
import { Wallet, Plus, Users, ArrowRight } from 'lucide-react';
import axios from 'axios';

import Modal from '../components/common/Modal';

const Wallets = () => {
    const [filter, setFilter] = useState('All');
    const [isAddWalletOpen, setIsAddWalletOpen] = useState(false);
    
    // Add Wallet Form State
    const [walletType, setWalletType] = useState('personal');
    const [invitees, setInvitees] = useState([]);
    const [inviteInput, setInviteInput] = useState('');
    
    // Details Modal
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [activeMembers, setActiveMembers] = useState([]);
    
    // State
    const [wallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(true);

    // Extract User ID
    const token = localStorage.getItem('token');
    let userId = null;
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload && payload.user) {
                userId = payload.user.id;
            } else {
                userId = payload.id;
            }
        } catch(e) {}
    }

    const fetchWallets = async () => {
        try {
            if (!token) return;
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/wallets`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWallets(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching wallets', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWallets();
    }, []);

    const filteredWallets = filter === 'All' ? wallets : wallets.filter(w => w.type === filter.toLowerCase());

    const handleAddInvitee = () => {
        const id = parseInt(inviteInput.trim());
        if (id && !isNaN(id) && id !== userId) {
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
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/wallets`, {
                name,
                type: walletType,
                members: invitees
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Add to state instantly
            setWallets([res.data, ...wallets]);
            
            setIsAddWalletOpen(false);
            setWalletType('personal');
            setInvitees([]);
            setInviteInput('');
        } catch (error) {
            console.error('Error adding wallet', error);
            alert('Failed to add wallet');
        }
    };

    const fetchMembers = async (walletId) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/wallets/${walletId}/members`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setActiveMembers(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleOpenDetails = (wallet) => {
        setSelectedWallet(wallet);
        setIsDetailsOpen(true);
        setActiveMembers([]); // clear previous state
        fetchMembers(wallet.id);
    };

    const handleInviteMember = async (e) => {
        e.preventDefault();
        const memberId = e.target.memberId.value;

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/wallets/${selectedWallet.id}/members`, {
                member_id: memberId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            e.target.reset();
            fetchMembers(selectedWallet.id); // Reload members silently
        } catch (error) {
            console.error('Error adding member', error);
            alert(error.response?.data?.message || 'Failed to add member');
        }
    };

    const handleRemoveMember = async (memberId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/wallets/${selectedWallet.id}/members/${memberId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchMembers(selectedWallet.id); // Reload silently
        } catch (error) {
            alert(error.response?.data?.message || 'Error removing member');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading wallets...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 mb-8">
                <h1 className="text-3xl text-gray-800 font-semibold">All Wallets</h1>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <div className="bg-slate-200 p-1 rounded-xl flex w-full sm:w-auto justify-between sm:justify-start">
                        {['All', 'Personal', 'Shared'].map((f) => (
                            <button
                                key={f}
                                className={`border-none bg-none px-4 py-2 rounded-lg font-medium cursor-pointer transition-all duration-200 flex-1 sm:flex-none ${filter === f
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
                        className="btn btn-primary flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors w-full sm:w-auto"
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
                        onClick={() => wallet.type === 'shared' ? handleOpenDetails(wallet) : null}
                        className={`flex flex-col justify-between min-h-[220px] transition-transform duration-200 rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10 p-6 ${wallet.type === 'shared'
                            ? 'bg-gradient-to-br from-indigo-600 to-indigo-400 text-white border-none cursor-pointer'
                            : 'bg-white border border-gray-100'
                            }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2.5 rounded-xl inline-flex ${wallet.type === 'shared' ? 'bg-white/20' : 'bg-white/90 shadow-sm'}`}>
                                <Wallet size={24} color={wallet.type === 'shared' ? 'white' : '#4f46e5'} />
                            </div>
                            {wallet.type === 'shared' && (
                                <span className="bg-white/20 px-2 py-1 rounded-md text-xs font-semibold">Shared</span>
                            )}
                        </div>

                        <div className="mb-8">
                            <h3 className={`text-lg font-medium mb-2 ${wallet.type === 'shared' ? 'text-white' : 'text-gray-500'}`}>{wallet.name}</h3>
                            <h2 className={`text-3xl font-bold ${wallet.type === 'shared' ? 'text-white' : 'text-gray-800'}`}>₹0.00</h2>
                        </div>

                        <div className="flex justify-between items-center mt-auto">
                            {wallet.type === 'shared' ? (
                                <div className="flex items-center">
                                    <div className="flex mr-2">
                                        <div className="w-7 h-7 rounded-full bg-slate-300 border-2 border-white -ml-2.5 flex items-center justify-center text-[0.7rem] text-gray-800 font-bold first:ml-0">...</div>
                                    </div>
                                    <span className="text-sm font-semibold opacity-90 transition-opacity">Manage members &rarr;</span>
                                </div>
                            ) : (
                                <span className="text-sm text-gray-500 font-medium">Private Wallet</span>
                            )}
                            <button className={`border-none w-9 h-9 rounded-full flex items-center justify-center cursor-pointer opacity-70 transition-opacity duration-200 hover:opacity-100 ${wallet.type === 'shared'
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

            {/* Wallet Details / Member Management Modal */}
            <Modal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                title="Manage Shared Wallet"
                maxWidth="max-w-xl"
            >
                {selectedWallet && (
                    <div className="flex flex-col gap-6">
                        {selectedWallet.created_by == userId ? (
                            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                <h3 className="font-bold text-indigo-900 mb-2">Invite Friends</h3>
                                <p className="text-sm text-indigo-700">Add members to this wallet using their unique User Number.</p>
                                
                                <form onSubmit={handleInviteMember} className="mt-3 flex gap-2">
                                    <input
                                        type="number"
                                        name="memberId"
                                        placeholder="Friend's User #"
                                        className="flex-1 p-2.5 rounded-lg border border-indigo-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                    <button type="submit" className="bg-indigo-600 text-white px-5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">Add</button>
                                </form>
                            </div>
                        ) : (
                            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                                <p className="text-sm font-medium text-amber-800">You are a guest member in this shared wallet. Only the wallet owner can add or remove members.</p>
                            </div>
                        )}

                        <div>
                            <h4 className="font-semibold text-gray-800 mb-3 flex items-center justify-between">
                                Active Members
                                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">{activeMembers.length} joined</span>
                            </h4>
                            
                            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
                                {activeMembers.map(m => (
                                    <div key={m.user_id} className="flex justify-between items-center bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${m.role === 'owner' ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-600'}`}>
                                                {m.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800 flex items-center gap-2">
                                                    {m.name} 
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider ${m.role === 'owner' ? 'bg-amber-100 text-amber-700' : 'bg-transparent text-slate-500 font-medium'}`}>
                                                        {m.role}
                                                    </span>
                                                    {m.user_id == userId && <span className="text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider bg-indigo-100 text-indigo-700">You</span>}
                                                </p>
                                                <p className="text-xs text-gray-500">User #{m.user_id}</p>
                                            </div>
                                        </div>
                                        
                                        {selectedWallet.created_by == userId && m.user_id != userId && (
                                            <button 
                                                className="text-xs font-semibold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                                                onClick={() => {
                                                    if(window.confirm(`Are you sure you want to remove ${m.name}?`)){
                                                        handleRemoveMember(m.user_id);
                                                    }
                                                }}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {activeMembers.length === 0 && (
                                    <p className="text-sm text-gray-400 text-center py-4">Fetching members...</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Wallets;
