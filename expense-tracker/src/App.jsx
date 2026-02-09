import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import Stats from './pages/Stats';
import Wallets from './pages/Wallets';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="stats" element={<Stats />} />
          <Route path="wallets" element={<Wallets />} />
          <Route path="categories" element={<div>Categories Page</div>} />
          <Route path="settings" element={<div>Settings Page</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
