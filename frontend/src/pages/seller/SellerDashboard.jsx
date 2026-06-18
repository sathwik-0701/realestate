import React, { useEffect, useState } from 'react';
import SellerLayout from '../../components/common/SellerLayout';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import API_URL from '../../config';
import { Link, useNavigate } from 'react-router-dom';
import { 
  HiOutlineEye, 
  HiOutlineUserGroup, 
  HiOutlineClipboardList,
  HiOutlineCurrencyDollar,
  HiOutlineDownload,
  HiOutlinePlus,
  HiOutlineTrendingUp,
  HiOutlineLightBulb,
  HiOutlineChevronRight,
  HiOutlineChat,
  HiOutlineHome,
  HiOutlineCalendar
} from 'react-icons/hi';

const SellerDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeListings: 0,
    soldProperties: 0,
    totalInquiries: 0,
    totalViews: 0
  });
  const [recentProperties, setRecentProperties] = useState([]);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await axios.get(`${API_URL}/api/property/seller/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (statsRes.data.success) setStats(statsRes.data.stats);

        const propsRes = await axios.get(`${API_URL}/api/property/my`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (propsRes.data.success) setRecentProperties(propsRes.data.properties.slice(0, 3));

        const inqRes = await axios.get(`${API_URL}/api/inquiry/seller`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (inqRes.data.success) setRecentInquiries(inqRes.data.inquires.slice(0, 4));
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
    else setLoading(false);
  }, [token]);

  const handleExportCSV = () => {
    if (recentProperties.length === 0) return alert("No listings to export");
    const headers = ["ID", "Title", "Type", "Price", "City", "Area", "Status", "Views", "Created At"];
    const rows = recentProperties.map(p => [
      p._id,
      `"${p.title.replace(/"/g, '""')}"`,
      p.propertyType,
      p.price,
      p.city,
      p.area,
      p.status,
      p.views || 0,
      p.createdAt
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "seller_dashboard_stats.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'sale' ? 'sold' : 'sale';
    try {
      const res = await axios.patch(
        `${API_URL}/api/property/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setRecentProperties(recentProperties.map(p => p._id === id ? { ...p, status: newStatus } : p));
        const statsRes = await axios.get(`${API_URL}/api/property/seller/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (statsRes.data.success) setStats(statsRes.data.stats);
      }
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleDeleteProperty = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      const res = await axios.delete(`${API_URL}/api/property/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setRecentProperties(recentProperties.filter(p => p._id !== id));
        fetchDashboardData();
        alert("Listing deleted successfully");
      }
    } catch (error) {
      alert("Failed to delete property");
    }
  };

  if (loading) {
    return (
      <SellerLayout>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '60vh'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid rgba(13,148,136,0.15)',
            borderTop: '4px solid #0d9488',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </SellerLayout>
    );
  }

  const statCards = [
    { title: "Total Views", value: stats.totalViews, icon: <HiOutlineEye size={22} />, color: "#8b5cf6", bg: "rgba(139,92,246,0.12)" },
    { title: "Active Leads", value: stats.totalInquiries, icon: <HiOutlineUserGroup size={22} />, color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
    { title: "Live Listings", value: stats.activeListings, icon: <HiOutlineClipboardList size={22} />, color: "#0d9488", bg: "rgba(13,148,136,0.12)" },
    { title: "Properties Sold", value: stats.soldProperties, icon: <HiOutlineCurrencyDollar size={22} />, color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  ];

  return (
    <SellerLayout>
      <div style={{
        padding: isMobile ? '16px 12px' : '32px',
        background: '#f8fafc',
        minHeight: '100vh',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: isMobile ? '16px' : '0',
          marginBottom: isMobile ? '24px' : '32px'
        }}>
          <div>
            <h1 style={{
              fontSize: isMobile ? '24px' : '32px',
              fontWeight: '800',
              color: '#0f172a',
              marginBottom: '4px',
              letterSpacing: '-0.5px'
            }}>
              Welcome back, {user?.name || "Seller"}! 👋
            </h1>
            <p style={{
              fontSize: isMobile ? '14px' : '16px',
              color: '#64748b'
            }}>
              Here's what's happening with your property portfolio today.
            </p>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '10px',
            width: isMobile ? '100%' : 'auto'
          }}>
            <button 
              onClick={handleExportCSV}
              style={{
                padding: isMobile ? '12px 20px' : '10px 20px',
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                color: '#475569',
                fontWeight: '600',
                fontSize: isMobile ? '14px' : '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                flex: isMobile ? '1' : 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#0d9488';
                e.currentTarget.style.color = '#0d9488';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.color = '#475569';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <HiOutlineDownload size={18} /> Export Stats
            </button>
            <button 
              onClick={() => navigate('/add-property')}
              style={{
                padding: isMobile ? '12px 20px' : '10px 20px',
                background: 'linear-gradient(135deg, #0d9488, #0f766e)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontWeight: '600',
                fontSize: isMobile ? '14px' : '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                flex: isMobile ? '1' : 'none',
                boxShadow: '0 4px 15px rgba(13,148,136,0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(13,148,136,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(13,148,136,0.3)';
              }}
            >
              <HiOutlinePlus size={18} /> Add Property
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: isMobile ? '12px' : '20px',
          marginBottom: isMobile ? '24px' : '32px'
        }}>
          {statCards.map((stat, idx) => (
            <div 
              key={idx}
              style={{
                background: 'white',
                padding: isMobile ? '18px 14px' : '24px',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: isMobile ? '8px' : '12px'
              }}>
                <div style={{
                  width: isMobile ? '40px' : '48px',
                  height: isMobile ? '40px' : '48px',
                  background: stat.bg,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: stat.color
                }}>
                  {stat.icon}
                </div>
                <span style={{
                  fontSize: isMobile ? '9px' : '11px',
                  color: '#94a3b8',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {stat.title}
                </span>
              </div>
              <div style={{
                fontSize: isMobile ? '26px' : '34px',
                fontWeight: '800',
                color: '#0f172a'
              }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Two Column Widgets */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? '16px' : '24px',
          marginBottom: isMobile ? '24px' : '32px'
        }}>
          {/* Inquiries Widget */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: isMobile ? '18px' : '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <div>
                <h3 style={{
                  fontSize: isMobile ? '16px' : '18px',
                  fontWeight: '700',
                  color: '#0f172a',
                  marginBottom: '2px'
                }}>Active Leads</h3>
                <p style={{
                  fontSize: isMobile ? '12px' : '13px',
                  color: '#64748b'
                }}>Recent buyer inquiries</p>
              </div>
              <div style={{
                background: '#fef3c7',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '700',
                color: '#d97706'
              }}>
                {stats.totalInquiries}
              </div>
            </div>

            {recentInquiries.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '30px 10px',
                color: '#94a3b8',
                fontSize: '14px'
              }}>No inquiries yet.</div>
            ) : (
              recentInquiries.map((inq) => (
                <div 
                  key={inq._id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 14px',
                    background: '#f8fafc',
                    borderRadius: '10px',
                    marginBottom: '8px',
                    borderLeft: `3px solid ${inq.isRead ? '#e2e8f0' : '#f59e0b'}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: '#ccfbf1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0d9488',
                      flexShrink: 0
                    }}>
                      <HiOutlineChat size={16} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontSize: isMobile ? '13px' : '14px',
                        fontWeight: '600',
                        color: '#0f172a',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {inq.buyer?.name || 'Buyer'}
                      </div>
                      <div style={{
                        fontSize: isMobile ? '11px' : '12px',
                        color: '#64748b',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {inq.property?.title || 'Property'}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0, marginLeft: '8px' }}>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                      {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                    <span style={{
                      padding: '2px 10px',
                      borderRadius: '20px',
                      fontSize: '9px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      background: inq.isRead ? '#f1f5f9' : '#fef3c7',
                      color: inq.isRead ? '#64748b' : '#d97706'
                    }}>
                      {inq.isRead ? 'read' : 'new'}
                    </span>
                  </div>
                </div>
              ))
            )}
            {recentInquiries.length > 0 && (
              <div style={{ marginTop: '12px', textAlign: 'right' }}>
                <Link to="/inquiries" style={{
                  fontSize: '13px',
                  color: '#0d9488',
                  fontWeight: '700',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  View All <HiOutlineChevronRight size={14} />
                </Link>
              </div>
            )}
          </div>

          {/* Tips Widget */}
          <div style={{
            background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)',
            borderRadius: '16px',
            padding: isMobile ? '18px' : '24px',
            border: '1px solid #d1fae5',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
          }}>
            <h3 style={{
              fontSize: isMobile ? '16px' : '18px',
              fontWeight: '700',
              color: '#0f172a',
              marginBottom: '4px'
            }}>💡 Success Tips</h3>
            <p style={{
              fontSize: isMobile ? '12px' : '13px',
              color: '#64748b',
              marginBottom: '16px'
            }}>Optimize your listings</p>

            <div style={{
              background: 'white',
              padding: isMobile ? '14px' : '16px',
              borderRadius: '12px',
              marginBottom: '12px',
              border: '1px solid #d1fae5'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <HiOutlineLightBulb size={18} style={{ color: '#f59e0b' }} />
                <strong style={{ fontSize: isMobile ? '13px' : '14px', color: '#0f172a' }}>High Quality Images</strong>
              </div>
              <p style={{ fontSize: isMobile ? '12px' : '13px', color: '#475569', margin: 0 }}>
                5+ bright, clear images get 60% more inquiries.
              </p>
            </div>

            <div style={{
              background: 'white',
              padding: isMobile ? '14px' : '16px',
              borderRadius: '12px',
              border: '1px solid #d1fae5'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <HiOutlineTrendingUp size={18} style={{ color: '#0d9488' }} />
                <strong style={{ fontSize: isMobile ? '13px' : '14px', color: '#0f172a' }}>Highlight Amenities</strong>
              </div>
              <p style={{ fontSize: isMobile ? '12px' : '13px', color: '#475569', margin: 0 }}>
                Specify Parking, Gym, Wi-Fi, Lift for better visibility.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Listings */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: isMobile ? '16px' : '20px',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <h3 style={{
              fontSize: isMobile ? '18px' : '20px',
              fontWeight: '700',
              color: '#0f172a'
            }}>Recent Listings</h3>
            <Link to="/my-properties" style={{
              fontSize: '13px',
              color: '#0d9488',
              fontWeight: '700',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              Manage All <HiOutlineChevronRight size={14} />
            </Link>
          </div>

          {recentProperties.length === 0 ? (
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '50px 20px',
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <HiOutlineHome size={40} style={{ color: '#94a3b8', marginBottom: '12px' }} />
              <p style={{ color: '#64748b' }}>No listings yet. Add your first property!</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: isMobile ? '16px' : '20px'
            }}>
              {recentProperties.map((property) => {
                const firstImage = property.images?.[0] || null;
                return (
                  <div 
                    key={property._id}
                    style={{
                      background: 'white',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-6px)';
                      e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                    }}
                  >
                    <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                      {firstImage ? (
                        <img 
                          src={firstImage} 
                          alt={property.title}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <HiOutlineHome size={40} style={{ color: '#cbd5e1' }} />
                        </div>
                      )}
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        padding: '4px 14px',
                        background: property.status === 'sale' ? '#dcfce7' : '#fce8e6',
                        color: property.status === 'sale' ? '#137333' : '#c5221f',
                        borderRadius: '30px',
                        fontSize: '10px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        border: `1px solid ${property.status === 'sale' ? '#bbf7d0' : '#fecaca'}`
                      }}>
                        {property.status === 'sale' ? 'Live' : 'Sold'}
                      </div>
                      <div style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '12px',
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: isMobile ? '14px' : '16px',
                        fontWeight: '700',
                        backdropFilter: 'blur(4px)'
                      }}>
                        ₹{property.price?.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div style={{ padding: isMobile ? '16px' : '20px' }}>
                      <span style={{
                        fontSize: '10px',
                        color: '#0d9488',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '4px'
                      }}>
                        {property.propertyType}
                      </span>
                      <h4 style={{
                        fontSize: isMobile ? '15px' : '16px',
                        fontWeight: '700',
                        color: '#0f172a',
                        marginBottom: '4px',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {property.title}
                      </h4>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '11px',
                        color: '#94a3b8',
                        marginBottom: '14px'
                      }}>
                        <HiOutlineCalendar size={12} />
                        {new Date(property.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        <span style={{ marginLeft: 'auto' }}>
                          Views: <strong style={{ color: '#64748b' }}>{property.views || 0}</strong>
                        </span>
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '8px'
                      }}>
                        <button 
                          onClick={() => handleStatusChange(property._id, property.status)}
                          style={{
                            padding: '8px',
                            background: property.status === 'sale' ? '#dcfce7' : '#fce8e6',
                            border: 'none',
                            borderRadius: '8px',
                            color: property.status === 'sale' ? '#137333' : '#c5221f',
                            fontWeight: '600',
                            fontSize: isMobile ? '10px' : '11px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          {property.status === 'sale' ? 'Mark Sold' : 'Mark Live'}
                        </button>
                        <button 
                          onClick={() => navigate(`/edit-property/${property._id}`)}
                          style={{
                            padding: '8px',
                            background: '#eff6ff',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#3b82f6',
                            fontWeight: '600',
                            fontSize: isMobile ? '10px' : '11px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#dbeafe';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#eff6ff';
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteProperty(property._id)}
                          style={{
                            padding: '8px',
                            background: '#fef2f2',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#dc2626',
                            fontWeight: '600',
                            fontSize: isMobile ? '10px' : '11px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#fee2e2';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#fef2f2';
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </SellerLayout>
  );
};

export default SellerDashboard;