import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        const email = e.target.email.value;
        const password = e.target.password.value;

        // Basic validation
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (password.length < 6) {
           setError('Password must be at least 6 characters');
           return;
        }

        setIsLoading(true);

        try {
            const res = await axios.post('http://127.0.0.1:5000/api/auth/login', {
                email,
                password
            });
            
            // Save token and user data
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data));
            
            setIsLoading(false);
            navigate('/');
        } catch (err) {
            setIsLoading(false);
            setError(err.response?.data?.message || 'Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex relative overflow-hidden bg-slate-900">
            {/* Animated Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-600/20 blur-[120px] mix-blend-screen animate-pulse animation-delay-2000" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-500/20 blur-[120px] mix-blend-screen animate-pulse" />
            <div className="absolute top-[40%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[60vw] h-[30vw] rounded-full bg-purple-500/10 blur-[150px] mix-blend-screen" />

            {/* Left Panel - Hidden on Mobile, Visible on lg+ */}
            <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center px-16 xl:px-24">
                <div className="mb-12">
                    <img
                        src="/src/assets/Pocketlog_logo.svg"
                        alt="Pocketlog Custom Logo"
                        className="w-24 h-24 rounded-3xl shadow-xl shadow-indigo-500/20 mb-8 object-cover border border-white/10"
                    />
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight mb-6">
                        Welcome to<br />POCKETLOG
                    </h1>
                    <p className="text-xl text-slate-300 leading-relaxed max-w-lg">
                        Manage your expenses seamlessly. Track your spending, set budgets, and achieve your financial goals with intelligent insights.
                    </p>
                </div>

                {/* Decorative Stats/Features blocks */}
                <div className="flex gap-6 mt-8">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
                        <div className="text-2xl font-bold text-indigo-400 mb-1">Simple</div>
                        <div className="text-sm text-slate-400">Easy to navigate UI</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
                        <div className="text-2xl font-bold text-purple-400 mb-1">Secure</div>
                        <div className="text-sm text-slate-400">Your data is safe</div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Form (Full width on Mobile, 50% on lg+) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
                <div className="w-full max-w-md">
                    {/* Logo Area for Mobile - Hidden on lg+ */}
                    <div className="flex flex-col items-center mb-8 lg:hidden">
                        <img
                            src="/src/assets/Pocketlog_logo.svg"
                            alt="Pocketlog Custom Logo"
                            className="w-16 h-16 rounded-2xl shadow-xl shadow-indigo-500/20 mb-4 object-cover"
                        />
                        <h1 className="text-3xl font-bold text-white tracking-wide">POCKETLOG</h1>
                        <p className="text-slate-400 mt-2 text-sm text-center">Manage your expenses seamlessly.</p>
                    </div>

                    {/* Login Card - Glassmorphism */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
                        {/* Shimmer effect inside card */}
                        <div className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-5 group-hover:animate-shimmer" />

                        <div className="relative z-10">
                            <h2 className="text-2xl font-semibold text-white mb-6">Sign In</h2>
                            
                            {error && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleLogin} className="flex flex-col gap-5">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="name@example.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:bg-white/10"
                                        required
                                        defaultValue="demo@pocketlog.com"
                                    />
                                </div>

                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="••••••••"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-12 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:bg-white/10"
                                        required
                                        defaultValue="password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                <div className="flex justify-between items-center text-sm px-1 mt-2">
                                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors">
                                        <input type="checkbox" className="rounded bg-white/10 border-white/20 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900" defaultChecked />
                                        <span>Remember me</span>
                                    </label>
                                    <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="group relative w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/30 overflow-hidden mt-4"
                                >
                                    {/* Hover effect highlight */}
                                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />

                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Sign In
                                            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-8 text-center text-sm text-slate-400 border-t border-white/10 pt-6">
                                Don't have an account?{' '}
                                <Link to="/signup" className="font-semibold text-white hover:text-indigo-400 transition-colors">
                                    Create one now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Keyframes for Shimmer effect injected via style (optional shortcut for simple animations) */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}} />
        </div>
    );
};

export default Login;
