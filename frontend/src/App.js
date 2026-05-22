import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyListingsPage from './pages/MyListingsPage';
import CreateProductPage from './pages/CreateProductPage';
import EditProductPage from './pages/EditProductPage';
import ProfilePage from './pages/ProfilePage';
import CategoriesPage from './pages/CategoriesPage';
import OrdersPage from './pages/OrdersPage';
import { getMe } from './api';

export default function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null);
  const [editTarget, setEditTarget] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) {
      getMe().then(data => {
        if (!data.error) setUser(data);
      });
    }
  }, []);

  function handleLogin(userData) {
    setUser(userData);
    setPage('home');
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setUser(null);
    setPage('home');
  }

  function goEdit(product) {
    setEditTarget(product);
    setPage('edit-product');
  }

  function renderPage() {
    switch (page) {
      case 'home':
        return <HomePage user={user} setPage={setPage} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} setPage={setPage} />;
      case 'register':
        return <RegisterPage setPage={setPage} />;
      case 'my-listings':
        return <MyListingsPage user={user} setPage={setPage} goEdit={goEdit} />;
      case 'create-product':
        return <CreateProductPage setPage={setPage} />;
      case 'edit-product':
        return <EditProductPage product={editTarget} setPage={setPage} />;
      case 'profile':
        return <ProfilePage user={user} setUser={setUser} setPage={setPage} />;
      case 'categories':
        return <CategoriesPage user={user} />;
      case 'orders':
        return <OrdersPage />;
      default:
        return <HomePage user={user} setPage={setPage} />;
    }
  }

  return (
    <div>
      <Navbar user={user} page={page} setPage={setPage} onLogout={handleLogout} />
      {renderPage()}
    </div>
  );
}
