import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { NavLink } from 'react-router-dom';
import { 
  HiOutlineViewGrid, 
  HiOutlineClipboardList, 
  HiOutlineChartBar,
  HiOutlineUser, 
  HiOutlineSupport,
  HiOutlineLogout,
  HiOutlineChat,
  HiOutlinePlusCircle,
  HiOutlineHeart
} from 'react-icons/hi';
import { FaBuilding } from 'react-icons/fa';

const SellerSidebar = ({ isOpen, onClose }) => {
    const { logout, user } = useAuth();

    const navItems = [
        { name: "Dashboard", icon: HiOutlineViewGrid, path: "/dashboard" },
        { name: "My Listings", icon: HiOutlineClipboardList, path: "/my-properties" },
        { name: "Add Property", icon: HiOutlinePlusCircle, path: "/add-property" },
        { name: "Leads", icon: HiOutlineChartBar, path: "/inquiries" },
        { name: "Messages", icon: HiOutlineChat, path: "/chat-messages" },
       
        { name: "Profile", icon: HiOutlineUser, path: "/profile" },
        { name: "Support", icon: HiOutlineSupport, path: "/contact" },
    ];

    return (
        <>
            {/* Backdrop */}
            {isOpen && window.innerWidth < 768 && (
                <div
                    onClick={onClose}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.6)",
                        backdropFilter: "blur(8px)",
                        zIndex: 40,
                        animation: "fadeIn 0.3s ease-out"
                    }}
                />
            )}

            {/* Sidebar */}
            <aside style={{
                position: "fixed",
                left: 0,
                top: 0,
                bottom: 0,
                width: "280px",
                background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
                borderRight: "1px solid rgba(226, 232, 240, 0.6)",
                transform: window.innerWidth < 768 
                    ? (isOpen ? "translateX(0)" : "translateX(-100%)")
                    : "translateX(0)",
                transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                zIndex: 50,
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
                boxShadow: window.innerWidth < 768 && isOpen 
                    ? "0 20px 60px rgba(0,0,0,0.2)" 
                    : "2px 0 12px rgba(0,0,0,0.04)",
                scrollbarWidth: "thin",
                scrollbarColor: "#0d9488 transparent"
            }}>
                {/* Custom Scrollbar */}
                <style>{`
                    aside::-webkit-scrollbar {
                        width: 4px;
                    }
                    aside::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    aside::-webkit-scrollbar-thumb {
                        background: #0d9488;
                        border-radius: 10px;
                    }
                    aside::-webkit-scrollbar-thumb:hover {
                        background: #0f766e;
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideIn {
                        from { opacity: 0; transform: translateX(-20px); }
                        to { opacity: 1; transform: translateX(0); }
                    }
                    @keyframes pulseGlow {
                        0%, 100% { box-shadow: 0 0 0 0 rgba(13, 148, 136, 0.4); }
                        50% { box-shadow: 0 0 20px 4px rgba(13, 148, 136, 0.15); }
                    }
                `}</style>

                {/* Logo */}
                <div style={{
                    padding: "28px 24px 20px 24px",
                    borderBottom: "1px solid rgba(226, 232, 240, 0.5)",
                    marginBottom: "16px",
                    position: "relative",
                    overflow: "hidden"
                }}>
                    {/* Animated gradient overlay */}
                    <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "3px",
                        background: "linear-gradient(90deg, #0d9488, #14b8a6, #f59e0b, #0d9488)",
                        backgroundSize: "300%",
                        animation: "gradientMove 3s ease infinite"
                    }} />
                    <style>{`
                        @keyframes gradientMove {
                            0% { background-position: 0% 50%; }
                            50% { background-position: 100% 50%; }
                            100% { background-position: 0% 50%; }
                        }
                    `}</style>

                    <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "12px",
                        animation: "slideIn 0.5s ease-out"
                    }}>
                        <div style={{
                            width: "40px",
                            height: "40px",
                            background: "linear-gradient(135deg, #0d9488, #0f766e)",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 15px rgba(13, 148, 136, 0.35)",
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            animation: "pulseGlow 2s ease-in-out infinite"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.05) rotate(-5deg)";
                            e.currentTarget.style.boxShadow = "0 6px 25px rgba(13, 148, 136, 0.5)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                            e.currentTarget.style.boxShadow = "0 4px 15px rgba(13, 148, 136, 0.35)";
                        }}>
                            <FaBuilding size={20} color="white" />
                        </div>
                        <div>
                            <span style={{
                                fontSize: "20px",
                                fontWeight: "800",
                                background: "linear-gradient(135deg, #0d9488, #0f766e)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                letterSpacing: "-0.5px"
                            }}>RealEstate</span>
                            <p style={{
                                fontSize: "11px",
                                color: "#94a3b8",
                                marginTop: "0px",
                                fontWeight: "500",
                                letterSpacing: "1px",
                                textTransform: "uppercase"
                            }}>Seller Portal</p>
                        </div>
                    </div>
                </div>

                {/* User Info */}
                <div style={{
                    padding: "0 20px 20px 20px",
                    borderBottom: "1px solid rgba(226, 232, 240, 0.4)",
                    marginBottom: "16px"
                }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "12px 14px",
                        background: "linear-gradient(135deg, rgba(13, 148, 136, 0.06), rgba(13, 148, 136, 0.02))",
                        borderRadius: "14px",
                        border: "1px solid rgba(13, 148, 136, 0.08)",
                        transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "linear-gradient(135deg, rgba(13, 148, 136, 0.12), rgba(13, 148, 136, 0.04))";
                        e.currentTarget.style.borderColor = "rgba(13, 148, 136, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "linear-gradient(135deg, rgba(13, 148, 136, 0.06), rgba(13, 148, 136, 0.02))";
                        e.currentTarget.style.borderColor = "rgba(13, 148, 136, 0.08)";
                    }}>
                        <div style={{
                            width: "44px",
                            height: "44px",
                            background: "linear-gradient(135deg, #0d9488, #0f766e)",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "18px",
                            fontWeight: "700",
                            color: "white",
                            boxShadow: "0 4px 12px rgba(13, 148, 136, 0.25)",
                            flexShrink: 0,
                            transition: "transform 0.3s ease"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.05)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                        }}>
                            {user?.name?.charAt(0).toUpperCase() || "S"}
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <div style={{
                                fontSize: "15px",
                                fontWeight: "700",
                                color: "#0f172a",
                                marginBottom: "2px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                            }}>{user?.name || "Seller"}</div>
                            <div style={{
                                fontSize: "12px",
                                color: "#94a3b8",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                            }}>{user?.email || "seller@email.com"}</div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav style={{
                    flex: 1,
                    padding: "0 14px",
                    overflowY: "auto"
                }}>
                    <div style={{
                        padding: "0 12px 12px 12px",
                        fontSize: "10px",
                        fontWeight: "700",
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        letterSpacing: "1.2px",
                        borderBottom: "1px solid rgba(226, 232, 240, 0.3)"
                    }}>
                        Main Menu
                    </div>
                    
                    {navItems.map((item, index) => {
                        const isActive = window.location.pathname === item.path;
                        return (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                onClick={() => {
                                    if (window.innerWidth < 768) onClose();
                                }}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "14px",
                                    width: "100%",
                                    padding: "12px 14px",
                                    marginTop: "4px",
                                    borderRadius: "12px",
                                    background: isActive 
                                        ? "linear-gradient(135deg, rgba(13, 148, 136, 0.12), rgba(13, 148, 136, 0.05))" 
                                        : "transparent",
                                    color: isActive ? "#0d9488" : "#64748b",
                                    textDecoration: "none",
                                    fontSize: "14px",
                                    fontWeight: isActive ? "700" : "500",
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    position: "relative",
                                    border: isActive 
                                        ? "1px solid rgba(13, 148, 136, 0.15)" 
                                        : "1px solid transparent",
                                    animation: `slideIn ${0.3 + index * 0.05}s ease-out`
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = "rgba(241, 245, 249, 0.8)";
                                        e.currentTarget.style.borderColor = "rgba(226, 232, 240, 0.5)";
                                        e.currentTarget.style.transform = "translateX(4px)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = "transparent";
                                        e.currentTarget.style.borderColor = "transparent";
                                        e.currentTarget.style.transform = "translateX(0)";
                                    }
                                }}
                            >
                                <div style={{
                                    width: "36px",
                                    height: "36px",
                                    background: isActive 
                                        ? "linear-gradient(135deg, rgba(13, 148, 136, 0.15), rgba(13, 148, 136, 0.08))" 
                                        : "transparent",
                                    borderRadius: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "all 0.3s ease",
                                    color: isActive ? "#0d9488" : "#94a3b8"
                                }}>
                                    <item.icon size={20} />
                                </div>
                                <span style={{ flex: 1 }}>{item.name}</span>
                                {isActive && (
                                    <div style={{
                                        width: "4px",
                                        height: "24px",
                                        background: "linear-gradient(135deg, #0d9488, #0f766e)",
                                        borderRadius: "2px",
                                        boxShadow: "0 0 12px rgba(13, 148, 136, 0.3)"
                                    }} />
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div style={{
                    padding: "16px 14px 24px 14px",
                    borderTop: "1px solid rgba(226, 232, 240, 0.4)",
                    marginTop: "auto"
                }}>
                    <button
                        onClick={() => {
                            if (window.innerWidth < 768) onClose?.();
                            logout();
                        }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                            width: "100%",
                            padding: "12px 16px",
                            background: "linear-gradient(135deg, rgba(239, 68, 68, 0.06), rgba(239, 68, 68, 0.02))",
                            border: "1px solid rgba(239, 68, 68, 0.1)",
                            borderRadius: "12px",
                            color: "#dc2626",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            position: "relative",
                            overflow: "hidden"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(239, 68, 68, 0.05))";
                            e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.25)";
                            e.currentTarget.style.transform = "translateX(4px)";
                            e.currentTarget.style.boxShadow = "0 4px 15px rgba(239, 68, 68, 0.1)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "linear-gradient(135deg, rgba(239, 68, 68, 0.06), rgba(239, 68, 68, 0.02))";
                            e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.1)";
                            e.currentTarget.style.transform = "translateX(0)";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        <div style={{
                            width: "36px",
                            height: "36px",
                            background: "rgba(239, 68, 68, 0.08)",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.3s ease"
                        }}>
                            <HiOutlineLogout size={20} />
                        </div>
                        <span>Logout</span>
                        <span style={{ marginLeft: "auto", fontSize: "12px", opacity: 0.5 }}>→</span>
                    </button>
                </div>
            </aside>

            <style>{`
                @media (min-width: 768px) {
                    aside {
                        transform: translateX(0) !important;
                    }
                }
                @media (max-width: 768px) {
                    aside {
                        width: 280px;
                    }
                }
            `}</style>
        </>
    );
};

export default SellerSidebar;