import React, { useEffect, useState } from 'react';
import { sellerRequestsStyles as s } from '../../assets/dummyStyles';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import API_URL from '../../config';
import { 
  HiOutlineCheckCircle, 
  HiOutlineClock, 
  HiOutlineMail, 
  HiOutlinePhone,
  HiOutlineUserCircle,
  HiOutlineShieldCheck,
  HiOutlineBadgeCheck,
  HiOutlineUsers,
  HiOutlineBriefcase
} from 'react-icons/hi';
import { FaUserPlus, FaRegBuilding, FaHandshake } from 'react-icons/fa';

const SellerRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [approvingId, setApprovingId] = useState(null);
    const { token } = useAuth();

    // to fetch the request(made by the seller)
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/admin/pending-sellers`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data.success) {
                    setRequests(res.data.pendingSellers || res.data.pendingSeller || []);
                } else {
                    setRequests([]);
                }
                setLoading(false);
            } catch (error) {
                console.error("Failed to load seller requests:", error);
                setRequests([]);
                setLoading(false);
            }
        };
        fetchRequests();
    }, [token]);

    // to approve seller
    const handleApprove = async (id) => {
        setApprovingId(id);
        try {
            const res = await axios.patch(
                `${API_URL}/api/admin/approve-seller/${id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } },
            );
            if (res.data.success) {
                setRequests(requests.filter((req) => req._id !== id));
                alert("Seller Approved Successfully!");
            }
        } catch (error) {
            console.error("Error approving seller:", error);
            alert("Failed to approve a seller");
        } finally {
            setApprovingId(null);
        }
    };

    const requestCount = Array.isArray(requests) ? requests.length : 0;

    if (loading) {
        return (
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)"
            }}>
                <div style={{
                    width: "40px",
                    height: "40px",
                    border: "3px solid rgba(76,175,80,0.2)",
                    borderTop: "3px solid #4caf50",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                }} />
                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    // Check if mobile
    const isMobile = window.innerWidth < 768;

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
            position: "relative",
            overflow: "hidden",
            padding: isMobile ? "0" : "0"
        }}>
            {/* Animated Background Elements */}
            <div style={{
                position: "absolute",
                top: "-20%",
                right: "-10%",
                width: isMobile ? "200px" : "500px",
                height: isMobile ? "200px" : "500px",
                background: "radial-gradient(circle, rgba(76,175,80,0.15) 0%, rgba(76,175,80,0) 70%)",
                borderRadius: "50%",
                animation: "float 20s ease-in-out infinite",
                display: isMobile ? "none" : "block"
            }} />
            <div style={{
                position: "absolute",
                bottom: "-20%",
                left: "-5%",
                width: isMobile ? "150px" : "400px",
                height: isMobile ? "150px" : "400px",
                background: "radial-gradient(circle, rgba(139,195,74,0.12) 0%, rgba(139,195,74,0) 70%)",
                borderRadius: "50%",
                animation: "float 15s ease-in-out infinite reverse",
                display: isMobile ? "none" : "block"
            }} />

            <div style={{
                maxWidth: "1400px",
                margin: "0 auto",
                padding: isMobile ? "12px 10px" : "40px 24px",
                position: "relative",
                zIndex: 1
            }}>
                {/* Header Section */}
                <div style={{
                    textAlign: "center",
                    marginBottom: isMobile ? "16px" : "48px",
                    animation: "slideDown 0.6s ease-out"
                }}>
                    <div style={{
                        display: "inline-block",
                        padding: isMobile ? "4px 10px" : "8px 20px",
                        background: "rgba(76,175,80,0.2)",
                        backdropFilter: "blur(10px)",
                        borderRadius: "50px",
                        marginBottom: isMobile ? "8px" : "20px"
                    }}>
                        <span style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            color: "#2e7d32",
                            fontSize: isMobile ? "9px" : "14px",
                            fontWeight: "600"
                        }}>
                            <FaUserPlus size={isMobile ? 10 : 16} />
                            SELLER VERIFICATION
                        </span>
                    </div>
                    <h1 style={{
                        fontSize: isMobile ? "22px" : "42px",
                        fontWeight: "800",
                        color: "white",
                        marginBottom: isMobile ? "4px" : "12px",
                        textShadow: "0 2px 10px rgba(0,0,0,0.1)"
                    }}>Seller Verification</h1>
                    <p style={{
                        fontSize: isMobile ? "12px" : "16px",
                        color: "rgba(255,255,255,0.9)",
                        maxWidth: "600px",
                        margin: "0 auto",
                        padding: isMobile ? "0 12px" : "0"
                    }}>
                        Review and approve new seller registration requests
                    </p>
                </div>

                {/* Main Card */}
                <div style={{
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(20px)",
                    borderRadius: isMobile ? "12px" : "32px",
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                    overflow: "hidden",
                    animation: "slideUp 0.6s ease-out"
                }}>
                    {/* Card Header */}
                    <div style={{
                        padding: isMobile ? "12px 14px" : "24px 32px",
                        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                        borderBottom: "1px solid #e2e8f0",
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        justifyContent: "space-between",
                        alignItems: isMobile ? "flex-start" : "center",
                        gap: isMobile ? "10px" : "16px"
                    }}>
                        <div>
                            <h2 style={{
                                fontSize: isMobile ? "15px" : "20px",
                                fontWeight: "700",
                                color: "#1e293b",
                                marginBottom: "2px"
                            }}>
                                Pending Requests
                            </h2>
                            <p style={{
                                fontSize: isMobile ? "10px" : "13px",
                                color: "#64748b"
                            }}>
                                Verify and approve new seller registrations
                            </p>
                        </div>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: isMobile ? "6px 14px" : "8px 20px",
                            background: "linear-gradient(135deg, #f59e0b, #d97706)",
                            borderRadius: "40px",
                            boxShadow: "0 4px 12px rgba(245,158,11,0.3)",
                            width: isMobile ? "100%" : "auto",
                            justifyContent: "center"
                        }}>
                            <HiOutlineUsers size={isMobile ? 14 : 18} color="white" />
                            <span style={{
                                fontSize: isMobile ? "14px" : "18px",
                                fontWeight: "700",
                                color: "white"
                            }}>{requestCount}</span>
                            <span style={{
                                fontSize: isMobile ? "10px" : "12px",
                                color: "rgba(255,255,255,0.95)"
                            }}>Pending</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div style={{ 
                        padding: isMobile ? "10px" : "32px" 
                    }}>
                        {requestCount === 0 ? (
                            <div style={{
                                textAlign: "center",
                                padding: isMobile ? "30px 12px" : "80px 40px"
                            }}>
                                <div style={{
                                    width: isMobile ? "60px" : "100px",
                                    height: isMobile ? "60px" : "100px",
                                    background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 12px",
                                    animation: "scaleIn 0.5s ease-out"
                                }}>
                                    <HiOutlineCheckCircle size={isMobile ? 30 : 50} style={{ color: "#10b981" }} />
                                </div>
                                <h3 style={{
                                    fontSize: isMobile ? "18px" : "24px",
                                    fontWeight: "700",
                                    color: "#1e293b",
                                    marginBottom: "4px"
                                }}>All Caught Up!</h3>
                                <p style={{
                                    fontSize: isMobile ? "13px" : "14px",
                                    color: "#64748b"
                                }}>No pending seller requests at the moment.</p>
                            </div>
                        ) : (
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(380px, 1fr))",
                                gap: isMobile ? "10px" : "24px"
                            }}>
                                {requests.map((request, index) => (
                                    <div
                                        key={request._id || index}
                                        style={{
                                            background: "white",
                                            borderRadius: isMobile ? "10px" : "20px",
                                            border: "1px solid #e2e8f0",
                                            overflow: "hidden",
                                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                            animation: `fadeInUp 0.4s ease-out ${index * 0.05}s`,
                                            opacity: 0,
                                            animationFillMode: "forwards"
                                        }}
                                    >
                                        {/* Card Gradient Top Border */}
                                        <div style={{
                                            height: isMobile ? "3px" : "4px",
                                            background: "linear-gradient(90deg, #4caf50, #2e7d32, #f59e0b, #4caf50)",
                                            backgroundSize: "200%",
                                            animation: "gradientShift 3s ease infinite"
                                        }} />

                                        <div style={{ 
                                            padding: isMobile ? "12px 14px" : "24px" 
                                        }}>
                                            {/* Header */}
                                            <div style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: isMobile ? "10px" : "16px",
                                                marginBottom: isMobile ? "10px" : "20px"
                                            }}>
                                                <div style={{
                                                    width: isMobile ? "40px" : "60px",
                                                    height: isMobile ? "40px" : "60px",
                                                    background: "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)",
                                                    borderRadius: isMobile ? "12px" : "20px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    boxShadow: "0 4px 12px rgba(76,175,80,0.3)",
                                                    flexShrink: 0
                                                }}>
                                                    <span style={{
                                                        fontSize: isMobile ? "18px" : "28px",
                                                        fontWeight: "700",
                                                        color: "white"
                                                    }}>
                                                        {request.name?.charAt(0).toUpperCase() || "S"}
                                                    </span>
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <h3 style={{
                                                        fontSize: isMobile ? "14px" : "18px",
                                                        fontWeight: "700",
                                                        color: "#1e293b",
                                                        marginBottom: "2px",
                                                        wordBreak: "break-word"
                                                    }}>
                                                        {request.name || "Unknown Seller"}
                                                    </h3>
                                                    <div style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "4px",
                                                        fontSize: isMobile ? "9px" : "12px",
                                                        color: "#94a3b8",
                                                        flexWrap: "wrap"
                                                    }}>
                                                        <HiOutlineClock size={isMobile ? 10 : 14} />
                                                        Joined {request.createdAt ? new Date(request.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        }) : "Recently"}
                                                    </div>
                                                </div>
                                                <div style={{
                                                    padding: isMobile ? "3px 8px" : "6px 12px",
                                                    background: "#fef3c7",
                                                    borderRadius: "20px",
                                                    fontSize: isMobile ? "8px" : "11px",
                                                    fontWeight: "600",
                                                    color: "#d97706",
                                                    whiteSpace: "nowrap",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "2px"
                                                }}>
                                                    <HiOutlineBadgeCheck size={isMobile ? 8 : 12} />
                                                    Pending
                                                </div>
                                            </div>

                                            {/* Contact Info */}
                                            <div style={{
                                                background: "#f8fafc",
                                                borderRadius: isMobile ? "10px" : "16px",
                                                padding: isMobile ? "10px" : "16px",
                                                marginBottom: isMobile ? "10px" : "20px",
                                                border: "1px solid #e2e8f0"
                                            }}>
                                                <div style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                    marginBottom: request.phone ? "8px" : 0
                                                }}>
                                                    <div style={{
                                                        width: isMobile ? "24px" : "32px",
                                                        height: isMobile ? "24px" : "32px",
                                                        background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)",
                                                        borderRadius: "8px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        flexShrink: 0
                                                    }}>
                                                        <HiOutlineMail size={isMobile ? 12 : 16} style={{ color: "#3b82f6" }} />
                                                    </div>
                                                    <span style={{
                                                        fontSize: isMobile ? "11px" : "14px",
                                                        color: "#475569",
                                                        wordBreak: "break-all"
                                                    }}>
                                                        {request.email || "No email"}
                                                    </span>
                                                </div>
                                                {request.phone && (
                                                    <div style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "8px"
                                                    }}>
                                                        <div style={{
                                                            width: isMobile ? "24px" : "32px",
                                                            height: isMobile ? "24px" : "32px",
                                                            background: "linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%)",
                                                            borderRadius: "8px",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            flexShrink: 0
                                                        }}>
                                                            <HiOutlinePhone size={isMobile ? 12 : 16} style={{ color: "#10b981" }} />
                                                        </div>
                                                        <span style={{
                                                            fontSize: isMobile ? "11px" : "14px",
                                                            color: "#475569"
                                                        }}>
                                                            {request.phone}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Stats Row */}
                                            <div style={{
                                                display: "grid",
                                                gridTemplateColumns: "repeat(3, 1fr)",
                                                gap: isMobile ? "6px" : "12px",
                                                marginBottom: isMobile ? "10px" : "20px"
                                            }}>
                                                <div style={{
                                                    textAlign: "center",
                                                    padding: isMobile ? "4px" : "8px",
                                                    background: "#f8fafc",
                                                    borderRadius: "8px"
                                                }}>
                                                    <HiOutlineBriefcase size={isMobile ? 12 : 16} style={{ color: "#4caf50", marginBottom: "2px" }} />
                                                    <div style={{ fontSize: isMobile ? "8px" : "11px", color: "#64748b" }}>Properties</div>
                                                    <div style={{ fontSize: isMobile ? "11px" : "14px", fontWeight: "600", color: "#1e293b" }}>0</div>
                                                </div>
                                                <div style={{
                                                    textAlign: "center",
                                                    padding: isMobile ? "4px" : "8px",
                                                    background: "#f8fafc",
                                                    borderRadius: "8px"
                                                }}>
                                                    <FaHandshake size={isMobile ? 12 : 16} style={{ color: "#f59e0b", marginBottom: "2px" }} />
                                                    <div style={{ fontSize: isMobile ? "8px" : "11px", color: "#64748b" }}>Sales</div>
                                                    <div style={{ fontSize: isMobile ? "11px" : "14px", fontWeight: "600", color: "#1e293b" }}>0</div>
                                                </div>
                                                <div style={{
                                                    textAlign: "center",
                                                    padding: isMobile ? "4px" : "8px",
                                                    background: "#f8fafc",
                                                    borderRadius: "8px"
                                                }}>
                                                    <HiOutlineShieldCheck size={isMobile ? 12 : 16} style={{ color: "#10b981", marginBottom: "2px" }} />
                                                    <div style={{ fontSize: isMobile ? "8px" : "11px", color: "#64748b" }}>Verified</div>
                                                    <div style={{ fontSize: isMobile ? "11px" : "14px", fontWeight: "600", color: "#1e293b" }}>Pending</div>
                                                </div>
                                            </div>

                                            {/* Approve Button */}
                                            <button
                                                onClick={() => handleApprove(request._id)}
                                                disabled={approvingId === request._id}
                                                style={{
                                                    width: "100%",
                                                    padding: isMobile ? "10px" : "14px",
                                                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                                    border: "none",
                                                    borderRadius: isMobile ? "10px" : "14px",
                                                    color: "white",
                                                    fontSize: isMobile ? "12px" : "14px",
                                                    fontWeight: "600",
                                                    cursor: approvingId === request._id ? "not-allowed" : "pointer",
                                                    transition: "all 0.3s ease",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: "6px"
                                                }}
                                            >
                                                {approvingId === request._id ? (
                                                    <>
                                                        <div style={{
                                                            width: "16px",
                                                            height: "16px",
                                                            border: "2px solid white",
                                                            borderTop: "2px solid transparent",
                                                            borderRadius: "50%",
                                                            animation: "spin 0.6s linear infinite"
                                                        }} />
                                                        Approving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <HiOutlineCheckCircle size={isMobile ? 16 : 18} />
                                                        Approve Seller
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Footer - Mobile Optimized with Colors */}
                {requestCount > 0 && (
                    <div style={{
                        marginTop: isMobile ? "12px" : "32px",
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
                        gap: isMobile ? "8px" : "16px",
                        maxWidth: isMobile ? "100%" : "500px",
                        marginLeft: "auto",
                        marginRight: "auto"
                    }}>
                        {/* Pending Approvals - Orange */}
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: isMobile ? "10px 16px" : "14px 24px",
                            background: "linear-gradient(135deg, #f59e0b, #d97706)",
                            borderRadius: isMobile ? "12px" : "40px",
                            color: "white",
                            justifyContent: "center",
                            boxShadow: "0 4px 15px rgba(245,158,11,0.3)",
                            transition: "transform 0.3s ease"
                        }}
                        onMouseEnter={(e) => {
                            if (!isMobile) {
                                e.currentTarget.style.transform = "scale(1.02)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isMobile) {
                                e.currentTarget.style.transform = "scale(1)";
                            }
                        }}>
                            <HiOutlineUsers size={isMobile ? 16 : 20} />
                            <span style={{ 
                                fontSize: isMobile ? "13px" : "14px", 
                                fontWeight: "600" 
                            }}>{requestCount} Pending Approvals</span>
                        </div>

                        {/* Ready to Verify - Green */}
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: isMobile ? "10px 16px" : "14px 24px",
                            background: "linear-gradient(135deg, #10b981, #059669)",
                            borderRadius: isMobile ? "12px" : "40px",
                            color: "white",
                            justifyContent: "center",
                            boxShadow: "0 4px 15px rgba(16,185,129,0.3)",
                            transition: "transform 0.3s ease"
                        }}
                        onMouseEnter={(e) => {
                            if (!isMobile) {
                                e.currentTarget.style.transform = "scale(1.02)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isMobile) {
                                e.currentTarget.style.transform = "scale(1)";
                            }
                        }}>
                            <HiOutlineCheckCircle size={isMobile ? 16 : 20} />
                            <span style={{ 
                                fontSize: isMobile ? "13px" : "14px", 
                                fontWeight: "600" 
                            }}>Ready to Verify</span>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 768px) {
                    .fadeInUp {
                        animation-duration: 0.3s !important;
                    }
                }

                @media (max-width: 480px) {
                    .header-badge {
                        font-size: 10px !important;
                        padding: 4px 8px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default SellerRequests;