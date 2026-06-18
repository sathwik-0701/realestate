import React, { useEffect, useState } from 'react';
import { wishlistStyles as s } from '../../assets/dummyStyles';
import Navbar from '../../components/common/Navbar';
import SellerLayout from '../../components/common/SellerLayout';
import PropertyCard from '../../components/common/PropertyCard';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import API_URL from '../../config';
import { Link } from 'react-router-dom';
import { HiOutlineHeart, HiHeart, HiOutlineHome, HiOutlineLocationMarker, HiOutlineCurrencyDollar } from 'react-icons/hi';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const Wishlist = () => {
  const { user, token } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const isMobile = window.innerWidth < 768;

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlistItems(res.data || []);
    } catch (err) {
      console.error("Failed to load wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleToggleWishlist = async (propertyId) => {
    try {
      const res = await axios.delete(`${API_URL}/api/wishlist/${propertyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setWishlistItems(wishlistItems.filter(item => item.property?._id !== propertyId));
      }
    } catch (err) {
      alert("Failed to remove item from wishlist");
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(239,68,68,0.2)',
          borderTop: '3px solid #ef4444',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const isSeller = user?.role === 'seller';

  const wishlistContent = (
    <div style={{
      padding: isSeller ? '0' : (isMobile ? '16px 12px' : '40px 24px'),
      maxWidth: '1200px',
      margin: '0 auto',
      animation: 'fadeIn 0.6s ease-out'
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          14% { transform: scale(1.3); }
          28% { transform: scale(1); }
          42% { transform: scale(1.2); }
          70% { transform: scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .heart-beat {
          animation: heartBeat 1.5s ease-in-out infinite;
        }
        .shimmer-text {
          background: linear-gradient(90deg, #ef4444, #f87171, #fb7185, #ef4444);
          background-size: 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s ease infinite;
        }
        .card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.08);
        }
        .btn-gradient {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          transition: all 0.3s ease;
        }
        .btn-gradient:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(239,68,68,0.3);
        }
        @media (max-width: 768px) {
          .wishlist-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .wishlist-header {
            text-align: center !important;
            padding: 0 12px !important;
          }
          .wishlist-title {
            font-size: 24px !important;
          }
          .empty-state {
            padding: 40px 20px !important;
            margin: 0 12px !important;
          }
        }
      `}</style>

      {/* Header */}
      <header className="wishlist-header" style={{
        marginBottom: isMobile ? '24px' : '40px',
        textAlign: isSeller ? 'left' : 'center',
        padding: isMobile ? '0 12px' : '0'
      }}>
        <div style={{
          display: "inline-block",
          padding: "6px 16px",
          background: "linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.06))",
          borderRadius: "50px",
          fontSize: "11px",
          fontWeight: "700",
          color: "#ef4444",
          textTransform: "uppercase",
          letterSpacing: "1px",
          marginBottom: "12px",
          border: "1px solid rgba(239,68,68,0.1)"
        }}>
          <FaHeart style={{ display: "inline", marginRight: "6px" }} />
          Saved Properties
        </div>
        <h1 className="wishlist-title" style={{
          fontSize: isMobile ? '24px' : '32px',
          fontWeight: '800',
          color: '#0f172a',
          marginBottom: '8px',
          letterSpacing: '-0.5px'
        }}>
          My <span className="shimmer-text">Wishlist</span>
        </h1>
        <p style={{
          fontSize: isMobile ? '13px' : '15px',
          color: '#64748b',
          maxWidth: '500px',
          margin: isSeller ? '0' : '0 auto'
        }}>
          {wishlistItems.length > 0 
            ? `You have ${wishlistItems.length} property${wishlistItems.length > 1 ? 's' : ''} saved in your wishlist`
            : 'Your bookmarked property listings'}
        </p>
      </header>

      {/* Wishlist Items */}
      {wishlistItems.length === 0 ? (
        <div className="empty-state" style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: isMobile ? '16px' : '24px',
          padding: isMobile ? '40px 20px' : '80px 40px',
          textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          margin: isMobile ? '0 12px' : '0',
          animation: 'slideUp 0.6s ease-out'
        }}>
          <div style={{
            width: isMobile ? '80px' : '100px',
            height: isMobile ? '80px' : '100px',
            background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 4px 20px rgba(239,68,68,0.08)'
          }}>
            <HiOutlineHeart size={isMobile ? 36 : 48} style={{ color: '#ef4444' }} />
          </div>
          <h3 style={{
            fontSize: isMobile ? '18px' : '22px',
            fontWeight: '700',
            color: '#0f172a',
            marginBottom: '8px'
          }}>Your wishlist is empty</h3>
          <p style={{
            fontSize: isMobile ? '13px' : '15px',
            color: '#64748b',
            marginBottom: '24px',
            maxWidth: '400px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Bookmark properties while browsing to save them here.
          </p>
          <Link
            to="/properties"
            className="btn-gradient"
            style={{
              display: 'inline-block',
              padding: isMobile ? '12px 28px' : '14px 36px',
              borderRadius: '12px',
              color: 'white',
              fontWeight: '600',
              fontSize: isMobile ? '14px' : '15px',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(239,68,68,0.25)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(239,68,68,0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(239,68,68,0.25)';
            }}
          >
            Browse Properties
          </Link>
        </div>
      ) : (
        <>
          {/* Stats Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: isMobile ? '0 12px 16px' : '0 0 20px',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <span style={{
              fontSize: isMobile ? '13px' : '14px',
              color: '#64748b'
            }}>
              Showing <strong style={{ color: '#0f172a' }}>{wishlistItems.length}</strong> properties
            </span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: '#f1f5f9',
              borderRadius: '20px',
              fontSize: isMobile ? '11px' : '12px',
              color: '#64748b'
            }}>
              <FaHeart size={12} style={{ color: '#ef4444' }} />
              <span>Saved</span>
            </div>
          </div>

          {/* Grid */}
          <div className="wishlist-grid" style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: isMobile ? '16px' : '24px',
            padding: isMobile ? '0 12px' : '0'
          }}>
            {wishlistItems.map((item, index) => {
              if (!item.property) return null;
              return (
                <div
                  key={item._id}
                  className="card-hover animate-slideUp"
                  style={{
                    animationDelay: `${index * 0.05}s`,
                    opacity: 0,
                    animationFillMode: 'forwards',
                    background: 'white',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <PropertyCard
                    property={item.property}
                    isWishlisted={true}
                    onToggleWishlist={handleToggleWishlist}
                  />
                  
                  {/* Remove Button */}
                  <div style={{
                    padding: isMobile ? '12px 16px' : '16px 20px',
                    borderTop: '1px solid #f1f5f9',
                    background: '#fafbfc'
                  }}>
                    <button
                      onClick={() => handleToggleWishlist(item.property._id)}
                      style={{
                        width: '100%',
                        padding: isMobile ? '10px' : '12px',
                        background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                        border: '2px solid #fecaca',
                        borderRadius: '12px',
                        color: '#dc2626',
                        fontWeight: '600',
                        fontSize: isMobile ? '13px' : '14px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #fee2e2, #fecaca)';
                        e.currentTarget.style.borderColor = '#f87171';
                        e.currentTarget.style.transform = 'scale(1.01)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #fef2f2, #fee2e2)';
                        e.currentTarget.style.borderColor = '#fecaca';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <FaRegHeart size={isMobile ? 14 : 16} />
                      Remove from Wishlist
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Stats */}
          <div style={{
            marginTop: isMobile ? '24px' : '32px',
            textAlign: 'center',
            padding: isMobile ? '12px' : '16px',
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            marginLeft: isMobile ? '12px' : '0',
            marginRight: isMobile ? '12px' : '0'
          }}>
            <p style={{
              fontSize: isMobile ? '12px' : '13px',
              color: '#64748b'
            }}>
              <FaHeart size={12} style={{ color: '#ef4444', display: 'inline', marginRight: '4px' }} />
              You have <strong style={{ color: '#0f172a' }}>{wishlistItems.length}</strong> properties saved in your wishlist
            </p>
          </div>
        </>
      )}
    </div>
  );

  return isSeller ? (
    <SellerLayout>
      {wishlistContent}
    </SellerLayout>
  ) : (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      paddingTop: isMobile ? '70px' : '80px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: isMobile ? '200px' : '400px',
        height: isMobile ? '200px' : '400px',
        background: 'radial-gradient(circle, rgba(239,68,68,0.04) 0%, rgba(239,68,68,0) 70%)',
        borderRadius: '50%',
        animation: 'float 20s ease-in-out infinite',
        display: isMobile ? 'none' : 'block'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '-5%',
        width: isMobile ? '150px' : '300px',
        height: isMobile ? '150px' : '300px',
        background: 'radial-gradient(circle, rgba(245,158,11,0.04) 0%, rgba(245,158,11,0) 70%)',
        borderRadius: '50%',
        animation: 'float 15s ease-in-out infinite reverse'
      }} />

      <Navbar />
      {wishlistContent}
    </div>
  );
};

export default Wishlist;