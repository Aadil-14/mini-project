import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PieChart, Wallet, Grid, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Home', path: '/' },
        { icon: PieChart, label: 'Stats', path: '/stats' },
        { icon: Wallet, label: 'Wallets', path: '/wallets' },
        { icon: Grid, label: 'Categories', path: '/categories' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <aside className="w-[250px] h-screen bg-white flex flex-col px-6 py-8 border-r border-gray-100 fixed left-0 top-0 z-10 transition-all duration-300">
            <div className="flex items-center gap-4 mb-12 pl-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br from-indigo-500 to-blue-500">
                    ET
                </div>
                <h1 className="text-xl font-bold text-gray-800">POCKETLOG</h1>
            </div>

            <nav className="flex-1">
                <ul className="list-none flex flex-col gap-2">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium ${isActive
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-600'
                                    }`
                                }
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="mt-auto">
                <button className="flex items-center gap-3 px-4 py-3.5 w-full border-none bg-transparent text-red-500 font-medium cursor-pointer rounded-xl transition-colors text-base hover:bg-red-50">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;