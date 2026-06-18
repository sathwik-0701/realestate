import React, { useEffect, useState } from 'react';
import { pendingApprovalStyles as s } from '../../assets/dummyStyles';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { HiOutlineClock, HiOutlineRefresh, HiOutlineSupport } from 'react-icons/hi';

const PendingApproval = () => {
    const { logout, user, refreshUser } = useAuth();
    const [refreshing, setRefreshing] = useState(false);

    // auto refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            refreshUser();
        }, 30000);
        return () => clearInterval(interval);
    }, [refreshUser]);

    const handleManualRefresh = async () => {
        setRefreshing(true);
        await refreshUser();
        setTimeout(() => setRefreshing(false), 1000);
    };

    return (
        <div className={s.container} style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "70vh",
            textAlign: "center",
            padding: "40px 20px"
        }}>
            <div className={s.iconCircle} style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "24px",
                boxShadow: "0 8px 30px rgba(245, 158, 11, 0.2)"
            }}>
                <HiOutlineClock size={48} style={{ color: "#d97706" }} />
            </div>

            <h1 className={s.heading} style={{
                fontSize: "28px",
                fontWeight: "800",
                color: "#1e293b",
                marginBottom: "16px"
            }}>
                Approval Pending
            </h1>

            <p className={s.description} style={{
                fontSize: "16px",
                color: "#64748b",
                maxWidth: "500px",
                lineHeight: "1.6",
                marginBottom: "32px"
            }}>
                {user?.name}, your seller account is currently under review by our 
                administration team. Approval usually takes less than 24 hours. 
                You will gain full dashboard access once verified.
            </p>

            <div className={s.buttonGroup} style={{
                display: "flex",
                gap: "16px",
                flexWrap: "wrap",
                justifyContent: "center",
                marginBottom: "40px"
            }}>
                <Link to='/properties' className={s.browseButton} style={{
                    padding: "14px 28px",
                    background: "linear-gradient(135deg, #4caf50, #2e7d32)",
                    color: "white",
                    borderRadius: "12px",
                    textDecoration: "none",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(76, 175, 80, 0.3)"
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(76, 175, 80, 0.4)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(76, 175, 80, 0.3)";
                }}>
                    Browse Properties
                </Link>

                <button
                    onClick={handleManualRefresh}
                    disabled={refreshing}
                    className={`${s.refreshButtonBase} ${refreshing ? s.refreshButtonDisabled : s.refreshButtonEnabled}`}
                    style={{
                        padding: "14px 28px",
                        background: refreshing ? "#e2e8f0" : "#eef2ff",
                        border: refreshing ? "1px solid #cbd5e1" : "1px solid #e0e7ff",
                        borderRadius: "12px",
                        color: refreshing ? "#94a3b8" : "#4caf50",
                        fontWeight: "600",
                        cursor: refreshing ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        transition: "all 0.3s ease",
                        opacity: refreshing ? 0.7 : 1
                    }}
                    onMouseEnter={(e) => {
                        if (!refreshing) {
                            e.currentTarget.style.background = "#dbeafe";
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!refreshing) {
                            e.currentTarget.style.background = "#eef2ff";
                        }
                    }}
                >
                    <HiOutlineRefresh
                        size={20}
                        style={{
                            animation: refreshing ? "spin 1s linear infinite" : "none"
                        }}
                    />
                    {refreshing ? "Checking..." : "Check Status"}
                </button>
            </div>

            <div className={s.supportContainer} style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#94a3b8",
                fontSize: "14px"
            }}>
                <HiOutlineSupport size={18} />
                Need help?
                <Link to="/contact" className={s.supportLink} style={{
                    color: "#4caf50",
                    fontWeight: "600",
                    textDecoration: "none",
                    marginLeft: "4px",
                    transition: "color 0.3s ease"
                }}
                onMouseEnter={(e) => e.target.style.color = "#2e7d32"}
                onMouseLeave={(e) => e.target.style.color = "#4caf50"}>
                    Contact Support
                </Link>
            </div>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default PendingApproval;