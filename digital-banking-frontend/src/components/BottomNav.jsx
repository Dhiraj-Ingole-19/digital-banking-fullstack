import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowRightLeft, MessageSquare, Settings } from 'lucide-react';
import './BottomNav.css';

const BottomNav = ({ className }) => {
    return (
        <nav className={`bottom-nav ${className}`}>
            <NavLink to="/dashboard" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <LayoutDashboard />
                <span>Home</span>
            </NavLink>
            <NavLink to="/transactions" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <ArrowRightLeft />
                <span>Transact</span>
            </NavLink>
            <NavLink to="/my-requests" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <MessageSquare />
                <span>Requests</span>
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <Settings />
                <span>Profile</span>
            </NavLink>
        </nav>
    );
};

export default BottomNav;
