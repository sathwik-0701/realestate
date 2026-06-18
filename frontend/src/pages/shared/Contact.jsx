import React, { useState, useEffect } from 'react';
import { contactStyles as s } from '../../assets/dummyStyles';
import Navbar from '../../components/common/Navbar';
import SellerLayout from '../../components/common/SellerLayout';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import API_URL from '../../config';
import { 
  HiOutlineMail, 
  HiOutlinePhone, 
  HiOutlineLocationMarker, 
  HiOutlineCheckCircle, 
  HiOutlineExclamationCircle,
  HiOutlineUser,
  HiOutlineChat,
  HiOutlineClock
} from 'react-icons/hi';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaHeadset, FaRocket } from 'react-icons/fa';

const Contact = () => {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'buyer',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'buyer',
        message: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/api/contact`, formData);
      if (res.data.success) {
        setSuccess(true);
        setFormData(prev => ({ ...prev, message: '' }));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isSeller = user?.role === 'seller';

  const formContent = (
    <div style={{
      padding: isSeller ? '0' : '40px 24px',
      maxWidth: '1200px',
      margin: '0 auto',
      animation: 'fadeIn 0.6s ease-out'
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(13, 148, 136, 0.2); }
          50% { box-shadow: 0 0 40px rgba(13, 148, 136, 0.4); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-pulseGlow {
          animation: pulseGlow 3s ease-in-out infinite;
        }
        .shimmer-text {
          background: linear-gradient(90deg, #0d9488, #14b8a6, #f59e0b, #0d9488);
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
        .input-focus {
          transition: all 0.3s ease;
        }
        .input-focus:focus {
          border-color: #0d9488;
          box-shadow: 0 0 0 4px rgba(13,148,136,0.1);
          outline: none;
        }
        .btn-gradient {
          background: linear-gradient(135deg, #0d9488, #0f766e);
          transition: all 0.3s ease;
        }
        .btn-gradient:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(13,148,136,0.4);
        }
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .form-grid {
            grid-template-columns: 1fr !important;
          }
          .contact-header {
            text-align: center !important;
          }
          .contact-card {
            padding: 20px !important;
          }
        }
      `}</style>

      {/* Header */}
      <header className="contact-header" style={{
        textAlign: isSeller ? 'left' : 'center',
        marginBottom: isMobile ? '32px' : '48px',
        animation: 'slideUp 0.6s ease-out'
      }}>
        <div style={{
          display: "inline-block",
          padding: "6px 16px",
          background: "linear-gradient(135deg, rgba(13,148,136,0.12), rgba(13,148,136,0.06))",
          borderRadius: "50px",
          fontSize: "11px",
          fontWeight: "700",
          color: "#0d9488",
          textTransform: "uppercase",
          letterSpacing: "1px",
          marginBottom: "12px",
          border: "1px solid rgba(13,148,136,0.1)"
        }}>
          <FaHeadset style={{ display: "inline", marginRight: "6px" }} />
          Get in Touch
        </div>
        <h1 style={{
          fontSize: isMobile ? '28px' : '40px',
          fontWeight: '800',
          color: '#0f172a',
          marginBottom: '12px',
          letterSpacing: '-0.5px'
        }}>
          Contact <span className="shimmer-text">Support</span>
        </h1>
        <p style={{
          fontSize: isMobile ? '14px' : '16px',
          color: '#64748b',
          maxWidth: '600px',
          margin: isSeller ? '0' : '0 auto',
          lineHeight: '1.6'
        }}>
          Have questions or need assistance? Send us a message and our support team will get back to you shortly.
        </p>
      </header>

      {/* Grid */}
      <div className="contact-grid" style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1.5fr',
        gap: isMobile ? '24px' : '40px',
        alignItems: 'start'
      }}>
        {/* Contact Information */}
        <div className="animate-slideUp" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          {/* Contact Cards */}
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: isMobile ? '16px' : '24px',
            padding: isMobile ? '20px' : '32px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              {/* Email */}
              <div className="card-hover" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 15px rgba(59,130,246,0.2)'
                }}>
                  <FaEnvelope size={20} color="white" />
                </div>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Email Us
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#0f172a' }}>
                    psrpsr1432@gmail.com
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="card-hover" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 15px rgba(245,158,11,0.2)'
                }}>
                  <FaPhoneAlt size={20} color="white" />
                </div>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Call Us
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#0f172a' }}>
                    +91 8978726364
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="card-hover" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  background: 'linear-gradient(135deg, #10b981, #34d399)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 15px rgba(16,185,129,0.2)'
                }}>
                  <FaMapMarkerAlt size={20} color="white" />
                </div>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Our Headquarters
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#0f172a' }}>
                    123 Business Park, Sector 62, Noida, UP, India
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Support Card */}
          <div style={{
            background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
            borderRadius: isMobile ? '16px' : '24px',
            padding: isMobile ? '24px 20px' : '32px',
            color: 'white',
            textAlign: 'center',
            boxShadow: '0 8px 30px rgba(13,148,136,0.25)',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            <div style={{
              width: '56px',
              height: '56px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              <FaRocket size={28} color="white" />
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '8px'
            }}>24/7 Support</h3>
            <p style={{
              fontSize: '14px',
              opacity: 0.9,
              lineHeight: '1.6',
              maxWidth: '400px',
              margin: '0 auto'
            }}>
              Our support team is active round the clock to solve any queries regarding listing approvals, buyer negotiations, or technical issues.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="animate-slideUp" style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: isMobile ? '16px' : '24px',
          padding: isMobile ? '20px' : '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          border: '1px solid rgba(255,255,255,0.3)',
          animationDelay: '0.2s'
        }}>
          {/* Animated Border */}
          <div style={{
            height: '3px',
            background: 'linear-gradient(90deg, #0d9488, #14b8a6, #f59e0b, #0d9488)',
            backgroundSize: '300%',
            animation: 'shimmer 4s ease infinite',
            borderRadius: '2px',
            marginBottom: '24px'
          }} />

          {success ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                animation: 'pulseGlow 2s ease-in-out infinite'
              }}>
                <HiOutlineCheckCircle size={48} style={{ color: '#10b981' }} />
              </div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#0f172a',
                marginBottom: '8px'
              }}>Message Sent! 🎉</h2>
              <p style={{
                fontSize: '15px',
                color: '#64748b',
                marginBottom: '24px',
                lineHeight: '1.6'
              }}>
                Thank you for contacting us. We have received your inquiry and our support team will email you shortly.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="btn-gradient"
                style={{
                  padding: '12px 32px',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 20px rgba(13,148,136,0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(13,148,136,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(13,148,136,0.3)';
                }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-grid" style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: '16px',
                marginBottom: '16px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#334155',
                    marginBottom: '6px'
                  }}>
                    <HiOutlineUser size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="input-focus"
                    placeholder="Enter your name"
                    style={{
                      width: '100%',
                      padding: isMobile ? '12px 14px' : '14px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: isMobile ? '14px' : '15px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      background: 'white',
                      color: '#0f172a'
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#334155',
                    marginBottom: '6px'
                  }}>
                    <FaEnvelope size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="input-focus"
                    placeholder="Enter your email"
                    style={{
                      width: '100%',
                      padding: isMobile ? '12px 14px' : '14px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: isMobile ? '14px' : '15px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      background: 'white',
                      color: '#0f172a'
                    }}
                  />
                </div>
              </div>

              <div className="form-grid" style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: '16px',
                marginBottom: '16px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#334155',
                    marginBottom: '6px'
                  }}>
                    <FaPhoneAlt size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-focus"
                    placeholder="10-digit number"
                    style={{
                      width: '100%',
                      padding: isMobile ? '12px 14px' : '14px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: isMobile ? '14px' : '15px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      background: 'white',
                      color: '#0f172a'
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#334155',
                    marginBottom: '6px'
                  }}>
                    <HiOutlineUser size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Your Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="input-focus"
                    style={{
                      width: '100%',
                      padding: isMobile ? '12px 14px' : '14px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: isMobile ? '14px' : '15px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      background: 'white',
                      color: '#0f172a',
                      cursor: 'pointer',
                      appearance: 'auto'
                    }}
                  >
                    <option value="buyer">Buyer / Client</option>
                    <option value="seller">Seller / Agent</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#334155',
                  marginBottom: '6px'
                }}>
                  <HiOutlineChat size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="input-focus"
                  placeholder="Explain your issue or query..."
                  style={{
                    width: '100%',
                    padding: isMobile ? '12px 14px' : '14px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: isMobile ? '14px' : '15px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    background: 'white',
                    color: '#0f172a',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    minHeight: '120px'
                  }}
                />
              </div>

              {error && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                  borderRadius: '12px',
                  border: '1px solid #fca5a5',
                  marginBottom: '20px',
                  color: '#991b1b',
                  fontSize: '14px',
                  animation: 'shake 0.5s ease'
                }}>
                  <HiOutlineExclamationCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-gradient"
                style={{
                  width: '100%',
                  padding: isMobile ? '14px 20px' : '16px 24px',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: isMobile ? '14px' : '16px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 20px rgba(13,148,136,0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(13,148,136,0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(13,148,136,0.3)';
                }}
              >
                {loading ? (
                  <>
                    <span style={{
                      display: 'inline-block',
                      width: '18px',
                      height: '18px',
                      border: '2px solid white',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite'
                    }} />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <HiOutlineCheckCircle size={20} />
                    Submit Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: isSeller ? 'auto' : '100vh',
      background: isSeller ? 'transparent' : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      {!isSeller && (
        <>
          <div style={{
            position: 'absolute',
            top: '-10%',
            right: '-5%',
            width: isMobile ? '200px' : '400px',
            height: isMobile ? '200px' : '400px',
            background: 'radial-gradient(circle, rgba(13,148,136,0.06) 0%, rgba(13,148,136,0) 70%)',
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
            background: 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, rgba(245,158,11,0) 70%)',
            borderRadius: '50%',
            animation: 'float 15s ease-in-out infinite reverse'
          }} />
        </>
      )}

      {isSeller ? (
        <SellerLayout>
          {formContent}
        </SellerLayout>
      ) : (
        <>
          <Navbar />
          {formContent}
        </>
      )}
    </div>
  );
};

export default Contact;