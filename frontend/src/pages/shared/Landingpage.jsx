import React, { useEffect, useState } from 'react';
import { landingPageStyles as s } from "../../assets/dummyStyles";
import Navbar from '../../components/common/Navbar.jsx';
import { HiCurrencyDollar, HiHome, HiLightningBolt, HiLocationMarker, HiMail, HiOfficeBuilding, HiPhone, HiSearch, HiShieldCheck, HiVideoCamera } from 'react-icons/hi';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import axios from 'axios';
import API_URL from '../../config.js';
import banner from '../../assets/bannerimage.png';
import PropertyCard from '../../components/common/PropertyCard.jsx';

const Landingpage = () => {

  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState("Select Type");
  const [propertyCounts, setPropertyCounts] = useState({
    flat: 0,
    villa: 0,
    penthouse: 0,
    commercial: 0,
  });

  const [wishlistedIds, setWishlistedIds] = useState([]);
  
  useEffect(() => {
    fetchProperties();
    fetchCounts();
    if(user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlistedIds(
        res.data
        .filter((item) => item.property)
        .map((item) => String(item.property._id)),
      );
    }
    catch (error) {
      console.error("Failed to fetch wishlist", error);
    }
  };

  const handleToggleWishlist = async (propertyId) => {
    try {
      const isWishlisted = wishlistedIds.includes(propertyId);
      if(isWishlisted) {
        await axios.delete(`${API_URL}/api/wishlist/${propertyId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlistedIds((prev) => prev.filter((id) => id !== propertyId));
      }
      else {
        await axios.post(
          `${API_URL}/api/wishlist/${propertyId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setWishlistedIds((prev) => [...prev, propertyId]);
      }
    }
    catch (err) {
      console.error("Failed to toggle wishlist:", err);
    }
  };

  const fetchCounts = async () => {
    try {
        const res = await axios.get(`${API_URL}/api/property/counts`);
        if(res.data.success) {
            setPropertyCounts({
                flat: (res.data.counts.flat || 0) + (res.data.counts.apartment || 0),
                villa: res.data.counts.villa || 0,
                penthouse: res.data.counts.penthouse || 0,
                commercial: res.data.counts.commercial || 0
            });
        }
    }
    catch (error) {
        console.error("Failed to fetch property counts:", error);
        setPropertyCounts({
            flat: 0,
            villa: 0,
            penthouse: 0,
            commercial: 0
        });
    }
};

  const fetchProperties = async (search = "") => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/property?city=${search}`);
      setProperties(res.data.properties || res.data || []);
      setError(null);
    }
    catch (error) {
      setError("Failed to load properties. Please try again");
    }
    finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if(searchTerm) params.append("city", searchTerm);
    if(propertyType !== "Select Type") params.append("type", propertyType);
    navigate(`/properties?${params.toString()}`);
  };

  const categories = [
    {
      name: "Modern Flats",
      count: propertyCounts.flat || 0,
      icon: <HiOfficeBuilding size={32} />,
      type: "flat",
    },
    {
      name: "Luxury Villas",
      count: propertyCounts.villa || 0,
      icon: <HiHome size={32} />,
      type: "villa",
    },
    {
      name: "Penthouse",
      count: propertyCounts.penthouse || 0,
      icon: <HiOfficeBuilding size={32} />,
      type: "penthouse",
    },
    {
      name: "Commercial",
      count: propertyCounts.commercial || 0,
      icon: <HiOfficeBuilding size={32} />,
      type: "commercial",
    },
  ];

  const features = [
    {
      title: "Verified Trust",
      desc: "Every listing is strictly audited for ownership, condition, and legality.",
      icon: <HiShieldCheck size={24} />,
    },
    {
      title: "Smart Search",
      desc: "Our AI-driven algorithms help you find the best matches based on preferences.",
      icon: <HiLightningBolt size={24} />,
    },
    {
      title: "Best Value",
      desc: "Direct-from-owner listings and zero-commission options to ensure competitive prices.",
      icon: <HiCurrencyDollar size={24} />,
    },
    {
      title: "Virtual Tours",
      desc: "High-definition 3D tours allow you to experience the property from home.",
      icon: <HiVideoCamera size={24} />,
    },
  ];

  return (
    <div className={s.bgMain} style={{
      overflowX: 'hidden',
      fontFamily: "'Inter', system-ui, sans-serif",
      background: '#FAF7F1'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,800&family=Inter:wght@400;500;600;700;800&display=swap');

        .lp-serif { font-family: 'Fraunces', Georgia, serif !important; }

        /* Animation Keyframes */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(15px) rotate(-2deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(13, 148, 136, 0.25); }
          50% { box-shadow: 0 0 38px rgba(13, 148, 136, 0.45); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes skylineRise {
          0% { transform: scaleY(0); }
          100% { transform: scaleY(1); }
        }
        @keyframes skylineGlow {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
        @keyframes skylineSweep {
          0% { transform: translateX(-120%) skewX(-12deg); }
          100% { transform: translateX(220%) skewX(-12deg); }
        }
        @keyframes dotPing {
          0% { transform: scale(1); opacity: 1; }
          70% { transform: scale(2.4); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }

        /* Animation Classes */
        .animate-fadeInUp {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fadeInLeft {
          animation: fadeInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fadeInRight {
          animation: fadeInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-floatReverse {
          animation: floatReverse 7s ease-in-out infinite;
        }
        .animate-pulseGlow {
          animation: pulseGlow 3s ease-in-out infinite;
        }
        .animate-scaleIn {
          animation: scaleIn 0.6s ease-out forwards;
        }
        .animate-slideDown {
          animation: slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-bounceIn {
          animation: bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }
        .shimmer-text {
          background: linear-gradient(90deg, #0d9488, #14b8a6, #C2742A, #0d9488);
          background-size: 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 5s ease infinite;
        }
        .gradient-border {
          background: linear-gradient(90deg, #0d9488, #14b8a6, #C2742A, #0d9488);
          background-size: 300%;
          animation: gradientMove 3s ease infinite;
        }

        /* Card Hover Effects */
        .card-hover {
          transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }
        .card-hover:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 24px 60px rgba(28,25,23,0.13);
        }

        /* Glass Effect */
        .glass-effect {
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.2);
        }

        /* Footer skyline logo mark */
        .skyline-mark {
          position: relative;
          width: 42px;
          height: 42px;
          border-radius: 11px;
          background: linear-gradient(160deg, #0d9488 0%, #0f766e 100%);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 3px;
          padding: 9px 8px 7px;
          overflow: hidden;
          box-shadow: 0 4px 18px rgba(13,148,136,0.4);
          flex-shrink: 0;
        }
        .skyline-mark::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%);
          animation: skylineSweep 4.5s ease-in-out infinite;
          animation-delay: 1s;
        }
        .skyline-bar {
          width: 4px;
          background: rgba(255,255,255,0.92);
          border-radius: 2px 2px 0 0;
          transform-origin: bottom;
          animation: skylineRise 0.7s cubic-bezier(0.16, 1, 0.3, 1) backwards;
          position: relative;
          z-index: 1;
        }
        .skyline-bar:nth-child(1) { height: 11px; animation-delay: 0.05s; }
        .skyline-bar:nth-child(2) { height: 18px; animation-delay: 0.15s; }
        .skyline-bar:nth-child(3) { height: 14px; animation-delay: 0.25s; }
        .skyline-bar:nth-child(4) { height: 21px; animation-delay: 0.35s; }
        .skyline-dot {
          position: absolute;
          top: 7px;
          right: 9px;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #FCD34D;
          box-shadow: 0 0 4px #FCD34D;
          animation: skylineGlow 2.4s ease-in-out infinite;
        }
        .brand-word {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 21px;
          letter-spacing: -0.3px;
          color: white;
        }
        .brand-word em {
          font-style: italic;
          font-weight: 500;
          color: #5eead4;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
          .hero-content {
            text-align: center !important;
            padding-right: 0 !important;
          }
          .hero-image {
            display: none !important;
          }
          .category-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 12px !important;
          }
          .features-grid {
            grid-template-columns: 1fr !important;
          }
          .stats-flex {
            gap: 20px !important;
            justify-content: center !important;
          }
          .search-form {
            flex-direction: column !important;
            padding: 16px !important;
            border-radius: 16px !important;
          }
          .search-field {
            width: 100% !important;
            padding: 8px 0 !important;
          }
          .search-divider {
            display: none !important;
          }
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
          .hero-title {
            font-size: 2rem !important;
          }
          .stats-number {
            font-size: 1.5rem !important;
          }
          .process-grid {
            grid-template-columns: 1fr !important;
          }
          .featured-grid {
            grid-template-columns: 1fr !important;
          }
          .newsletter-input {
            flex-direction: column !important;
          }
        }

        @media (max-width: 480px) {
          .category-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 10px !important;
          }
          .hero-title {
            font-size: 1.8rem !important;
          }
          .badge-text {
            font-size: 11px !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <Navbar/>
      
      {/* Hero Section */}
      <section className={s.heroSection} style={{
        padding: window.innerWidth < 768 ? '100px 16px 40px' : '120px 20px 60px',
        background: 'linear-gradient(135deg, #FAF7F1 0%, #F3EEE3 35%, #E8F5F0 70%, #FBF1DE 100%)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: window.innerWidth < 768 ? 'auto' : '100vh',
        display: 'flex',
        alignItems: 'center'
      }}>
        {/* Animated Background Elements */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: window.innerWidth < 768 ? '200px' : '500px',
          height: window.innerWidth < 768 ? '200px' : '500px',
          background: 'radial-gradient(circle, rgba(13,148,136,0.12) 0%, rgba(13,148,136,0) 70%)',
          borderRadius: '50%',
          animation: 'float 20s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: window.innerWidth < 768 ? '150px' : '400px',
          height: window.innerWidth < 768 ? '150px' : '400px',
          background: 'radial-gradient(circle, rgba(194,116,42,0.10) 0%, rgba(194,116,42,0) 70%)',
          borderRadius: '50%',
          animation: 'floatReverse 18s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          top: '30%',
          right: '15%',
          width: window.innerWidth < 768 ? '100px' : '300px',
          height: window.innerWidth < 768 ? '100px' : '300px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, rgba(59,130,246,0) 70%)',
          borderRadius: '50%',
          animation: 'float 25s ease-in-out infinite 2s'
        }} />

        <div className="hero-grid" style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr',
          gap: window.innerWidth < 768 ? '30px' : '60px',
          alignItems: 'center',
          width: '100%',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Hero Content */}
          <div className="hero-content animate-fadeInLeft" style={{ 
            paddingRight: window.innerWidth < 768 ? '0' : '20px',
            textAlign: window.innerWidth < 768 ? 'center' : 'left'
          }}>
            <span className="animate-slideDown" style={{
              display: 'inline-block',
              padding: window.innerWidth < 768 ? '6px 14px' : '8px 20px',
              background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
              color: 'white',
              borderRadius: '50px',
              fontSize: window.innerWidth < 768 ? '11px' : '13px',
              fontWeight: '700',
              letterSpacing: '0.5px',
              marginBottom: window.innerWidth < 768 ? '16px' : '24px',
              boxShadow: '0 4px 15px rgba(13,148,136,0.3)',
              animation: 'pulseGlow 2s ease-in-out infinite'
            }}>
              ⭐ Trusted by 20,000+ homeowners
            </span>

            <h1 className="hero-title lp-serif" style={{
              fontSize: window.innerWidth < 768 ? 'clamp(1.8rem, 8vw, 2.5rem)' : 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: '600',
              color: '#1C1917',
              lineHeight: '1.08',
              marginBottom: window.innerWidth < 768 ? '16px' : '20px',
              letterSpacing: '-1.5px',
              textAlign: window.innerWidth < 768 ? 'center' : 'left'
            }}>
              Find your <span className="shimmer-text" style={{ fontStyle: 'italic', fontWeight: 500 }}>perfect</span> next chapter.
            </h1>

            <p style={{
              fontSize: window.innerWidth < 768 ? '1rem' : '1.2rem',
              color: '#57534E',
              lineHeight: '1.8',
              marginBottom: window.innerWidth < 768 ? '24px' : '32px',
              maxWidth: window.innerWidth < 768 ? '100%' : '500px',
              textAlign: window.innerWidth < 768 ? 'center' : 'left'
            }}>
              Experience the most advanced real estate search platform. Discover
              verified listings, connect with top agents, and find a place you will love.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="search-form" style={{
              display: 'flex',
              alignItems: 'center',
              background: 'white',
              borderRadius: window.innerWidth < 768 ? '16px' : '20px',
              padding: window.innerWidth < 768 ? '12px' : '8px',
              boxShadow: '0 20px 60px rgba(28,25,23,0.10)',
              border: '1px solid rgba(255,255,255,0.5)',
              flexWrap: 'wrap',
              marginBottom: window.innerWidth < 768 ? '24px' : '40px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 25px 70px rgba(28,25,23,0.14)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(28,25,23,0.10)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <div className="search-field" style={{
                flex: '1.2',
                display: 'flex',
                alignItems: 'center',
                gap: window.innerWidth < 768 ? '8px' : '12px',
                padding: window.innerWidth < 768 ? '8px 12px' : '12px 16px',
                minWidth: window.innerWidth < 768 ? '100%' : '200px',
                width: window.innerWidth < 768 ? '100%' : 'auto'
              }}>
                <HiLocationMarker size={window.innerWidth < 768 ? 20 : 24} style={{ color: '#0d9488', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <label style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#A8A29E',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'block',
                    marginBottom: '2px'
                  }}>Location</label>
                  <input
                    type='text'
                    placeholder='Where are you looking?'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      outline: 'none',
                      width: '100%',
                      fontSize: window.innerWidth < 768 ? '14px' : '15px',
                      fontWeight: '500',
                      color: '#1C1917',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.color = '#0d9488';
                    }}
                    onBlur={(e) => {
                      e.target.style.color = '#1C1917';
                    }}
                  />
                </div>
              </div>

              <div className="search-divider" style={{
                width: '1px',
                height: '44px',
                background: '#E7E2D9',
                opacity: 0.8,
                display: window.innerWidth < 768 ? 'none' : 'block'
              }} />

              <div className="search-field" style={{
                flex: '1',
                display: 'flex',
                alignItems: 'center',
                gap: window.innerWidth < 768 ? '8px' : '12px',
                padding: window.innerWidth < 768 ? '8px 12px' : '12px 16px',
                minWidth: window.innerWidth < 768 ? '100%' : '180px',
                width: window.innerWidth < 768 ? '100%' : 'auto'
              }}>
                <HiHome size={window.innerWidth < 768 ? 20 : 24} style={{ color: '#0d9488', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <label style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#A8A29E',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'block',
                    marginBottom: '2px'
                  }}>Property Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      outline: 'none',
                      width: '100%',
                      fontSize: window.innerWidth < 768 ? '14px' : '15px',
                      fontWeight: '500',
                      color: '#1C1917',
                      cursor: 'pointer',
                      transition: 'color 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.color = '#0d9488';
                    }}
                    onBlur={(e) => {
                      e.target.style.color = '#1C1917';
                    }}
                  >
                    <option value="Select Type">Select Type</option>
                    <option value="flat">Flat/Apartment</option>
                    <option value="villa">Villa/House</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
              </div>

              <button type='submit' style={{
                padding: window.innerWidth < 768 ? '14px 24px' : '16px 32px',
                background: 'linear-gradient(135deg, #0d9488, #0f766e)',
                border: 'none',
                borderRadius: window.innerWidth < 768 ? '12px' : '16px',
                color: 'white',
                fontWeight: '700',
                fontSize: window.innerWidth < 768 ? '14px' : '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: window.innerWidth < 768 ? '100%' : 'auto',
                justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(13,148,136,0.3)',
                marginTop: window.innerWidth < 768 ? '8px' : '0',
                transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 35px rgba(13,148,136,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(13,148,136,0.3)';
              }}>
                <HiSearch size={window.innerWidth < 768 ? 18 : 22} /> Search
              </button>
            </form>

            {/* Stats */}
            <div className="stats-flex" style={{
              display: 'flex',
              gap: window.innerWidth < 768 ? '20px' : '50px',
              flexWrap: 'wrap',
              justifyContent: window.innerWidth < 768 ? 'center' : 'flex-start'
            }}>
              {[
                { number: '12k+', label: 'Ready Properties', delay: '0s' },
                { number: '500+', label: 'Agent Network', delay: '0.1s' },
                { number: '4.9/5', label: 'User Rating', delay: '0.2s' }
              ].map((stat, idx) => (
                <div key={idx} style={{
                  animation: `fadeInUp 0.6s ease-out ${stat.delay}`,
                  opacity: 0,
                  animationFillMode: 'forwards',
                  textAlign: 'center'
                }}>
                  <h3 className="stats-number lp-serif" style={{
                    fontSize: window.innerWidth < 768 ? '1.5rem' : '2rem',
                    fontWeight: '600',
                    background: 'linear-gradient(135deg, #0d9488, #0f766e)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>{stat.number}</h3>
                  <p style={{
                    fontSize: window.innerWidth < 768 ? '0.7rem' : '0.85rem',
                    color: '#A8A29E',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image - Hidden on Mobile */}
          <div className="hero-image animate-fadeInRight" style={{ 
            position: 'relative',
            display: window.innerWidth < 768 ? 'none' : 'block'
          }}>
            <div style={{
              borderRadius: '30px',
              overflow: 'hidden',
              boxShadow: '0 30px 80px rgba(28,25,23,0.18)',
              transform: 'perspective(1000px) rotateY(-3deg)',
              transition: 'transform 0.6s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateY(-3deg)';
            }}>
              <img src={banner} alt='banner' style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                transition: 'transform 0.5s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'} />

              <div className="animate-float" style={{
                position: 'absolute',
                bottom: window.innerWidth < 768 ? '16px' : '30px',
                left: window.innerWidth < 768 ? '16px' : '30px',
                right: window.innerWidth < 768 ? '16px' : 'auto',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(12px)',
                borderRadius: window.innerWidth < 768 ? '14px' : '20px',
                padding: window.innerWidth < 768 ? '14px 16px' : '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: window.innerWidth < 768 ? '12px' : '16px',
                boxShadow: '0 10px 40px rgba(28,25,23,0.12)',
                flexWrap: window.innerWidth < 768 ? 'wrap' : 'nowrap'
              }}>
                <div style={{
                  width: window.innerWidth < 768 ? '36px' : '48px',
                  height: window.innerWidth < 768 ? '36px' : '48px',
                  background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(13,148,136,0.3)'
                }}>
                  <HiShieldCheck size={window.innerWidth < 768 ? 18 : 24} color="white" />
                </div>
                <div>
                  <h4 className="badge-text" style={{ fontSize: window.innerWidth < 768 ? '13px' : '16px', fontWeight: '700', color: '#1C1917', margin: 0 }}>Verified Listing</h4>
                  <p style={{ fontSize: window.innerWidth < 768 ? '11px' : '13px', color: '#78716C', margin: 0 }}>Inspected by our team</p>
                </div>
                <span style={{
                  padding: window.innerWidth < 768 ? '2px 10px' : '4px 14px',
                  background: 'linear-gradient(135deg, #C2742A, #A85D1F)',
                  borderRadius: '30px',
                  color: 'white',
                  fontSize: window.innerWidth < 768 ? '9px' : '11px',
                  fontWeight: '700'
                }}>Pre-Approved</span>
              </div>
            </div>

            {/* Floating Badge */}
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
              borderRadius: '16px',
              padding: '12px 20px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '700',
              boxShadow: '0 10px 30px rgba(139,92,246,0.35)',
              animation: 'float 8s ease-in-out infinite 1s'
            }}>
              🏆 Premium
            </div>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className={s.categorySection} style={{
        padding: window.innerWidth < 768 ? '60px 16px' : '80px 20px',
        background: '#FFFFFF',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            textAlign: 'center',
            marginBottom: window.innerWidth < 768 ? '40px' : '60px'
          }}>
            <span className="animate-slideDown" style={{
              display: 'inline-block',
              padding: window.innerWidth < 768 ? '4px 12px' : '6px 16px',
              background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
              color: 'white',
              borderRadius: '50px',
              fontSize: window.innerWidth < 768 ? '10px' : '12px',
              fontWeight: '700',
              marginBottom: '12px'
            }}>Categories</span>
            <h2 className="lp-serif" style={{
              fontSize: window.innerWidth < 768 ? 'clamp(1.5rem, 6vw, 2rem)' : 'clamp(2rem, 4vw, 3rem)',
              fontWeight: '600',
              color: '#1C1917',
              marginBottom: '12px',
              letterSpacing: '-0.5px'
            }}>
              Browse by <span className="shimmer-text" style={{ fontStyle: 'italic', fontWeight: 500 }}>category</span>
            </h2>
            <p style={{
              fontSize: window.innerWidth < 768 ? '0.9rem' : '1.1rem',
              color: '#78716C',
              maxWidth: '500px',
              margin: '0 auto',
              padding: '0 16px'
            }}>
              Explore curated collections of properties tailored to your lifestyle.
            </p>
          </div>

          <div className="category-grid" style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth < 768 ? '1fr 1fr' : 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: window.innerWidth < 768 ? '12px' : '24px'
          }}>
            {categories.map((cat, idx) => (
              <div 
                key={idx}
                className="card-hover"
                onClick={() => navigate(`/properties?type=${cat.type}`)}
                style={{
                  background: 'white',
                  borderRadius: window.innerWidth < 768 ? '14px' : '20px',
                  padding: window.innerWidth < 768 ? '24px 12px' : '40px 20px',
                  textAlign: 'center',
                  border: '1.5px solid #EFEBE3',
                  boxShadow: '0 2px 10px rgba(28,25,23,0.04)',
                  animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s`,
                  opacity: 0,
                  animationFillMode: 'forwards',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(28,25,23,0.10)';
                  e.currentTarget.style.borderColor = '#0d9488';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(28,25,23,0.04)';
                  e.currentTarget.style.borderColor = '#EFEBE3';
                }}
              >
                <div style={{
                  width: window.innerWidth < 768 ? '56px' : '70px',
                  height: window.innerWidth < 768 ? '56px' : '70px',
                  margin: '0 auto 16px',
                  background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)',
                  borderRadius: window.innerWidth < 768 ? '14px' : '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0d9488',
                  fontSize: window.innerWidth < 768 ? '24px' : '32px',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                  {cat.icon}
                </div>
                <h3 style={{
                  fontSize: window.innerWidth < 768 ? '0.9rem' : '1.2rem',
                  fontWeight: '700',
                  color: '#1C1917',
                  marginBottom: window.innerWidth < 768 ? '2px' : '6px'
                }}>{cat.name}</h3>
                <p style={{
                  fontSize: window.innerWidth < 768 ? '0.7rem' : '0.9rem',
                  color: '#A8A29E'
                }}>
                  {cat.count.toLocaleString()} Properties
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={s.featuredSection} style={{
        padding: window.innerWidth < 768 ? '60px 16px' : '80px 20px',
        background: 'linear-gradient(135deg, #FAF7F1, #F3EEE3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-30%',
          right: '-10%',
          width: window.innerWidth < 768 ? '200px' : '600px',
          height: window.innerWidth < 768 ? '200px' : '600px',
          background: 'radial-gradient(circle, rgba(13,148,136,0.06) 0%, rgba(13,148,136,0) 70%)',
          borderRadius: '50%',
          animation: 'float 25s ease-in-out infinite'
        }} />

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr',
          gap: window.innerWidth < 768 ? '30px' : '60px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <div className="features-grid" style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr',
            gap: window.innerWidth < 768 ? '16px' : '24px'
          }}>
            {features.map((f, idx) => (
              <div
                key={idx}
                className="card-hover"
                style={{
                  background: 'white',
                  borderRadius: window.innerWidth < 768 ? '12px' : '16px',
                  padding: window.innerWidth < 768 ? '18px 16px' : '28px 24px',
                  boxShadow: '0 2px 10px rgba(28,25,23,0.04)',
                  border: '1.5px solid #EFEBE3',
                  animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s`,
                  opacity: 0,
                  animationFillMode: 'forwards'
                }}
              >
                <div style={{
                  width: window.innerWidth < 768 ? '40px' : '48px',
                  height: window.innerWidth < 768 ? '40px' : '48px',
                  marginBottom: window.innerWidth < 768 ? '12px' : '16px',
                  background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0d9488',
                  fontSize: window.innerWidth < 768 ? '20px' : '24px'
                }}>
                  {f.icon}
                </div>
                <h3 style={{
                  fontSize: window.innerWidth < 768 ? '0.95rem' : '1.1rem',
                  fontWeight: '700',
                  color: '#1C1917',
                  marginBottom: window.innerWidth < 768 ? '4px' : '8px'
                }}>{f.title}</h3>
                <p style={{
                  fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem',
                  color: '#78716C',
                  lineHeight: '1.6'
                }}>{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="animate-fadeInRight">
            <span className="animate-slideDown" style={{
              display: 'inline-block',
              padding: window.innerWidth < 768 ? '4px 12px' : '6px 16px',
              background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
              color: 'white',
              borderRadius: '50px',
              fontSize: window.innerWidth < 768 ? '10px' : '12px',
              fontWeight: '700',
              marginBottom: '12px'
            }}>Why Us</span>
            <h2 className="lp-serif" style={{
              fontSize: window.innerWidth < 768 ? 'clamp(1.5rem, 6vw, 2rem)' : 'clamp(2rem, 4vw, 3rem)',
              fontWeight: '600',
              color: '#1C1917',
              lineHeight: '1.2',
              marginBottom: window.innerWidth < 768 ? '12px' : '16px',
              letterSpacing: '-0.5px'
            }}>
              Why RealEstate is the <span className="shimmer-text" style={{ fontStyle: 'italic', fontWeight: 500 }}>preferred choice</span>
            </h2>
            <p style={{
              fontSize: window.innerWidth < 768 ? '0.9rem' : '1.05rem',
              color: '#57534E',
              lineHeight: window.innerWidth < 768 ? '1.6' : '1.8',
              marginBottom: window.innerWidth < 768 ? '16px' : '24px'
            }}>
              We've reinvented the property search experience from the ground up.
              By focusing on transparency, technological precision, and user-centric design.
            </p>
            <ul style={{
              display: 'flex',
              flexDirection: 'column',
              gap: window.innerWidth < 768 ? '10px' : '14px',
              marginBottom: window.innerWidth < 768 ? '16px' : '28px',
              listStyle: 'none',
              padding: 0
            }}>
              {[
                "Direct connection with certified agents",
                "Real-time market valuation data",
                "Secure document management system",
                "24/7 Premium customer support"
              ].map((item, idx) => (
                <li key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: window.innerWidth < 768 ? '8px' : '12px',
                  fontSize: window.innerWidth < 768 ? '0.85rem' : '0.95rem',
                  color: '#44403C',
                  animation: `fadeInLeft 0.6s ease-out ${idx * 0.1}s`,
                  opacity: 0,
                  animationFillMode: 'forwards'
                }}>
                  <span style={{
                    width: window.innerWidth < 768 ? '20px' : '24px',
                    height: window.innerWidth < 768 ? '20px' : '24px',
                    background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: window.innerWidth < 768 ? '10px' : '12px',
                    fontWeight: '700',
                    flexShrink: 0
                  }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <a href='#process' style={{
              color: '#0d9488',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              borderBottom: '2px solid transparent',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderBottomColor = '#0d9488';
              e.target.style.transform = 'translateX(4px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderBottomColor = 'transparent';
              e.target.style.transform = 'translateX(0)';
            }}>
              Learn more about our process →
            </a>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id='process' className={s.processSection} style={{
        padding: window.innerWidth < 768 ? '60px 16px' : '80px 20px',
        background: '#FFFFFF',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            textAlign: 'center',
            marginBottom: window.innerWidth < 768 ? '40px' : '60px'
          }}>
            <span className="animate-slideDown" style={{
              display: 'inline-block',
              padding: window.innerWidth < 768 ? '4px 12px' : '6px 16px',
              background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
              color: 'white',
              borderRadius: '50px',
              fontSize: window.innerWidth < 768 ? '10px' : '12px',
              fontWeight: '700',
              marginBottom: '12px'
            }}>How It Works</span>
            <h2 className="lp-serif" style={{
              fontSize: window.innerWidth < 768 ? 'clamp(1.5rem, 6vw, 2rem)' : 'clamp(2rem, 4vw, 3rem)',
              fontWeight: '600',
              color: '#1C1917',
              marginBottom: '12px',
              letterSpacing: '-0.5px'
            }}>
              Our seamless <span className="shimmer-text" style={{ fontStyle: 'italic', fontWeight: 500 }}>process</span>
            </h2>
            <p style={{
              fontSize: window.innerWidth < 768 ? '0.9rem' : '1.05rem',
              color: '#78716C',
              maxWidth: '600px',
              margin: '0 auto',
              padding: '0 16px'
            }}>
              We've simplified finding your dream home into three clear steps.
            </p>
          </div>

          <div className="process-grid" style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: window.innerWidth < 768 ? '20px' : '30px',
            position: 'relative'
          }}>
            {!window.innerWidth < 768 && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '15%',
                right: '15%',
                height: '2px',
                background: 'linear-gradient(90deg, #0d9488, #14b8a6, #C2742A)',
                opacity: 0.2
              }} />
            )}

            {[
              {
                step: "01",
                title: "Smart Search",
                desc: "Leverage our AI-driven Smart Search algorithms to find the best property matches.",
                icon: <HiLightningBolt size={window.innerWidth < 768 ? 24 : 32} />,
                color: '#0d9488'
              },
              {
                step: "02",
                title: "Virtual Tours",
                desc: "Experience your future home from anywhere with high-definition 3D virtual tours.",
                icon: <HiVideoCamera size={window.innerWidth < 768 ? 24 : 32} />,
                color: '#8b5cf6'
              },
              {
                step: "03",
                title: "Verified Trust",
                desc: "Every listing is strictly audited for ownership and condition, ensuring peace of mind.",
                icon: <HiShieldCheck size={window.innerWidth < 768 ? 24 : 32} />,
                color: '#C2742A'
              }
            ].map((p, idx) => (
              <div
                key={idx}
                className="card-hover"
                style={{
                  background: 'white',
                  borderRadius: window.innerWidth < 768 ? '16px' : '24px',
                  padding: window.innerWidth < 768 ? '28px 20px' : '40px 32px',
                  textAlign: 'center',
                  border: '1.5px solid #EFEBE3',
                  boxShadow: '0 2px 10px rgba(28,25,23,0.04)',
                  position: 'relative',
                  animation: `fadeInUp 0.6s ease-out ${idx * 0.15}s`,
                  opacity: 0,
                  animationFillMode: 'forwards'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '-16px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: window.innerWidth < 768 ? '36px' : '44px',
                  height: window.innerWidth < 768 ? '36px' : '44px',
                  background: `linear-gradient(135deg, ${p.color}, ${p.color}dd)`,
                  borderRadius: window.innerWidth < 768 ? '10px' : '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: window.innerWidth < 768 ? '14px' : '18px',
                  fontWeight: '800',
                  boxShadow: `0 4px 20px ${p.color}40`
                }}>
                  {p.step}
                </div>

                <div style={{
                  width: window.innerWidth < 768 ? '52px' : '64px',
                  height: window.innerWidth < 768 ? '52px' : '64px',
                  margin: window.innerWidth < 768 ? '16px auto 16px' : '20px auto 20px',
                  background: `linear-gradient(135deg, ${p.color}15, ${p.color}08)`,
                  borderRadius: window.innerWidth < 768 ? '14px' : '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: p.color,
                  fontSize: window.innerWidth < 768 ? '24px' : '32px'
                }}>
                  {p.icon}
                </div>

                <h3 style={{
                  fontSize: window.innerWidth < 768 ? '1rem' : '1.3rem',
                  fontWeight: '700',
                  color: '#1C1917',
                  marginBottom: window.innerWidth < 768 ? '8px' : '12px'
                }}>{p.title}</h3>
                <p style={{
                  fontSize: window.innerWidth < 768 ? '0.85rem' : '0.95rem',
                  color: '#78716C',
                  lineHeight: window.innerWidth < 768 ? '1.5' : '1.7'
                }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className={s.featuredSection} style={{
        padding: window.innerWidth < 768 ? '60px 16px' : '80px 20px',
        background: 'linear-gradient(135deg, #FAF7F1, #F3EEE3)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            textAlign: 'center',
            marginBottom: window.innerWidth < 768 ? '40px' : '60px'
          }}>
            <span className="animate-slideDown" style={{
              display: 'inline-block',
              padding: window.innerWidth < 768 ? '4px 12px' : '6px 16px',
              background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
              color: 'white',
              borderRadius: '50px',
              fontSize: window.innerWidth < 768 ? '10px' : '12px',
              fontWeight: '700',
              marginBottom: '12px'
            }}>Handpicked For You</span>
            <h2 className="lp-serif" style={{
              fontSize: window.innerWidth < 768 ? 'clamp(1.5rem, 6vw, 2rem)' : 'clamp(2rem, 4vw, 3rem)',
              fontWeight: '600',
              color: '#1C1917',
              marginBottom: '12px',
              letterSpacing: '-0.5px'
            }}>
              Featured <span className="shimmer-text" style={{ fontStyle: 'italic', fontWeight: 500 }}>collections</span>
            </h2>
            <p style={{
              fontSize: window.innerWidth < 768 ? '0.9rem' : '1.05rem',
              color: '#78716C',
              maxWidth: '600px',
              margin: '0 auto',
              padding: '0 16px'
            }}>
              Discover high-value properties curated by our experts.
            </p>
          </div>

          {loading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                border: '4px solid rgba(13,148,136,0.15)',
                borderTop: '4px solid #0d9488',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            </div>
          ) : error ? (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              color: '#ef4444'
            }}>
              <p>{error}</p>
            </div>
          ) : (
            <div className="featured-grid" style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: window.innerWidth < 768 ? '16px' : '30px'
            }}>
              {properties
                .filter((p) => p)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 6)
                .map((property) => (
                  <div key={property._id} className="card-hover" style={{
                    animation: 'fadeInUp 0.6s ease-out',
                    opacity: 0,
                    animationFillMode: 'forwards'
                  }}>
                    <PropertyCard
                      property={property}
                      isWishlisted={wishlistedIds.includes(String(property._id))}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  </div>
                ))}
            </div>
          )}

          <div style={{
            textAlign: 'center',
            marginTop: window.innerWidth < 768 ? '40px' : '60px'
          }}>
            <button onClick={() => navigate("/properties")} style={{
              padding: window.innerWidth < 768 ? '14px 32px' : '16px 48px',
              background: 'linear-gradient(135deg, #0d9488, #0f766e)',
              border: 'none',
              borderRadius: '50px',
              color: 'white',
              fontSize: window.innerWidth < 768 ? '14px' : '16px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
              boxShadow: '0 4px 20px rgba(13,148,136,0.3)',
              width: window.innerWidth < 768 ? '100%' : 'auto'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 35px rgba(13,148,136,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(13,148,136,0.3)';
            }}>
              Discover More Properties →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={s.footer} style={{
        background: 'linear-gradient(135deg, #1C1917, #292524)',
        color: 'white',
        padding: window.innerWidth < 768 ? '40px 16px 0' : '60px 20px 0',
        position: 'relative',
        overflow: 'hidden',
        marginTop: 'auto'
      }}>
        <div style={{
          position: 'absolute',
          top: '-30%',
          right: '-10%',
          width: window.innerWidth < 768 ? '200px' : '600px',
          height: window.innerWidth < 768 ? '200px' : '600px',
          background: 'radial-gradient(circle, rgba(13,148,136,0.07) 0%, rgba(13,148,136,0) 70%)',
          borderRadius: '50%',
          animation: 'float 30s ease-in-out infinite'
        }} />

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1
        }}>
          <div className="footer-grid" style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: window.innerWidth < 768 ? '30px' : '40px',
            marginBottom: window.innerWidth < 768 ? '30px' : '40px'
          }}>
            <div style={{
              textAlign: window.innerWidth < 768 ? 'center' : 'left'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
                justifyContent: window.innerWidth < 768 ? 'center' : 'flex-start'
              }}>
                {/* New animated skyline logo mark, replaces old "RE" block */}
                <div className="skyline-mark">
                  <span className="skyline-dot" />
                  <span className="skyline-bar"></span>
                  <span className="skyline-bar"></span>
                  <span className="skyline-bar"></span>
                  <span className="skyline-bar"></span>
                </div>
                <span className="brand-word">Real<em>Estate</em></span>
              </div>
              <p style={{
                color: '#A8A29E',
                lineHeight: '1.8',
                marginBottom: '20px',
                fontSize: window.innerWidth < 768 ? '0.85rem' : '0.95rem',
                textAlign: window.innerWidth < 768 ? 'center' : 'left'
              }}>
                The most trusted platform for buying, selling, and renting premium real estate globally.
              </p>
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: window.innerWidth < 768 ? 'center' : 'flex-start'
              }}>
                {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, idx) => (
                  <a href='#' key={idx} style={{
                    width: window.innerWidth < 768 ? '36px' : '40px',
                    height: window.innerWidth < 768 ? '36px' : '40px',
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#A8A29E',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #0d9488, #14b8a6)';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.color = '#A8A29E';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}>
                    <Icon size={window.innerWidth < 768 ? 14 : 16} />
                  </a>
                ))}
              </div>
            </div>

            <div style={{
              textAlign: window.innerWidth < 768 ? 'center' : 'left'
            }}>
              <h4 className="lp-serif" style={{
                fontSize: '17px',
                fontWeight: '600',
                marginBottom: '16px',
                color: 'white'
              }}>Company</h4>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                {["Home", "Property", "Wishlist", "Contact"].map((item) => (
                  <li key={item}>
                    <a href={`/${item.toLowerCase()}`} style={{
                      color: '#A8A29E',
                      textDecoration: 'none',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#5eead4'}
                    onMouseLeave={(e) => e.target.style.color = '#A8A29E'}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{
              textAlign: window.innerWidth < 768 ? 'center' : 'left'
            }}>
              <h4 className="lp-serif" style={{
                fontSize: '17px',
                fontWeight: '600',
                marginBottom: '16px',
                color: 'white'
              }}>Support</h4>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#A8A29E', justifyContent: window.innerWidth < 768 ? 'center' : 'flex-start' }}>
                  <HiMail size={18} style={{ color: '#5eead4' }} /> psrpsr1432@gmail.com
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#A8A29E', justifyContent: window.innerWidth < 768 ? 'center' : 'flex-start' }}>
                  <HiPhone size={18} style={{ color: '#5eead4' }} /> +91 8978726364
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#A8A29E', justifyContent: window.innerWidth < 768 ? 'center' : 'flex-start' }}>
                  <HiLocationMarker size={18} style={{ color: '#5eead4' }} /> 123 Business Hub, India
                </li>
              </ul>
            </div>

            <div style={{
              textAlign: window.innerWidth < 768 ? 'center' : 'left'
            }}>
              <h4 className="lp-serif" style={{
                fontSize: '17px',
                fontWeight: '600',
                marginBottom: '16px',
                color: 'white'
              }}>Newsletter</h4>
              <p style={{ color: '#A8A29E', marginBottom: '16px', fontSize: window.innerWidth < 768 ? '0.85rem' : '0.95rem' }}>
                Subscribe to get the latest listings and market insights.
              </p>
              <div className="newsletter-input" style={{
                display: 'flex',
                position: 'relative',
                flexDirection: window.innerWidth < 768 ? 'column' : 'row',
                gap: window.innerWidth < 768 ? '8px' : '0'
              }}>
                <input
                  type='email'
                  placeholder='Enter Your Email'
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: window.innerWidth < 768 ? '10px' : '12px',
                    border: 'none',
                    background: 'rgba(255,255,255,0.06)',
                    color: 'white',
                    fontSize: window.innerWidth < 768 ? '13px' : '14px',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                  onBlur={(e) => e.target.style.background = 'rgba(255,255,255,0.06)'}
                />
                <button style={{
                  padding: window.innerWidth < 768 ? '10px 20px' : '0 20px',
                  background: 'linear-gradient(135deg, #0d9488, #0f766e)',
                  border: 'none',
                  borderRadius: window.innerWidth < 768 ? '8px' : '10px',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  height: window.innerWidth < 768 ? 'auto' : 'auto',
                  paddingTop: window.innerWidth < 768 ? '10px' : '12px',
                  paddingBottom: window.innerWidth < 768 ? '10px' : '12px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                  Join
                </button>
              </div>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '20px 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            flexDirection: window.innerWidth < 768 ? 'column' : 'row',
            textAlign: window.innerWidth < 768 ? 'center' : 'left'
          }}>
            <p style={{ color: '#A8A29E', fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem' }}>
              &copy; {new Date().getFullYear()} RealEstate. All rights reserved.
            </p>
            <div style={{
              display: 'flex',
              gap: window.innerWidth < 768 ? '16px' : '24px',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              {["Privacy Policy", "Terms of Service", "Cookies Settings"].map((item) => (
                <a href='#' key={item} style={{
                  color: '#A8A29E',
                  textDecoration: 'none',
                  fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = '#5eead4'}
                onMouseLeave={(e) => e.target.style.color = '#A8A29E'}>
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landingpage;