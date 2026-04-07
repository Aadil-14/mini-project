import React, { useState } from 'react';
import {
    Plus,
    MoreVertical,
    Utensils,
    Car,
    ShoppingBag,
    Film,
    Heart,
    Coffee,
    Briefcase,
    Search
} from 'lucide-react';
import Modal from '../components/common/Modal';

const Categories = () => {
    const [filter, setFilter] = useState('Personal');
    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

    const categories = [
        { id: 1, name: 'Food & Dining', icon: Utensils, type: 'Personal', spent: 2500, limit: 5000, color: 'bg-orange-100 text-orange-600' },
        { id: 2, name: 'Transportation', icon: Car, type: 'Shared', spent: 1200, limit: 3000, color: 'bg-blue-100 text-blue-600' },
        { id: 3, name: 'Shopping', icon: ShoppingBag, type: 'Personal', spent: 4500, limit: 4000, color: 'bg-purple-100 text-purple-600' },
        { id: 4, name: 'Entertainment', icon: Film, type: 'Shared', spent: 800, limit: 2000, color: 'bg-pink-100 text-pink-600' },
        { id: 5, name: 'Health', icon: Heart, type: 'Personal', spent: 200, limit: 1500, color: 'bg-emerald-100 text-emerald-600' },
        { id: 6, name: 'Work', icon: Briefcase, type: 'Personal', spent: 0, limit: 1000, color: 'bg-slate-100 text-slate-600' },
    ];

    const filteredCategories = categories.filter(cat => cat.type === filter);

    const handleAddCategory = (e) => {
        e.preventDefault();
        alert('Category Created! (Demo)');
        setIsAddCategoryOpen(false);
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl text-gray-800 font-semibold">Categories</h1>
                    <p className="text-gray-500">Manage your spending limits</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <div className="bg-slate-200 p-1 rounded-xl flex w-full sm:w-auto justify-between sm:justify-start">
                        {['Personal', 'Shared'].map((f) => (
                            <button
                                key={f}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex-1 sm:flex-none ${filter === f ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                onClick={() => setFilter(f)}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <button
                        className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors w-full sm:w-auto"
                        onClick={() => setIsAddCategoryOpen(true)}
                    >
                        <Plus size={18} />
                        New Category
                    </button>
                </div>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((category) => {
                    const percentage = Math.min((category.spent / category.limit) * 100, 100);
                    const isOverBudget = category.spent > category.limit;

                    return (
                        <div key={category.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-3 rounded-xl ${category.color}`}>
                                    <category.icon size={24} />
                                </div>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <MoreVertical size={20} />
                                </button>
                            </div>

                            <h3 className="text-lg font-bold text-gray-800 mb-1">{category.name}</h3>
                            <div className="flex justify-between items-end mb-4">
                                <span className="text-sm text-gray-500">Monthly Budget</span>
                                <span className="font-semibold text-gray-800">₹{category.spent.toLocaleString()} / <span className="text-gray-400">₹{category.limit.toLocaleString()}</span></span>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${isOverBudget ? 'bg-rose-500' : 'bg-indigo-500'}`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>

                            <div className="flex justify-between items-center">
                                <span className={`text-xs font-medium ${isOverBudget ? 'text-rose-500' : 'text-gray-400'}`}>
                                    {isOverBudget ? 'Over Budget' : `${Math.round(100 - percentage)}% remaining`}
                                </span>
                            </div>
                        </div>
                    );
                })}

                {/* Quick Add Placeholder */}
                <button
                    className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-6 text-gray-400 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group"
                    onClick={() => setIsAddCategoryOpen(true)}
                >
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                        <Plus size={20} />
                    </div>
                    <span className="font-medium">Add New Category</span>
                </button>
            </div>

            {/* Add Category Modal */}
            <Modal
                isOpen={isAddCategoryOpen}
                onClose={() => setIsAddCategoryOpen(false)}
                title="Create Category"
            >
                <form onSubmit={handleAddCategory} className="flex flex-col gap-4">
                    <div>
                        <label className="block mb-2 font-medium">Category Name</label>
                        <input
                            type="text"
                            placeholder="e.g., Subscription, Health"
                            className="w-full p-3 rounded-lg border border-gray-200"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">Monthly Limit (₹)</label>
                        <input
                            type="number"
                            placeholder="5000"
                            className="w-full p-3 rounded-lg border border-gray-200"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">Type</label>
                        <select className="w-full p-3 rounded-lg border border-gray-200 bg-white">
                            <option value="Personal">Personal</option>
                            <option value="Shared">Shared</option>
                        </select>
                    </div>
                    <button type="submit" className="mt-4 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold">
                        Create Category
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Categories;