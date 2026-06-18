import React, { useEffect, useState } from 'react';
import { adminPropertiesStyles as s } from '../../assets/dummyStyles';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import API_URL from '../../config';
import { 
  HiOutlineTrash, 
  HiOutlineEye, 
  HiOutlineLocationMarker, 
  HiOutlineHome,
  HiOutlineOfficeBuilding,
  HiOutlineCurrencyDollar,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineRefresh,
  HiOutlineSearch,
  HiOutlineUser
} from 'react-icons/hi';
import { FaBuilding, FaHome, FaImage, FaBath, FaBed, FaRulerCombined } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { token } = useAuth();

  // Fetch properties - ✅ FIXED endpoint
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/properties`, {  // ✅ Changed from /all-properties to /properties
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Properties response:", res.data);
        if (res.data.success) {
          setProperties(res.data.properties || []);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to load properties:", error);
        setLoading(false);
      }
    };
    fetchProperties();
  }, [token]);

  // Delete property
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property? This action cannot be undone.")) return;
    
    setDeletingId(id);
    try {
      await axios.delete(`${API_URL}/api/admin/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties(properties.filter((prop) => prop._id !== id));
      alert("Property deleted successfully!");
    } catch (error) {
      alert("Failed to delete property");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter properties
  const filteredProperties = properties.filter((property) => {
    if (filterStatus !== "all" && property.status !== filterStatus) return false;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        property.title?.toLowerCase().includes(searchLower) ||
        property.location?.city?.toLowerCase().includes(searchLower) ||
        property.location?.address?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  // ✅ FIXED: Use correct status values from your database
  const stats = {
    total: properties.length,
    sale: properties.filter(p => p.status === 'sale').length,
    sold: properties.filter(p => p.status === 'sold').length,
    pending: properties.filter(p => p.status === 'pending').length,
  };

  // ✅ Status badge with correct values
  const getStatusBadge = (status) => {
    switch(status) {
      case 'sale':
        return { bg: "#dcfce7", color: "#166534", icon: <HiOutlineCheckCircle size={12} />, label: "Available" };
      case 'sold':
        return { bg: "#fee2e2", color: "#991b1b", icon: <HiOutlineXCircle size={12} />, label: "Sold" };
      case 'pending':
        return { bg: "#fef3c7", color: "#92400e", icon: <HiOutlineRefresh size={12} />, label: "Pending" };
      default:
        return { bg: "#f1f5f9", color: "#475569", icon: null, label: status || "Unknown" };
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
        position: "absolute",
        top: "40%",
        left: "30%",
        width: "300px",
        height: "300px",
        background: "radial-gradient(circle, rgba(56,142,60,0.08) 0%, rgba(56,142,60,0) 70%)",
        borderRadius: "50%",
        animation: "float 25s ease-in-out infinite"
      }} />

      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "40px 24px",
        position: "relative",
        zIndex: 1
      }}>
        {/* Header Section */}
        <div style={{
          textAlign: "center",
          marginBottom: "48px",
          animation: "slideDown 0.6s ease-out"
        }}>
          <div style={{
            display: "inline-block",
            padding: "8px 20px",
            background: "rgba(76,175,80,0.2)",
            backdropFilter: "blur(10px)",
            borderRadius: "50px",
            marginBottom: "20px"
          }}>
            <span style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#2e7d32",
              fontSize: "14px",
              fontWeight: "600"
            }}>
              <FaBuilding size={16} />
              PROPERTY MANAGEMENT
            </span>
          </div>
          <h1 style={{
            fontSize: "42px",
            fontWeight: "800",
            background: "linear-gradient(135deg, #1b5e20 0%, #4caf50 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "12px"
          }}>Property Management</h1>
          <p style={{
            fontSize: "16px",
            color: "#2e7d32",
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            Manage all property listings across the platform
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginBottom: "32px",
          animation: "slideUp 0.5s ease-out"
        }}>
          <div style={{
            background: "white",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            border: "1px solid rgba(76,175,80,0.2)",
            transition: "transform 0.3s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
            <div style={{
              width: "48px",
              height: "48px",
              background: "linear-gradient(135deg, #4caf50, #66bb6a)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px"
            }}>
              <FaHome size={24} color="white" />
            </div>
            <div style={{ fontSize: "32px", fontWeight: "800", color: "#1b5e20" }}>{stats.total}</div>
            <div style={{ fontSize: "14px", color: "#2e7d32" }}>Total Properties</div>
          </div>

          <div style={{
            background: "white",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            border: "1px solid rgba(76,175,80,0.2)",
            transition: "transform 0.3s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
            <div style={{
              width: "48px",
              height: "48px",
              background: "linear-gradient(135deg, #66bb6a, #81c784)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px"
            }}>
              <HiOutlineCheckCircle size={24} color="white" />
            </div>
            <div style={{ fontSize: "32px", fontWeight: "800", color: "#2e7d32" }}>{stats.sale || 0}</div>
            <div style={{ fontSize: "14px", color: "#2e7d32" }}>Available</div>
          </div>

          <div style={{
            background: "white",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            border: "1px solid rgba(76,175,80,0.2)",
            transition: "transform 0.3s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
            <div style={{
              width: "48px",
              height: "48px",
              background: "linear-gradient(135deg, #81c784, #a5d6a7)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px"
            }}>
              <HiOutlineXCircle size={24} color="white" />
            </div>
            <div style={{ fontSize: "32px", fontWeight: "800", color: "#c62828" }}>{stats.sold || 0}</div>
            <div style={{ fontSize: "14px", color: "#2e7d32" }}>Sold</div>
          </div>

          <div style={{
            background: "white",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            border: "1px solid rgba(76,175,80,0.2)",
            transition: "transform 0.3s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
            <div style={{
              width: "48px",
              height: "48px",
              background: "linear-gradient(135deg, #fef3c7, #fde68a)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px"
            }}>
              <HiOutlineRefresh size={24} color="white" />
            </div>
            <div style={{ fontSize: "32px", fontWeight: "800", color: "#92400e" }}>{stats.pending || 0}</div>
            <div style={{ fontSize: "14px", color: "#2e7d32" }}>Pending</div>
          </div>
        </div>

        {/* Filters Card */}
        <div style={{
          background: "white",
          borderRadius: "20px",
          padding: "20px 24px",
          marginBottom: "32px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          border: "1px solid rgba(76,175,80,0.2)",
          animation: "slideUp 0.5s ease-out"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px"
          }}>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {[
                { value: "all", label: "All Properties", icon: <FaHome size={14} /> },
                { value: "sale", label: "Available", icon: <HiOutlineCheckCircle size={14} /> },
                { value: "sold", label: "Sold", icon: <HiOutlineXCircle size={14} /> },
                { value: "pending", label: "Pending", icon: <HiOutlineRefresh size={14} /> }
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setFilterStatus(filter.value)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    background: filterStatus === filter.value ? "linear-gradient(135deg, #4caf50, #66bb6a)" : "#f5f5f5",
                    color: filterStatus === filter.value ? "white" : "#2e7d32",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "500",
                    transition: "all 0.3s ease"
                  }}
                >
                  {filter.icon}
                  {filter.label}
                </button>
              ))}
            </div>

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
                placeholder="Search by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: "10px 16px 10px 40px",
                  width: "260px",
                  border: "1px solid #c8e6c9",
                  borderRadius: "12px",
                  fontSize: "14px",
                  outline: "none",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => e.target.style.borderColor = "#4caf50"}
                onBlur={(e) => e.target.style.borderColor = "#c8e6c9"}
              />
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
          gap: "24px"
        }}>
          {filteredProperties.length === 0 ? (
            <div style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "80px 40px",
              background: "white",
              borderRadius: "20px",
              border: "1px solid rgba(76,175,80,0.2)"
            }}>
              <div style={{
                width: "100px",
                height: "100px",
                background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px"
              }}>
                <FaImage size={40} style={{ color: "#4caf50" }} />
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#1b5e20", marginBottom: "8px" }}>No Properties Found</h3>
              <p style={{ color: "#2e7d32" }}>No properties match your current filters</p>
            </div>
          ) : (
            filteredProperties.map((property, index) => {
              const statusBadge = getStatusBadge(property.status);
              const firstImage = property.images?.[0] || null;
              
              return (
                <div
                  key={property._id}
                  style={{
                    background: "white",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    animation: `fadeInUp 0.5s ease-out ${index * 0.05}s`,
                    opacity: 0,
                    animationFillMode: "forwards",
                    border: "1px solid rgba(76,175,80,0.15)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = "0 20px 40px -12px rgba(76,175,80,0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
                  }}
                >
                  {/* Image Section */}
                  <div style={{ position: "relative", height: "220px", overflow: "hidden" }}>
                    {firstImage ? (
                      <img
                        src={firstImage}
                        alt={property.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.5s ease"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                      />
                    ) : (
                      <div style={{
                        width: "100%",
                        height: "100%",
                        background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <FaHome size={60} style={{ color: "#4caf50", opacity: 0.5 }} />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div style={{
                      position: "absolute",
                      top: "16px",
                      right: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 12px",
                      background: statusBadge.bg,
                      borderRadius: "30px",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: statusBadge.color,
                      backdropFilter: "blur(4px)"
                    }}>
                      {statusBadge.icon}
                      {statusBadge.label}
                    </div>

                    {/* Price Tag */}
                    <div style={{
                      position: "absolute",
                      bottom: "16px",
                      left: "16px",
                      background: "linear-gradient(135deg, #4caf50, #2e7d32)",
                      padding: "6px 14px",
                      borderRadius: "30px",
                      color: "white",
                      fontSize: "14px",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}>
                      <HiOutlineCurrencyDollar size={14} />
                      ₹{property.price?.toLocaleString() || 'N/A'}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div style={{ padding: "20px" }}>
                    <h3 style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#1b5e20",
                      marginBottom: "8px",
                      lineHeight: "1.3"
                    }}>
                      {property.title || "Untitled Property"}
                    </h3>

                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginBottom: "16px",
                      color: "#2e7d32",
                      fontSize: "13px"
                    }}>
                      <HiOutlineLocationMarker size={14} />
                      {property.location?.city || property.location?.address || "Location not specified"}
                    </div>

                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "12px",
                      padding: "12px 0",
                      borderTop: "1px solid #e8f5e9",
                      borderBottom: "1px solid #e8f5e9",
                      marginBottom: "16px"
                    }}>
                      <div style={{ textAlign: "center" }}>
                        <FaBed size={16} style={{ color: "#4caf50", marginBottom: "4px" }} />
                        <div style={{ fontSize: "13px", fontWeight: "600", color: "#1b5e20" }}>{property.bedrooms || 0}</div>
                        <div style={{ fontSize: "10px", color: "#2e7d32" }}>Beds</div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <FaBath size={16} style={{ color: "#4caf50", marginBottom: "4px" }} />
                        <div style={{ fontSize: "13px", fontWeight: "600", color: "#1b5e20" }}>{property.bathrooms || 0}</div>
                        <div style={{ fontSize: "10px", color: "#2e7d32" }}>Baths</div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <FaRulerCombined size={16} style={{ color: "#4caf50", marginBottom: "4px" }} />
                        <div style={{ fontSize: "13px", fontWeight: "600", color: "#1b5e20" }}>{property.area || 0}</div>
                        <div style={{ fontSize: "10px", color: "#2e7d32" }}>sq ft</div>
                      </div>
                    </div>

                    {property.seller && (
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "16px",
                        padding: "8px",
                        background: "#e8f5e9",
                        borderRadius: "12px"
                      }}>
                        <div style={{
                          width: "32px",
                          height: "32px",
                          background: "linear-gradient(135deg, #4caf50, #66bb6a)",
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          fontWeight: "700",
                          color: "white"
                        }}>
                          {property.seller.name?.charAt(0).toUpperCase() || "S"}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "12px", fontWeight: "600", color: "#1b5e20" }}>{property.seller.name || "Seller"}</div>
                          <div style={{ fontSize: "10px", color: "#2e7d32" }}>Seller</div>
                        </div>
                      </div>
                    )}

                    <div style={{ display: "flex", gap: "12px" }}>
                      <Link
                        to={`/property/${property._id}`}
                        target="_blank"
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          padding: "10px",
                          background: "#e8f5e9",
                          color: "#2e7d32",
                          border: "none",
                          borderRadius: "12px",
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: "pointer",
                          textDecoration: "none",
                          transition: "all 0.3s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#c8e6c9";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#e8f5e9";
                        }}
                      >
                        <HiOutlineEye size={16} />
                        View Details
                      </Link>
                      
                      <button
                        onClick={() => handleDelete(property._id)}
                        disabled={deletingId === property._id}
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          padding: "10px",
                          background: deletingId === property._id ? "#ffcdd2" : "#ffebee",
                          color: "#c62828",
                          border: "none",
                          borderRadius: "12px",
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: deletingId === property._id ? "not-allowed" : "pointer",
                          transition: "all 0.3s ease"
                        }}
                        onMouseEnter={(e) => {
                          if (deletingId !== property._id) {
                            e.currentTarget.style.background = "#ffcdd2";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (deletingId !== property._id) {
                            e.currentTarget.style.background = "#ffebee";
                          }
                        }}
                      >
                        {deletingId === property._id ? (
                          <>
                            <div style={{
                              width: "14px",
                              height: "14px",
                              border: "2px solid #c62828",
                              borderTop: "2px solid transparent",
                              borderRadius: "50%",
                              animation: "spin 0.6s linear infinite"
                            }} />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <HiOutlineTrash size={16} />
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Stats */}
        {filteredProperties.length > 0 && (
          <div style={{
            marginTop: "40px",
            textAlign: "center",
            padding: "16px",
            background: "white",
            borderRadius: "16px",
            border: "1px solid rgba(76,175,80,0.2)"
          }}>
            <p style={{ color: "#2e7d32", fontSize: "14px" }}>
              Showing <strong>{filteredProperties.length}</strong> of <strong>{properties.length}</strong> properties
            </p>
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
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminProperties;