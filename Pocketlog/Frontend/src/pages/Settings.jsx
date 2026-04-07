import React, { useState } from 'react';
import { 
    User, Bell, Shield, HelpCircle, ArrowLeft, Mail, 
    MessageSquare, Smartphone, Lock, Eye, EyeOff, 
    ShieldCheck, ChevronRight, Send 
} from 'lucide-react';

const Settings = () => {
    const [activeSection, setActiveSection] = useState('menu');
    const [showPassword, setShowPassword] = useState(false);
    
    // States
    const [userData, setUserData] = useState({ name: 'Alex Rivera', email: 'alex.rivera@example.com' });
    const [notifs, setNotifs] = useState({ email: true, push: false, messages: true });
    const [privacy, setPrivacy] = useState({ twoFactor: true, dataSharing: false });
    const [showToast, setShowToast] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const sections = [
        { id: 'profile', icon: User, label: 'Profile Settings', desc: 'Update your name and personal details' },
        { id: 'notifications', icon: Bell, label: 'Notifications', desc: 'Manage your alerts and reminders' },
        { id: 'privacy', icon: Shield, label: 'Privacy & Security', desc: 'Manage your passwords and 2FA' },
        { id: 'help', icon: HelpCircle, label: 'Help & Support', desc: 'Get in touch with our team' },
    ];
    // --- Reusable Components ---
    const Switch = ({ enabled, onChange }) => (
        <button onClick={onChange} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-indigo-600' : 'bg-gray-200'}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    );
    const SectionHeader = ({ title }) => (
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <button onClick={() => setActiveSection('menu')} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors">
                <ArrowLeft size={20} />
                <span className="font-medium">Back</span>
            </button>
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <div className="w-10"></div>
        </div>
    );

    return (
        // <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-semibold mb-8 text-gray-800">Settings</h1>
                
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    
                    {/* MAIN MENU */}
                    {activeSection === 'menu' && (
                        <div className="divide-y divide-gray-50">
                            {sections.map((item) => (
                                <button key={item.id} onClick={() => setActiveSection(item.id)} className="w-full flex items-center gap-4 p-6 hover:bg-gray-50 transition-colors">
                                    <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600"><item.icon size={22} /></div>
                                    <div className="text-left flex-1">
                                        <h3 className="font-semibold text-gray-800">{item.label}</h3>
                                        <p className="text-sm text-gray-500">{item.desc}</p>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-300" />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* NOTIFICATIONS VIEW */}
{activeSection === 'notifications' && (
    <div className="animate-in fade-in slide-in-from-right-2 duration-200">
        <SectionHeader title="Notifications" />
        <div className="p-8 space-y-6">

            <section className="space-y-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Bell size={18} className="text-indigo-600" />
                    Notification Preferences
                </h3>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                        <Mail size={18} className="text-indigo-500" />
                        <div>
                            <p className="font-medium text-gray-800 text-sm">Email Notifications</p>
                            <p className="text-xs text-gray-500">Receive updates via email</p>
                        </div>
                    </div>
                    <Switch 
                        enabled={notifs.email} 
                        onChange={() => setNotifs({...notifs, email: !notifs.email})} 
                    />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                        <Smartphone size={18} className="text-indigo-500" />
                        <div>
                            <p className="font-medium text-gray-800 text-sm">Push Notifications</p>
                            <p className="text-xs text-gray-500">Get alerts on your device</p>
                        </div>
                    </div>
                    <Switch 
                        enabled={notifs.push} 
                        onChange={() => setNotifs({...notifs, push: !notifs.push})} 
                    />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                        <MessageSquare size={18} className="text-indigo-500" />
                        <div>
                            <p className="font-medium text-gray-800 text-sm">Message Notifications</p>
                            <p className="text-xs text-gray-500">Notify when you receive messages</p>
                        </div>
                    </div>
                    <Switch 
                        enabled={notifs.messages} 
                        onChange={() => setNotifs({...notifs, messages: !notifs.messages})} 
                    />
                </div>
            </section>

            <button 
                onClick={() => {
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 2000);
                }}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all"
            >
                Save Preferences
            </button>

        </div>
    </div>
)}  

                    {/* PROFILE VIEW */}
                    {activeSection === 'profile' && (
    <div className="animate-in fade-in slide-in-from-right-2 duration-200">
        <SectionHeader title="Profile" />

        <div className="p-8 space-y-6">

            {/* AVATAR */}
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-24 h-24">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border">
                        {avatar ? (
                            <img 
                                src={avatar} 
                                alt="Avatar" 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                No Image
                            </div>
                        )}
                    </div>
                    

                    {/* Edit Icon Overlay */}
                    <label className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer shadow-md hover:bg-indigo-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z" />
                        </svg>
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setAvatar(URL.createObjectURL(file));
                                }
                            }}
                        />
                    </label>
                </div>

                <p className="text-sm text-gray-500">Click icon to change photo</p>
            </div>

            {/* FORM */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                    </label>
                    <input 
                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                        value={userData.name} 
                        onChange={(e) => setUserData({...userData, name: e.target.value})} 
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input 
                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                        value={userData.email} 
                        onChange={(e) => setUserData({...userData, email: e.target.value})} 
                    />
                </div>
            </div>
            {/* SAVE BUTTON */}
            <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all">
                Save Changes
            </button>

        </div>
    </div>
)}

                    {/* PRIVACY & SECURITY VIEW */}
                    {activeSection === 'privacy' && (
                        <div className="animate-in fade-in slide-in-from-right-2 duration-200">
                            <SectionHeader title="Privacy & Security" />
                            <div className="p-8 space-y-8">
                                <section className="space-y-4">
                                    <h3 className="font-semibold text-gray-800 flex items-center gap-2"><Lock size={18} className="text-indigo-600"/> Change Password</h3>
                                    <div className="grid gap-3">
                                        <input type="password" placeholder="Current Password" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                                        <div className="relative">
                                            <input type={showPassword ? "text" : "password"} placeholder="New Password" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                                            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-gray-400 hover:text-indigo-600">
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        <button className="bg-indigo-600 text-white py-2.5 px-6 rounded-xl font-medium hover:bg-indigo-700 transition-colors w-full md:w-fit shadow-md shadow-indigo-100">Update Password</button>
                                    </div>
                                </section>
                                <hr className="border-gray-100" />
                                <section className="space-y-3">
                                    <h3 className="font-semibold text-gray-800 flex items-center gap-2"><ShieldCheck size={18} className="text-indigo-600"/> Security Preferences</h3>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div><p className="font-medium text-gray-800 text-sm">Two-Factor Authentication</p><p className="text-xs text-gray-500">Secondary code for login</p></div>
                                        <Switch enabled={privacy.twoFactor} onChange={() => setPrivacy({...privacy, twoFactor: !privacy.twoFactor})} />
                                    </div>
                                </section>
                            </div>
                        </div>
                    )}

                    {/* HELP & SUPPORT VIEW */}
                    {activeSection === 'help' && (
                        <div className="animate-in fade-in slide-in-from-right-2 duration-200">
                            <SectionHeader title="Help & Support" />
                            <div className="p-8 space-y-6">
                                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                                    <h3 className="font-bold text-indigo-900 mb-2">Need immediate help?</h3>
                                    <p className="text-sm text-indigo-700 mb-4">Check our documentation or send us a message directly.</p>
                                    <div className="flex gap-3">
                                        <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm">View FAQ</button>
                                        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md shadow-indigo-100">Contact Chat</button>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-gray-700">Send us a message</label>
                                    <textarea rows="4" className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none" placeholder="How can we help you today?"></textarea>
                                    <button className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors">
                                        <Send size={18} />
                                        <span>Send Message</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
                {/* TOAST */}
                {showToast && (
                    <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
                        Message sent successfully!
                    </div>
                )}
            </div>
        // </div>
    );
};

export default Settings;