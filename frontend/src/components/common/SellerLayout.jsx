import React, { useState } from 'react';
import SellerSidebar from './SellerSidebar';
import { HiOutlineMenu } from 'react-icons/hi';
import { Outlet } from 'react-router-dom';

const SellerLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div style={{
            display: "flex",
            minHeight: "100vh",
            background: "#f8fafc",
            position: "relative"
        }}>
            <SellerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            
            {/* Mobile Menu Button */}
            <button
                onClick={() => setSidebarOpen(true)}
                style={{
                    position: "fixed",
                    top: "16px",
                    left: "16px",
                    zIndex: 999,
                    background: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "8px",
                    cursor: "pointer",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    display: window.innerWidth < 768 ? "block" : "none"
                }}
            >
                <HiOutlineMenu size={20} />
            </button>
            
            {/* Main Content - Reduced margin */}
            <div style={{
                flex: 1,
                marginLeft: window.innerWidth >= 768 ? "170px" : "0px",
                transition: "margin-left 0.3s ease",
                minHeight: "100vh",
                padding: window.innerWidth < 768 ? "60px 12px 12px 12px" : "0px",
                background: "#f8fafc",
                width: "100%",
                overflowX: "hidden"
            }}>
                {children || <Outlet />}
            </div>
        </div>
    );
};

export default SellerLayout;