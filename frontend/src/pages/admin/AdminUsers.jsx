import React, { useEffect, useState, useMemo, useRef } from 'react';
import { adminUsersStyles as s } from '../../assets/dummyStyles';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import API_URL from '../../config';
import { 
  HiOutlineFilter, HiOutlineMail, HiOutlinePhone, 
  HiOutlineUser, HiOutlineBan, HiOutlineTrash, HiOutlineSearch 
} from 'react-icons/hi';
import { FaUserCheck, FaUserTimes, FaShieldAlt } from 'react-icons/fa';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");
  const [openFilter, setOpenFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filterRef = useRef(null);
  const { token } = useAuth();

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          console.log("Fetched users:", res.data.users); // Debug log
          setUsers(res.data.users);
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to load users:", err);
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  // Handle click outside filter dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setOpenFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter users by role and search
  const filteredUsers = useMemo(() => {
    let result = [...users]; // Create a copy
    
    console.log("Current roleFilter:", roleFilter); // Debug log
    console.log("All users roles:", users.map(u => ({ name: u.name, role: u.role }))); // Debug log
    
    // Apply role filter (case insensitive)
    if (roleFilter !== "all") {
      result = result.filter((user) => {
        // Handle both lowercase and uppercase roles
        const userRole = user.role?.toLowerCase();
        const filterRole = roleFilter.toLowerCase();
        return userRole === filterRole;
      });
      console.log("Filtered by role:", result.length); // Debug log
    }
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter((user) => 
        (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.phone || '').includes(searchTerm)
      );
      console.log("Filtered by search:", result.length); // Debug log
    }
    
    return result;
  }, [users, roleFilter, searchTerm]);

  // Block/unblock user
  const handleBlock = async (id, isCurrentlyBlocked) => {
    try {
      const res = await axios.patch(
        `${API_URL}/api/admin/users/${id}/block`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setUsers(
          users.map((u) => 
            u._id === id ? { ...u, isBlocked: !isCurrentlyBlocked } : u
          )
        );
      }
    } catch (error) {
      alert("Operation failed");
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

    try {
      await axios.delete(`${API_URL}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u._id !== id));
    } catch (error) {
      alert("Failed to delete user");
    }
  };

  // Calculate user statistics
  const userStats = {
    total: users.length,
    buyers: users.filter(u => u.role?.toLowerCase() === 'buyer').length,
    sellers: users.filter(u => u.role?.toLowerCase() === 'seller').length,
    admins: users.filter(u => u.role?.toLowerCase() === 'admin').length,
    active: users.filter(u => !u.isBlocked).length,
    blocked: users.filter(u => u.isBlocked).length
  };

  if (loading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#f8fafc"
      }}>
        <div style={{
          width: "40px",
          height: "40px",
          border: "3px solid #e2e8f0",
          borderTop: "3px solid #3b82f6",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }}></div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const getRoleBadgeStyle = (role) => {
    const roleLower = role?.toLowerCase();
    switch(roleLower) {
      case "admin":
        return { bg: "#fef3c7", color: "#92400e", icon: <FaShieldAlt size={12} />, label: "ADMIN" };
      case "seller":
        return { bg: "#dcfce7", color: "#166534", icon: <FaUserCheck size={12} />, label: "SELLER" };
      case "buyer":
        return { bg: "#dbeafe", color: "#1e40af", icon: <HiOutlineUser size={12} />, label: "BUYER" };
      default:
        return { bg: "#f1f5f9", color: "#64748b", icon: <HiOutlineUser size={12} />, label: (role || "UNKNOWN").toUpperCase() };
    }
  };

  return (
    <div style={{ padding: "24px", background: "#f8fafc", minHeight: "100vh" }}>
      {/* Stats Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "16px",
        marginBottom: "24px"
      }}>
        <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "28px", fontWeight: "700", color: "#3b82f6" }}>{userStats.total}</div>
          <div style={{ fontSize: "13px", color: "#64748b" }}>Total Users</div>
        </div>
        <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "28px", fontWeight: "700", color: "#10b981" }}>{userStats.active}</div>
          <div style={{ fontSize: "13px", color: "#64748b" }}>Active Users</div>
        </div>
        <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "28px", fontWeight: "700", color: "#f59e0b" }}>{userStats.sellers}</div>
          <div style={{ fontSize: "13px", color: "#64748b" }}>Sellers</div>
        </div>
        <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "28px", fontWeight: "700", color: "#ef4444" }}>{userStats.blocked}</div>
          <div style={{ fontSize: "13px", color: "#64748b" }}>Blocked</div>
        </div>
      </div>

      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: "16px",
        marginBottom: "24px"
      }}>
        <div>
          <h1 style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#1e293b",
            marginBottom: "8px"
          }}>User Management</h1>
          <p style={{
            fontSize: "14px",
            color: "#64748b"
          }}>
            Monitor platform users and manage access levels
          </p>
        </div>
        
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {/* Search Bar */}
          <div style={{ position: "relative" }}>
            <HiOutlineSearch style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8"
            }} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "10px 16px 10px 40px",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                fontSize: "14px",
                width: "250px",
                outline: "none",
                transition: "all 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
              onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>
          
          {/* Filter Dropdown */}
          <div ref={filterRef} style={{ position: "relative" }}>
            <button
              onClick={() => setOpenFilter(!openFilter)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.2s",
                fontSize: "14px",
                fontWeight: "500",
                color: "#475569"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
              onMouseLeave={(e) => e.currentTarget.style.background = "white"}
            >
              <HiOutlineFilter size={18} />
              Filter
              {roleFilter !== "all" && (
                <span style={{
                  background: "#3b82f6",
                  color: "white",
                  borderRadius: "10px",
                  padding: "2px 8px",
                  fontSize: "11px"
                }}>
                  {roleFilter}
                </span>
              )}
            </button>

            {openFilter && (
              <div style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: "8px",
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                zIndex: 50,
                minWidth: "160px",
                overflow: "hidden"
              }}>
                {[
                  { value: "all", label: "All Users", count: userStats.total },
                  { value: "buyer", label: "Buyers", count: userStats.buyers },
                  { value: "seller", label: "Sellers", count: userStats.sellers },
                  { value: "admin", label: "Admins", count: userStats.admins }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setRoleFilter(option.value);
                      setOpenFilter(false);
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 16px",
                      background: roleFilter === option.value ? "#eff6ff" : "white",
                      color: roleFilter === option.value ? "#3b82f6" : "#475569",
                      fontWeight: roleFilter === option.value ? "600" : "400",
                      border: "none",
                      cursor: "pointer",
                      transition: "background 0.2s",
                      fontSize: "14px"
                    }}
                    onMouseEnter={(e) => {
                      if (roleFilter !== option.value) {
                        e.currentTarget.style.background = "#f8fafc";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (roleFilter !== option.value) {
                        e.currentTarget.style.background = "white";
                      }
                    }}
                  >
                    <span>{option.label}</span>
                    <span style={{
                      fontSize: "12px",
                      color: "#94a3b8",
                      background: "#f1f5f9",
                      padding: "2px 8px",
                      borderRadius: "12px"
                    }}>{option.count}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div style={{
        background: "white",
        borderRadius: "20px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        overflow: "hidden"
      }}>
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid #f1f5f9",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h3 style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#1e293b"
          }}>Platform Users</h3>
          <div style={{
            fontSize: "14px",
            color: "#64748b"
          }}>
            Showing: <span style={{ fontWeight: "600", color: "#1e293b" }}>{filteredUsers.length}</span> of {users.length} users
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "800px"
          }}>
            <thead style={{ background: "#f8fafc" }}>
              <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                <th style={{ textAlign: "left", padding: "16px 24px", fontSize: "12px", fontWeight: "600", color: "#64748b" }}>User</th>
                <th style={{ textAlign: "center", padding: "16px 24px", fontSize: "12px", fontWeight: "600", color: "#64748b" }}>Role</th>
                <th style={{ textAlign: "left", padding: "16px 24px", fontSize: "12px", fontWeight: "600", color: "#64748b" }}>Contact</th>
                <th style={{ textAlign: "center", padding: "16px 24px", fontSize: "12px", fontWeight: "600", color: "#64748b" }}>Status</th>
                <th style={{ textAlign: "right", padding: "16px 24px", fontSize: "12px", fontWeight: "600", color: "#64748b" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{
                    textAlign: "center",
                    padding: "60px",
                    color: "#64748b"
                  }}>
                    No users found matching the selected filter
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => {
                  const roleStyle = getRoleBadgeStyle(user.role);
                  return (
                    <tr 
                      key={user._id} 
                      style={{
                        borderBottom: index !== filteredUsers.length - 1 ? "1px solid #f1f5f9" : "none",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                    >
                      <td style={{ padding: "20px 24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{
                            width: "44px",
                            height: "44px",
                            background: user.profilePic ? "none" : "#eff6ff",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}>
                            {user.profilePic ? (
                              <img src={user.profilePic} alt={user.name} style={{
                                width: "44px",
                                height: "44px",
                                borderRadius: "12px",
                                objectFit: "cover"
                              }} />
                            ) : (
                              <span style={{
                                fontSize: "18px",
                                fontWeight: "600",
                                color: "#3b82f6"
                              }}>
                                {user.name?.[0]?.toUpperCase() || "U"}
                              </span>
                            )}
                          </div>
                          <div>
                            <div style={{
                              fontWeight: "600",
                              color: "#1e293b",
                              marginBottom: "4px"
                            }}>{user.name}</div>
                            <div style={{
                              fontSize: "11px",
                              color: "#94a3b8"
                            }}>ID: {user._id?.slice(-8)}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td style={{ textAlign: "center", padding: "20px 24px" }}>
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "6px 12px",
                          background: roleStyle.bg,
                          color: roleStyle.color,
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600"
                        }}>
                          {roleStyle.icon}
                          {roleStyle.label}
                        </span>
                      </td>
                      
                      <td style={{ padding: "20px 24px" }}>
                        <div>
                          <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "13px",
                            color: "#475569",
                            marginBottom: "4px"
                          }}>
                            <HiOutlineMail size={14} style={{ color: "#94a3b8" }} />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              fontSize: "13px",
                              color: "#475569"
                            }}>
                              <HiOutlinePhone size={14} style={{ color: "#94a3b8" }} />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td style={{ textAlign: "center", padding: "20px 24px" }}>
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                          background: user.isBlocked ? "#fef2f2" : "#f0fdf4",
                          color: user.isBlocked ? "#dc2626" : "#10b981"
                        }}>
                          {user.isBlocked ? <FaUserTimes size={12} /> : <FaUserCheck size={12} />}
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      
                      <td style={{ textAlign: "right", padding: "20px 24px" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                          <button
                            onClick={() => handleBlock(user._id, user.isBlocked)}
                            style={{
                              padding: "8px 12px",
                              background: user.isBlocked ? "#f0fdf4" : "#fef2f2",
                              border: "none",
                              borderRadius: "10px",
                              cursor: "pointer",
                              transition: "all 0.2s",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              fontSize: "12px",
                              fontWeight: "500",
                              color: user.isBlocked ? "#10b981" : "#dc2626"
                            }}
                            title={user.isBlocked ? "Unblock User" : "Block User"}
                          >
                            <HiOutlineBan size={16} />
                            {user.isBlocked ? "Unblock" : "Block"}
                          </button>
                          
                          <button
                            onClick={() => handleDelete(user._id)}
                            style={{
                              padding: "8px 12px",
                              background: "#fef2f2",
                              border: "none",
                              borderRadius: "10px",
                              cursor: "pointer",
                              transition: "all 0.2s",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              fontSize: "12px",
                              fontWeight: "500",
                              color: "#dc2626"
                            }}
                            title="Delete User"
                          >
                            <HiOutlineTrash size={16} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;