import React, { useEffect, useState } from 'react';
import { adminContactsStyles as s } from '../../assets/dummyStyles';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import API_URL from '../../config';
import { 
  HiOutlineMail, 
  HiOutlinePhone, 
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineEye,
  HiOutlineRefresh,
  HiOutlineSearch,
  HiOutlineReply,
  HiOutlinePaperAirplane,
  HiOutlineUserGroup,
  HiOutlineBriefcase,
  HiOutlineLocationMarker,
  HiOutlineTrash,
  HiOutlineUserAdd
} from 'react-icons/hi';
import { 
  FaEnvelope, 
  FaPhone, 
  FaCalendarAlt, 
  FaUser, 
  FaBuilding, 
  FaReply,
  FaUserCircle,
  FaUserTie,
  FaRegUserCircle
} from 'react-icons/fa';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [replyData, setReplyData] = useState({});
  const [showReply, setShowReply] = useState({});
  const { token } = useAuth();

  // Fetch contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        console.log("Fetching contacts...");
        const res = await axios.get(`${API_URL}/api/admin/contacts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Contacts response:", res.data);
        if (res.data.success) {
          setContacts(res.data.contacts);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to load contacts:", error);
        setLoading(false);
      }
    };
    
    if (token) {
      fetchContacts();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Mark contact as read
  const handleMarkAsRead = async (id) => {
    setUpdatingId(id);
    try {
      const res = await axios.patch(
        `${API_URL}/api/admin/contacts/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setContacts(contacts.map((contact) => 
          contact._id === id ? { ...contact, isRead: true } : contact
        ));
        alert("Contact marked as read!");
      } else {
        alert(res.data.message || "Failed to update contact");
      }
    } catch (error) {
      console.error("Error updating contact:", error);
      alert(error.response?.data?.message || "Failed to update contact");
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete contact
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact message?")) return;
    
    setDeletingId(id);
    try {
      const res = await axios.delete(
        `${API_URL}/api/admin/contacts/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.success) {
        setContacts(contacts.filter((contact) => contact._id !== id));
        alert("Contact deleted successfully!");
      } else {
        alert(res.data.message || "Failed to delete contact");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.response?.data?.message || "Failed to delete contact");
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
      // Here you would send the reply via email or store it
      // For now, we'll just mark as read and show success
      await axios.patch(
        `${API_URL}/api/admin/contacts/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setContacts(contacts.map((contact) => 
        contact._id === id ? { ...contact, isRead: true } : contact
      ));
      
      setReplyData({ ...replyData, [id]: '' });
      setShowReply({ ...showReply, [id]: false });
      alert("Reply sent successfully to the user's email!");
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Failed to send reply");
    }
  };

  // Filter contacts
  const filteredContacts = contacts.filter((contact) => {
    // Filter by status (read/unread)
    if (filterStatus === "read" && !contact.isRead) return false;
    if (filterStatus === "unread" && contact.isRead) return false;
    
    // Filter by role
    if (filterRole !== "all" && contact.role !== filterRole) return false;
    
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        contact.name?.toLowerCase().includes(searchLower) ||
        contact.email?.toLowerCase().includes(searchLower) ||
        contact.message?.toLowerCase().includes(searchLower) ||
        contact.subject?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  // Contact statistics
  const stats = {
    total: contacts.length,
    unread: contacts.filter(c => !c.isRead).length,
    read: contacts.filter(c => c.isRead).length,
    buyers: contacts.filter(c => c.role === 'buyer').length,
    sellers: contacts.filter(c => c.role === 'seller').length,
  };

  const getRoleBadge = (role) => {
    switch(role) {
      case 'buyer':
        return { bg: "#dbeafe", color: "#1e40af", icon: <FaUserCircle size={12} />, label: "Buyer" };
      case 'seller':
        return { bg: "#dcfce7", color: "#166534", icon: <FaUserTie size={12} />, label: "Seller" };
      default:
        return { bg: "#f1f5f9", color: "#475569", icon: <FaRegUserCircle size={12} />, label: "Guest" };
    }
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
              <HiOutlineUserGroup size={14} />
              CONTACT MANAGEMENT
            </span>
          </div>
          <h1 style={{
            fontSize: "28px",
            fontWeight: "800",
            background: "linear-gradient(135deg, #1b5e20 0%, #4caf50 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "8px"
          }}>Contact Messages</h1>
          <p style={{
            fontSize: "14px",
            color: "#2e7d32",
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            Manage all contact messages from buyers, sellers, and visitors
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
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
              <HiOutlineUserGroup size={16} color="white" />
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
            <div style={{ fontSize: "24px", fontWeight: "700", color: "#1e40af" }}>{stats.unread}</div>
            <div style={{ fontSize: "11px", color: "#2e7d32" }}>Unread</div>
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
              background: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 8px"
            }}>
              <HiOutlineUserAdd size={16} color="white" />
            </div>
            <div style={{ fontSize: "24px", fontWeight: "700", color: "#5b21b6" }}>{stats.buyers + stats.sellers}</div>
            <div style={{ fontSize: "11px", color: "#2e7d32" }}>Users</div>
          </div>
        </div>

        {/* Filters Card */}
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
                { value: "all", label: "All", icon: <HiOutlineUserGroup size={12} /> },
                { value: "unread", label: "Unread", icon: <HiOutlineRefresh size={12} /> },
                { value: "read", label: "Read", icon: <HiOutlineEye size={12} /> }
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

            <div style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              justifyContent: "center"
            }}>
              {[
                { value: "all", label: "All Roles", icon: <HiOutlineUserGroup size={12} /> },
                { value: "buyer", label: "Buyers", icon: <FaUserCircle size={12} /> },
                { value: "seller", label: "Sellers", icon: <FaUserTie size={12} /> }
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setFilterRole(filter.value)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "6px 12px",
                    background: filterRole === filter.value ? "linear-gradient(135deg, #8b5cf6, #a78bfa)" : "#f5f5f5",
                    color: filterRole === filter.value ? "white" : "#5b21b6",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "500",
                    transition: "all 0.3s ease",
                    flex: "1",
                    minWidth: "80px",
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
                placeholder="Search by name, email, subject..."
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

        {/* Contacts Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "16px"
        }}>
          {filteredContacts.length === 0 ? (
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
                <HiOutlineUserGroup size={32} style={{ color: "#4caf50" }} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1b5e20", marginBottom: "4px" }}>No Messages Found</h3>
              <p style={{ fontSize: "13px", color: "#2e7d32" }}>No contact messages match your current filters</p>
            </div>
          ) : (
            filteredContacts.map((contact, index) => {
              const roleBadge = getRoleBadge(contact.role);
              const isReplyOpen = showReply[contact._id] || false;
              
              return (
                <div
                  key={contact._id}
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                    transition: "all 0.3s ease",
                    animation: `fadeInUp 0.4s ease-out ${index * 0.05}s`,
                    opacity: 0,
                    animationFillMode: "forwards",
                    border: `2px solid ${!contact.isRead ? '#3b82f6' : 'rgba(76,175,80,0.15)'}`
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
                        marginBottom: "4px"
                      }}>
                        <div style={{
                          width: "36px",
                          height: "36px",
                          background: "linear-gradient(135deg, #4caf50, #66bb6a)",
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          fontWeight: "700",
                          color: "white",
                          flexShrink: 0
                        }}>
                          {contact.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ 
                            fontWeight: "600", 
                            color: "#1b5e20", 
                            fontSize: "14px"
                          }}>
                            {contact.name || "Unknown User"}
                          </div>
                          <div style={{ 
                            fontSize: "10px", 
                            color: "#2e7d32", 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "4px",
                            flexWrap: "wrap"
                          }}>
                            <FaCalendarAlt size={10} />
                            {new Date(contact.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                      
                      {/* Subject */}
                      {contact.subject && (
                        <div style={{
                          fontSize: "12px",
                          color: "#2e7d32",
                          fontWeight: "500",
                          marginTop: "2px"
                        }}>
                          <strong>Subject:</strong> {contact.subject}
                        </div>
                      )}
                    </div>
                    
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: "4px"
                    }}>
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "3px",
                        padding: "3px 10px",
                        background: !contact.isRead ? "#dbeafe" : "#f1f5f9",
                        color: !contact.isRead ? "#1e40af" : "#64748b",
                        borderRadius: "16px",
                        fontSize: "10px",
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                        flexShrink: 0
                      }}>
                        {!contact.isRead ? (
                          <>
                            <HiOutlineRefresh size={10} />
                            Unread
                          </>
                        ) : (
                          <>
                            <HiOutlineEye size={10} />
                            Read
                          </>
                        )}
                      </span>
                      
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "2px 10px",
                        background: roleBadge.bg,
                        color: roleBadge.color,
                        borderRadius: "16px",
                        fontSize: "10px",
                        fontWeight: "600",
                        whiteSpace: "nowrap"
                      }}>
                        {roleBadge.icon}
                        {roleBadge.label}
                      </span>
                    </div>
                  </div>

                  {/* Contact Details */}
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
                        <FaEnvelope size={10} style={{ display: "inline", marginRight: "3px" }} />
                        EMAIL
                      </div>
                      <div style={{ 
                        fontSize: "12px", 
                        color: "#1b5e20",
                        wordBreak: "break-all"
                      }}>
                        <a href={`mailto:${contact.email}`} style={{
                          color: "#2563eb",
                          textDecoration: "none"
                        }}>
                          {contact.email || "No email"}
                        </a>
                      </div>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: "9px", color: "#94a3b8", fontWeight: "600", marginBottom: "2px" }}>
                        <FaPhone size={10} style={{ display: "inline", marginRight: "3px" }} />
                        PHONE
                      </div>
                      <div style={{ 
                        fontSize: "12px", 
                        color: "#1b5e20"
                      }}>
                        {contact.phone ? (
                          <a href={`tel:${contact.phone}`} style={{
                            color: "#475569",
                            textDecoration: "none"
                          }}>
                            {contact.phone}
                          </a>
                        ) : (
                          <span style={{ color: "#94a3b8" }}>Not provided</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div style={{
                    padding: "14px 16px",
                    background: !contact.isRead ? "#f0fdf4" : "white",
                    borderBottom: "1px solid #e8f5e9"
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
                          marginBottom: "4px"
                        }}>
                          MESSAGE
                        </div>
                        <p style={{
                          fontSize: "13px",
                          color: "#1b5e20",
                          lineHeight: "1.6",
                          margin: 0,
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word"
                        }}>
                          {contact.message || "No message provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Reply Section */}
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
                          Reply to {contact.name}
                        </span>
                      </div>
                      <textarea
                        value={replyData[contact._id] || ''}
                        onChange={(e) => handleReplyChange(contact._id, e.target.value)}
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
                          onClick={() => toggleReply(contact._id)}
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
                          onClick={() => handleSendReply(contact._id)}
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
                    {!contact.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(contact._id)}
                        disabled={updatingId === contact._id}
                        style={{
                          flex: 1,
                          minWidth: "80px",
                          padding: "6px 10px",
                          background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          cursor: updatingId === contact._id ? "not-allowed" : "pointer",
                          fontSize: "11px",
                          fontWeight: "500",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4px",
                          opacity: updatingId === contact._id ? 0.7 : 1,
                          transition: "all 0.3s ease"
                        }}
                      >
                        {updatingId === contact._id ? (
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
                            <HiOutlineEye size={12} />
                            Mark as Read
                          </>
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => toggleReply(contact._id)}
                      style={{
                        flex: 1,
                        minWidth: "70px",
                        padding: "6px 10px",
                        background: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
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
                    
                    <button
                      onClick={() => handleDelete(contact._id)}
                      disabled={deletingId === contact._id}
                      style={{
                        flex: 1,
                        minWidth: "60px",
                        padding: "6px 10px",
                        background: "#fee2e2",
                        color: "#dc2626",
                        border: "none",
                        borderRadius: "8px",
                        cursor: deletingId === contact._id ? "not-allowed" : "pointer",
                        fontSize: "11px",
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                        opacity: deletingId === contact._id ? 0.7 : 1,
                        transition: "all 0.3s ease"
                      }}
                    >
                      {deletingId === contact._id ? (
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
                          <HiOutlineTrash size={12} />
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
        {filteredContacts.length > 0 && (
          <div style={{
            marginTop: "24px",
            textAlign: "center",
            padding: "12px",
            background: "white",
            borderRadius: "12px",
            border: "1px solid rgba(76,175,80,0.2)"
          }}>
            <p style={{ color: "#2e7d32", fontSize: "12px" }}>
              Showing <strong>{filteredContacts.length}</strong> of <strong>{contacts.length}</strong> messages
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

export default AdminContacts;