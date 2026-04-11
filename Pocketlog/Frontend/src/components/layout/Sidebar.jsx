import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, PieChart, Wallet, Grid, Settings, LogOut, X, ChevronUp } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);

    // Extract genuine user details from token payload
    const token = localStorage.getItem('token');
    let userDetails = { name: 'User', email: '' };
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload && payload.user) {
                userDetails = payload.user;
            } else {
                userDetails.name = payload.name || 'User';
                userDetails.email = payload.email || '';
            }
        } catch(e) {}
    }

    const navItems = [
        { icon: LayoutDashboard, label: 'Home', path: '/' },
        { icon: PieChart, label: 'Stats', path: '/stats' },
        { icon: Wallet, label: 'Wallets', path: '/wallets' },
        { icon: Grid, label: 'Categories', path: '/categories' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <aside
            className={`
                fixed top-0 left-0 z-40 h-screen w-[250px] bg-white border-r border-gray-100 
                flex flex-col px-6 py-8 transition-transform duration-300
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                md:translate-x-0
            `}
        >
            <div className="flex items-center justify-between mb-12 pl-2">
                <div className="flex items-center gap-4">
                    <img
                        src="/src/assets/Pocketlog_logo.svg"
                        alt="Pocketlog Logo"
                        className="w-8 h-8 rounded-lg object-cover"
                    />
                    <h1 className="text-xl font-bold text-gray-800">POCKETLOG</h1>
                </div>
                {/* Mobile Close Button */}
                <button
                    onClick={onClose}
                    className="md:hidden p-1 text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>
            </div>

            <nav className="flex-1">
                <ul className="list-none flex flex-col gap-2">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                onClick={onClose} // Close sidebar on navigation (mobile)
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

            <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col gap-2 relative">
                {/* Profile Popup Menu */}
                {isProfileMenuOpen && (
                    <div className="absolute bottom-[calc(100%+8px)] left-0 w-full bg-white border border-gray-100 shadow-xl rounded-xl p-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <button
                            onClick={() => {
                                onClose && onClose();
                                setIsProfileMenuOpen(false);
                                navigate('/settings');
                            }}
                            className={`flex items-center gap-3 px-4 py-2.5 w-full border-none bg-transparent font-medium cursor-pointer rounded-lg transition-colors text-sm ${location.pathname === '/settings' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'}`}
                        >
                            <Settings size={18} />
                            <span>Profile Settings</span>
                        </button>
                        <hr className="my-1 border-gray-100" />
                        <button
                            onClick={() => {
                                localStorage.removeItem('token');
                                localStorage.removeItem('user');
                                onClose && onClose();
                                navigate('/login');
                            }}
                            className="flex items-center gap-3 px-4 py-2.5 w-full border-none bg-transparent text-rose-500 font-medium cursor-pointer rounded-lg transition-colors text-sm hover:bg-rose-50"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                )}

                {/* Profile Card Trigger */}
                <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className={`flex items-center gap-3 p-2 w-full border border-transparent cursor-pointer rounded-xl transition-all text-left group ${isProfileMenuOpen ? 'bg-gray-50 border-gray-200 shadow-sm' : 'hover:bg-gray-50'}`}
                >
                    <div className="w-10 h-10 rounded-full bg-indigo-100 border border-indigo-200 overflow-hidden flex-shrink-0">
                        <img 
                            src="https://i.pravatar.cc/150?img=11" 
                            alt="User Profile" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 overflow-hidden hidden md:block lg:block">
                        <p className="text-sm font-bold text-gray-800 truncate" title={userDetails.name}>{userDetails.name}</p>
                        <p className="text-xs text-gray-500 truncate" title={userDetails.email}>{userDetails.email}</p>
                    </div>
                    <ChevronUp 
                        size={16} 
                        className={`text-gray-400 transition-transform hidden md:block lg:block ${isProfileMenuOpen ? 'rotate-180' : ''}`} 
                    />
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;