import React from 'react';
import { User, Bell, Shield, Moon, HelpCircle } from 'lucide-react';

const Settings = () => {
    const sections = [
        { icon: User, label: 'Profile Settings', desc: 'Update your name and personal details' },
        { icon: Bell, label: 'Notifications', desc: 'Manage your alerts and reminders' },
        { icon: Moon, label: 'Appearance', desc: 'Switch between light and dark mode' },
        { icon: Shield, label: 'Privacy & Security', desc: 'Manage your data and passwords' },
        { icon: HelpCircle, label: 'Help & Support', desc: 'Get in touch with our team' },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl text-gray-800 font-semibold mb-8">Settings</h1>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {sections.map((item, index) => (
                    <button 
                        key={index} 
                        className="w-full flex items-center gap-4 p-6 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none"
                    >
                        <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
                            <item.icon size={22} />
                        </div>
                        <div className="text-left">
                            <h3 className="font-semibold text-gray-800">{item.label}</h3>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Settings;