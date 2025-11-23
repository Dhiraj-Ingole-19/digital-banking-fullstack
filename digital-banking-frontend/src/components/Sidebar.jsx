import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ArrowRightLeft, MessageSquare, Settings, LogOut, Wallet } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ className }) => {
    const { logout } = useAuth();

    return (
        <aside className={`sidebar ${className}`}>
            <div className="sidebar-logo">
                <Wallet size={28} />
                <span>DigiBank</span>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/transactions" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <ArrowRightLeft />
                    <span>Transactions</span>
                </NavLink>
                <NavLink to="/my-requests" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <MessageSquare />
                    <span>My Requests</span>
                </NavLink>
                <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Settings />
                    <span>Settings</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <button onClick={logout} className="logout-btn">
                    <LogOut size={20} />
                    <span>Log Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
