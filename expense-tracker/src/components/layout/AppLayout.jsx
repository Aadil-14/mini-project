import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';


const AppLayout = () => {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-[250px] p-8 bg-gray-100 min-h-screen transition-all duration-300">
                <Outlet />
            </main>
        </div>
    );
};

export default AppLayout;
