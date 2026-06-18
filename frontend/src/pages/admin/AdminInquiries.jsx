import React, { useEffect, useState } from 'react';
import { adminInquiriesStyles as s } from '../../assets/dummyStyles';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import API_URL from '../../config';
import { 
  HiOutlineMail, 
  HiOutlinePhone, 
  HiOutlineCalendar,
  HiOutlineHome,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineEye,
  HiOutlineRefresh,
  HiOutlineSearch,
  HiOutlineUser,
  HiOutlineLocationMarker,
  HiOutlineMenu,
  HiOutlineReply,
  HiOutlinePaperAirplane
} from 'react-icons/hi';
import { FaEnvelope, FaPhone, FaCalendarAlt, FaUser, FaBuilding, FaReply } from 'react-icons/fa';

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [replyData, setReplyData] = useState({});
  const [showReply, setShowReply] = useState({});
  const { token } = useAuth();

  // Fetch inquiries
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        console.log("Fetching inquiries...");
        const res = await axios.get(`${API_URL}/api/admin/inquiries`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Inquiries response:", res.data);
        if (res.data.success) {
          setInquiries(res.data.inquiries);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to load inquiries:", error);
        setLoading(false);
      }
    };
    
    if (token) {
      fetchInquiries();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Update inquiry status
  const handleStatusUpdate = async (id, status) => {
    setUpdatingId(id);
    try {
      const res = await axios.patch(
        `${API_URL}/api/admin/inquiries/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setInquiries(inquiries.map((inq) => 
          inq._id === id ? { ...inq, status: status } : inq
        ));
        alert("Inquiry status updated successfully!");
      } else {
        alert(res.data.message || "Failed to update inquiry status");
      }
    } catch (error) {
      console.error("Error updating inquiry:", error);
      alert(error.response?.data?.message || "Failed to update inquiry status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete inquiry
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
    
    setDeletingId(id);
    try {
      const res = await axios.delete(
        `${API_URL}/api/admin/inquiries/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.success) {
        setInquiries(inquiries.filter((inq) => inq._id !== id));
        alert("Inquiry deleted successfully!");
      } else {
        alert(res.data.message || "Failed to delete inquiry");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.response?.data?.message || "Failed to delete inquiry");
    } finally {
      setDeletingId(null);
    }
  };

  // Handle reply input change
  const handleReplyChange = (id, value) => {
    setReplyData({ ...replyData, [id]: value });
  };

  // Toggle reply box
  const toggleReply = (id) => {
    setShowReply({ ...showReply, [id]: !showReply[id] });
  };

  // Send reply
  const handleSendReply = async (id) => {
    const message = replyData[id]?.trim();
    if (!message) {
      alert("Please enter a reply message");
      return;
    }

    try {
      // Update status to replied
      await axios.patch(
        `${API_URL}/api/admin/inquiries/${id}/status`,
        { status: 'replied' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Here you would also send the reply message via email or store it
      // For now, we'll just update the status
      setInquiries(inquiries.map((inq) => 
        inq._id === id ? { ...inq, status: 'replied' } : inq
      ));
      
      setReplyData({ ...replyData, [id]: '' });
      setShowReply({ ...showReply, [id]: false });
      alert("Reply sent successfully!");
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Failed to send reply");
    }
  };

  // Filter inquiries
  const filteredInquiries = inquiries.filter((inquiry) => {
    if (filterStatus !== "all" && inquiry.status !== filterStatus) return false;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        inquiry.buyer?.name?.toLowerCase().includes(searchLower) ||
        inquiry.buyer?.email?.toLowerCase().includes(searchLower) ||
        inquiry.seller?.name?.toLowerCase().includes(searchLower) ||
        inquiry.property?.title?.toLowerCase().includes(searchLower) ||
        inquiry.message?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  // Inquiry statistics
  const stats = {
    total: inquiries.length,
    new: inquiries.filter(i => i.status === 'new').length,
    read: inquiries.filter(i => i.status === 'read').length,
    replied: inquiries.filter(i => i.status === 'replied').length,
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'new':
        return { bg: "#dbeafe", color: "#1e40af", icon: <HiOutlineRefresh size={12} />, label: "New" };
      case 'read':
        return { bg: "#fef3c7", color: "#92400e", icon: <HiOutlineEye size={12} />, label: "Read" };
      case 'replied':
        return { bg: "#dcfce7", color: "#166534", icon: <HiOutlineCheckCircle size={12} />, label: "Replied" };
      default:
        return { bg: "#f1f5f9", color: "#475569", icon: null, label: "Unknown" };
    }
  };

  const getStatusActions = (status) => {
    const actions = [];
    if (status === 'new') {
      actions.push({ label: "Mark as Read", value: "read", icon: <HiOutlineEye size={14} /> });
    }
    if (status === 'read' || status === 'new') {
      actions.push({ label: "Reply", value: "reply", icon: <HiOutlineReply size={14} /> });
    }
    return actions;
  };

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
          width: "50px",
          height: "50px",
          border: "4px solid rgba(76,175,80,0.2)",
          borderTop: "4px solid #4caf50",
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

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: "absolute",
        top: "-20%",
        right: "-10%",
        width: "500px",
        height: "500px",
        background: "radial-gradient(circle, rgba(76,175,80,0.15) 0%, rgba(76,175,80,0) 70%)",
        borderRadius: "50%",
        animation: "float 20s ease-in-out infinite"
      }} />
      <div style={{
        position: "absolute",
        bottom: "-20%",
        left: "-5%",
        width: "400px",
        height: "400px",
        background: "radial-gradient(circle, rgba(139,195,74,0.12) 0%, rgba(139,195,74,0) 70%)",
        borderRadius: "50%",
        animation: "float 15s ease-in-out infinite reverse"
      }} />

      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "20px 16px",
        position: "relative",
        zIndex: 1
      }}>
        {/* Header Section */}
        <div style={{
          textAlign: "center",
          marginBottom: "32px",
          animation: "slideDown 0.6s ease-out"
        }}>
          <div style={{
            display: "inline-block",
            padding: "6px 16px",
            background: "rgba(76,175,80,0.2)",
            backdropFilter: "blur(10px)",
            borderRadius: "50px",
            marginBottom: "16px"
          }}>
            <span style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "#2e7d32",
              fontSize: "12px",
              fontWeight: "600"
            }}>
              <FaEnvelope size={14} />
              INQUIRY MANAGEMENT
            </span>
          </div>
          <h1 style={{
            fontSize: "28px",
            fontWeight: "800",
            background: "linear-gradient(135deg, #1b5e20 0%, #4caf50 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "8px"
          }}>Property Inquiries</h1>
          <p style={{
            fontSize: "14px",
            color: "#2e7d32",
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            Manage all property inquiries and reply to interested buyers
          </p>
        </div>

        {/* Stats Cards - Mobile Responsive */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "12px",
          marginBottom: "24px",
          animation: "slideUp 0.5s ease-out"
        }}>
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            border: "1px solid rgba(76,175,80,0.2)",
            transition: "transform 0.3s ease",
            textAlign: "center"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
            <div style={{
              width: "36px",
              height: "36px",
              background: "linear-gradient(135deg, #4caf50, #66bb6a)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 8px"
            }}>
              <FaEnvelope size={16} color="white" />
            </div>
            <div style={{ fontSize: "24px", fontWeight: "700", color: "#1b5e20" }}>{stats.total}</div>
            <div style={{ fontSize: "11px", color: "#2e7d32" }}>Total</div>
          </div>

          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            border: "1px solid rgba(76,175,80,0.2)",
            transition: "transform 0.3s ease",
            textAlign: "center"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
            <div style={{
              width: "36px",
              height: "36px",
              background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 8px"
            }}>
              <HiOutlineRefresh size={16} color="white" />
            </div>
            <div style={{ fontSize: "24px", fontWeight: "700", color: "#1e40af" }}>{stats.new}</div>
            <div style={{ fontSize: "11px", color: "#2e7d32" }}>New</div>
          </div>

          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            border: "1px solid rgba(76,175,80,0.2)",
            transition: "transform 0.3s ease",
            textAlign: "center"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
            <div style={{
              width: "36px",
              height: "36px",
              background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 8px"
            }}>
              <HiOutlineEye size={16} color="white" />
            </div>
            <div style={{ fontSize: "24px", fontWeight: "700", color: "#92400e" }}>{stats.read}</div>
            <div style={{ fontSize: "11px", color: "#2e7d32" }}>Read</div>
          </div>

          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            border: "1px solid rgba(76,175,80,0.2)",
            transition: "transform 0.3s ease",
            textAlign: "center"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
            <div style={{
              width: "36px",
              height: "36px",
              background: "linear-gradient(135deg, #10b981, #34d399)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 8px"
            }}>
              <HiOutlineCheckCircle size={16} color="white" />
            </div>
            <div style={{ fontSize: "24px", fontWeight: "700", color: "#166534" }}>{stats.replied}</div>
            <div style={{ fontSize: "11px", color: "#2e7d32" }}>Replied</div>
          </div>
        </div>

        {/* Filters Card - Mobile Responsive */}
        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "16px",
          marginBottom: "24px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          border: "1px solid rgba(76,175,80,0.2)",
          animation: "slideUp 0.5s ease-out"
        }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}>
            <div style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              justifyContent: "center"
            }}>
              {[
                { value: "all", label: "All", icon: <FaEnvelope size={12} /> },
                { value: "new", label: "New", icon: <HiOutlineRefresh size={12} /> },
                { value: "read", label: "Read", icon: <HiOutlineEye size={12} /> },
                { value: "replied", label: "Replied", icon: <HiOutlineCheckCircle size={12} /> }
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setFilterStatus(filter.value)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "6px 12px",
                    background: filterStatus === filter.value ? "linear-gradient(135deg, #4caf50, #66bb6a)" : "#f5f5f5",
                    color: filterStatus === filter.value ? "white" : "#2e7d32",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "500",
                    transition: "all 0.3s ease",
                    flex: "1",
                    minWidth: "60px",
                    justifyContent: "center"
                  }}
                >
                  {filter.icon}
                  {filter.label}
                </button>
              ))}
            </div>

            <div style={{ position: "relative", width: "100%" }}>
              <HiOutlineSearch style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
                fontSize: "14px"
              }} />
              <input
                type="text"
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px 8px 36px",
                  border: "1px solid #c8e6c9",
                  borderRadius: "10px",
                  fontSize: "13px",
                  outline: "none",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => e.target.style.borderColor = "#4caf50"}
                onBlur={(e) => e.target.style.borderColor = "#c8e6c9"}
              />
            </div>
          </div>
        </div>

        {/* Inquiries Grid - Mobile Optimized */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "16px"
        }}>
          {filteredInquiries.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "white",
              borderRadius: "16px",
              border: "1px solid rgba(76,175,80,0.2)"
            }}>
              <div style={{
                width: "80px",
                height: "80px",
                background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px"
              }}>
                <FaEnvelope size={32} style={{ color: "#4caf50" }} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1b5e20", marginBottom: "4px" }}>No Inquiries Found</h3>
              <p style={{ fontSize: "13px", color: "#2e7d32" }}>No inquiries match your current filters</p>
            </div>
          ) : (
            filteredInquiries.map((inquiry, index) => {
              const statusBadge = getStatusBadge(inquiry.status);
              const propertyTitle = inquiry.property?.title || "Unknown Property";
              const buyerName = inquiry.buyer?.name || "Unknown Buyer";
              const sellerName = inquiry.seller?.name || "Unknown Seller";
              const isReplyOpen = showReply[inquiry._id] || false;
              
              return (
                <div
                  key={inquiry._id}
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                    transition: "all 0.3s ease",
                    animation: `fadeInUp 0.4s ease-out ${index * 0.05}s`,
                    opacity: 0,
                    animationFillMode: "forwards",
                    border: `2px solid ${inquiry.status === 'new' ? '#3b82f6' : 'rgba(76,175,80,0.15)'}`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(76,175,80,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.06)";
                  }}
                >
                  {/* Header */}
                  <div style={{
                    padding: "14px 16px",
                    borderBottom: "1px solid #e8f5e9",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "8px"
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "6px"
                      }}>
                        <div style={{
                          width: "32px",
                          height: "32px",
                          background: "linear-gradient(135deg, #4caf50, #66bb6a)",
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "13px",
                          fontWeight: "700",
                          color: "white",
                          flexShrink: 0
                        }}>
                          <FaUser size={14} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ 
                            fontWeight: "600", 
                            color: "#1b5e20", 
                            fontSize: "13px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}>
                            {buyerName} → {sellerName}
                          </div>
                          <div style={{ 
                            fontSize: "10px", 
                            color: "#2e7d32", 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "4px" 
                          }}>
                            <FaCalendarAlt size={10} />
                            {new Date(inquiry.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "11px",
                        color: "#2e7d32",
                        marginTop: "2px"
                      }}>
                        <HiOutlineHome size={12} />
                        <span style={{ 
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}>
                          <strong>{propertyTitle}</strong>
                        </span>
                      </div>
                    </div>
                    
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "3px",
                      padding: "3px 10px",
                      background: statusBadge.bg,
                      color: statusBadge.color,
                      borderRadius: "16px",
                      fontSize: "10px",
                      fontWeight: "600",
                      whiteSpace: "nowrap",
                      flexShrink: 0
                    }}>
                      {statusBadge.icon}
                      {statusBadge.label}
                    </span>
                  </div>

                  {/* Buyer & Seller Details */}
                  <div style={{
                    padding: "10px 16px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                    background: "#f8fafc",
                    borderBottom: "1px solid #e8f5e9"
                  }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: "9px", color: "#94a3b8", fontWeight: "600", marginBottom: "2px" }}>
                        <FaUser size={10} style={{ display: "inline", marginRight: "3px" }} />
                        BUYER
                      </div>
                      <div style={{ fontSize: "12px", fontWeight: "500", color: "#1b5e20" }}>
                        {buyerName}
                      </div>
                      <div style={{ fontSize: "10px", color: "#475569", display: "flex", alignItems: "center", gap: "3px" }}>
                        <FaEnvelope size={9} />
                        {inquiry.buyer?.email || "No email"}
                      </div>
                      {inquiry.buyer?.phone && (
                        <div style={{ fontSize: "10px", color: "#475569", display: "flex", alignItems: "center", gap: "3px" }}>
                          <FaPhone size={9} />
                          {inquiry.buyer.phone}
                        </div>
                      )}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: "9px", color: "#94a3b8", fontWeight: "600", marginBottom: "2px" }}>
                        <FaBuilding size={10} style={{ display: "inline", marginRight: "3px" }} />
                        SELLER
                      </div>
                      <div style={{ fontSize: "12px", fontWeight: "500", color: "#1b5e20" }}>
                        {sellerName}
                      </div>
                      <div style={{ fontSize: "10px", color: "#475569", display: "flex", alignItems: "center", gap: "3px" }}>
                        <FaEnvelope size={9} />
                        {inquiry.seller?.email || "No email"}
                      </div>
                      {inquiry.seller?.phone && (
                        <div style={{ fontSize: "10px", color: "#475569", display: "flex", alignItems: "center", gap: "3px" }}>
                          <FaPhone size={9} />
                          {inquiry.seller.phone}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* === MESSAGE SECTION - FULL MESSAGE DISPLAY === */}
                  {inquiry.message && (
                    <div style={{
                      padding: "14px 16px",
                      borderBottom: "1px solid #e8f5e9",
                      background: "#f0fdf4"
                    }}>
                      <div style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "8px"
                      }}>
                        <div style={{
                          width: "24px",
                          height: "24px",
                          background: "linear-gradient(135deg, #4caf50, #66bb6a)",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: "2px"
                        }}>
                          <HiOutlineMail size={12} color="white" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            fontSize: "10px", 
                            color: "#2e7d32", 
                            fontWeight: "600",
                            marginBottom: "4px",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px"
                          }}>
                            <span>MESSAGE FROM BUYER</span>
                            {inquiry.status === 'new' && (
                              <span style={{
                                fontSize: "8px",
                                background: "#3b82f6",
                                color: "white",
                                padding: "1px 8px",
                                borderRadius: "10px"
                              }}>
                                NEW
                              </span>
                            )}
                          </div>
                          <p style={{
                            fontSize: "13px",
                            color: "#1b5e20",
                            lineHeight: "1.6",
                            margin: 0,
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word"
                          }}>
                            {inquiry.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* === REPLY SECTION === */}
                  {isReplyOpen ? (
                    <div style={{
                      padding: "14px 16px",
                      background: "#f8fafc",
                      borderBottom: "1px solid #e8f5e9"
                    }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "8px"
                      }}>
                        <HiOutlineReply size={14} style={{ color: "#4caf50" }} />
                        <span style={{ fontSize: "12px", fontWeight: "600", color: "#1b5e20" }}>
                          Reply to {buyerName}
                        </span>
                      </div>
                      <textarea
                        value={replyData[inquiry._id] || ''}
                        onChange={(e) => handleReplyChange(inquiry._id, e.target.value)}
                        placeholder="Type your reply here..."
                        rows="3"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          border: "1px solid #c8e6c9",
                          borderRadius: "10px",
                          fontSize: "13px",
                          fontFamily: "inherit",
                          resize: "vertical",
                          outline: "none",
                          transition: "all 0.3s ease",
                          background: "white"
                        }}
                        onFocus={(e) => e.target.style.borderColor = "#4caf50"}
                        onBlur={(e) => e.target.style.borderColor = "#c8e6c9"}
                      />
                      <div style={{
                        display: "flex",
                        gap: "8px",
                        marginTop: "8px",
                        justifyContent: "flex-end"
                      }}>
                        <button
                          onClick={() => toggleReply(inquiry._id)}
                          style={{
                            padding: "6px 16px",
                            background: "#f1f5f9",
                            color: "#64748b",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "500"
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSendReply(inquiry._id)}
                          style={{
                            padding: "6px 16px",
                            background: "linear-gradient(135deg, #4caf50, #66bb6a)",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "500",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px"
                          }}
                        >
                          <HiOutlinePaperAirplane size={14} />
                          Send Reply
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {/* Actions */}
                  <div style={{
                    padding: "10px 16px",
                    display: "flex",
                    gap: "6px",
                    flexWrap: "wrap"
                  }}>
                    {getStatusActions(inquiry.status).map((action, idx) => (
                      action.value === 'reply' ? (
                        <button
                          key={idx}
                          onClick={() => toggleReply(inquiry._id)}
                          style={{
                            flex: 1,
                            minWidth: "70px",
                            padding: "6px 10px",
                            background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "11px",
                            fontWeight: "500",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "4px",
                            transition: "all 0.3s ease"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-1px)"}
                          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                        >
                          <HiOutlineReply size={12} />
                          Reply
                        </button>
                      ) : (
                        <button
                          key={idx}
                          onClick={() => handleStatusUpdate(inquiry._id, action.value)}
                          disabled={updatingId === inquiry._id}
                          style={{
                            flex: 1,
                            minWidth: "70px",
                            padding: "6px 10px",
                            background: "linear-gradient(135deg, #4caf50, #66bb6a)",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: updatingId === inquiry._id ? "not-allowed" : "pointer",
                            fontSize: "11px",
                            fontWeight: "500",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "4px",
                            opacity: updatingId === inquiry._id ? 0.7 : 1,
                            transition: "all 0.3s ease"
                          }}
                        >
                          {updatingId === inquiry._id ? (
                            <div style={{
                              width: "12px",
                              height: "12px",
                              border: "2px solid white",
                              borderTop: "2px solid transparent",
                              borderRadius: "50%",
                              animation: "spin 0.6s linear infinite"
                            }} />
                          ) : (
                            <>
                              {action.icon}
                              {action.label}
                            </>
                          )}
                        </button>
                      )
                    ))}
                    
                    <button
                      onClick={() => handleDelete(inquiry._id)}
                      disabled={deletingId === inquiry._id}
                      style={{
                        flex: 1,
                        minWidth: "60px",
                        padding: "6px 10px",
                        background: "#fee2e2",
                        color: "#dc2626",
                        border: "none",
                        borderRadius: "8px",
                        cursor: deletingId === inquiry._id ? "not-allowed" : "pointer",
                        fontSize: "11px",
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                        opacity: deletingId === inquiry._id ? 0.7 : 1,
                        transition: "all 0.3s ease"
                      }}
                    >
                      {deletingId === inquiry._id ? (
                        <div style={{
                          width: "12px",
                          height: "12px",
                          border: "2px solid #dc2626",
                          borderTop: "2px solid transparent",
                          borderRadius: "50%",
                          animation: "spin 0.6s linear infinite"
                        }} />
                      ) : (
                        <>
                          <HiOutlineXCircle size={12} />
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Stats */}
        {filteredInquiries.length > 0 && (
          <div style={{
            marginTop: "24px",
            textAlign: "center",
            padding: "12px",
            background: "white",
            borderRadius: "12px",
            border: "1px solid rgba(76,175,80,0.2)"
          }}>
            <p style={{ color: "#2e7d32", fontSize: "12px" }}>
              Showing <strong>{filteredInquiries.length}</strong> of <strong>{inquiries.length}</strong> inquiries
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminInquiries;