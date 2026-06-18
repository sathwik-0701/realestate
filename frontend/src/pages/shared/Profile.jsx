import React, { useState } from 'react';
import { profileStyles as s } from '../../assets/dummyStyles';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';
import SellerLayout from '../../components/common/SellerLayout';
import axios from 'axios';
import API_URL from '../../config';
import { HiOutlineUser, HiX, HiMail, HiPhone, HiLocationMarker, HiCheck, HiOutlineMail, HiOutlinePhone, HiPencil, HiCamera } from 'react-icons/hi';
import { FaUserCircle, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaUserEdit } from 'react-icons/fa';

const Profile = () => {

  const { user, setUser, token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [removeProfilePic, setRemoveProfilePic] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const isMobile = window.innerWidth < 768;

  // handle text input change
  const handelInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setRemoveProfilePic(false);
    }
  };

  // update profile
  const handelUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("phone", formData.phone);
      data.append("address", formData.address);
      
      if (imageFile) {
        data.append("profilePic", imageFile);
      }
      if (removeProfilePic) {
        data.append("removeProfilePic", "true");
      }
      
      const res = await axios.put(`${API_URL}/api/user/profile`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      
      if (res.data.success) {
        const updateUser = res.data.user;
        setUser(updateUser);
        localStorage.setItem("user", JSON.stringify(updateUser));
        setIsEditing(false);
        setImageFile(null);
        setImagePreview(null);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setImageFile(null);
    setImagePreview(null);
    setRemoveProfilePic(false);
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
    });
  };

  const mainContent = (
    <div style={{
      minHeight: "100vh",
      background: user?.role === 'seller' ? "#f8fafc" : "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #ccfbf1 100%)",
      position: "relative",
      overflow: "hidden",
      padding: user?.role === 'seller' ? "0" : "80px 20px 40px",
      animation: "fadeIn 0.6s ease-out"
    }}>
      {/* Animated Background Elements */}
      {user?.role !== 'seller' && (
        <>
          <div style={{
            position: "absolute",
            top: "-10%",
            right: "-5%",
            width: isMobile ? "200px" : "400px",
            height: isMobile ? "200px" : "400px",
            background: "radial-gradient(circle, rgba(13,148,136,0.08) 0%, rgba(13,148,136,0) 70%)",
            borderRadius: "50%",
            animation: "float 20s ease-in-out infinite",
            display: isMobile ? "none" : "block"
          }} />
          <div style={{
            position: "absolute",
            bottom: "-10%",
            left: "-5%",
            width: isMobile ? "150px" : "300px",
            height: isMobile ? "150px" : "300px",
            background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, rgba(245,158,11,0) 70%)",
            borderRadius: "50%",
            animation: "float 15s ease-in-out infinite reverse"
          }} />
        </>
      )}

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
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
        }
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
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
          box-shadow: 0 8px 25px rgba(13,148,136,0.3);
        }
        @media (max-width: 768px) {
          .profile-card {
            padding: 20px !important;
            margin: 0 12px !important;
          }
          .profile-header {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
          }
          .info-grid {
            grid-template-columns: 1fr !important;
          }
          .form-grid {
            grid-template-columns: 1fr !important;
          }
          .avatar-wrapper {
            width: 100px !important;
            height: 100px !important;
          }
          .page-title {
            font-size: 24px !important;
          }
        }
      `}</style>

      <div style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: user?.role === 'seller' ? "24px 16px" : "0",
        position: "relative",
        zIndex: 1
      }}>
        {/* Header */}
        <header style={{
          textAlign: user?.role === 'seller' ? "left" : "center",
          marginBottom: isMobile ? "24px" : "32px",
          animation: "slideUp 0.6s ease-out"
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
            <FaUserEdit style={{ display: "inline", marginRight: "6px" }} />
            My Account
          </div>
          <h1 className="page-title" style={{
            fontSize: isMobile ? "28px" : "36px",
            fontWeight: "800",
            color: "#0f172a",
            marginBottom: "8px",
            letterSpacing: "-0.5px"
          }}>
            Personal <span className="shimmer-text">Profile</span>
          </h1>
          <p style={{
            fontSize: isMobile ? "13px" : "15px",
            color: "#64748b"
          }}>
            Manage your personal information and account settings
          </p>
        </header>

        {/* Profile Card */}
        <div className="profile-card animate-slideUp" style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: isMobile ? "20px" : "28px",
          padding: isMobile ? "24px" : "40px",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.3)",
          border: "1px solid rgba(255,255,255,0.3)",
          transition: "all 0.3s ease"
        }}>
          {/* Animated Border */}
          <div style={{
            height: "3px",
            background: "linear-gradient(90deg, #0d9488, #14b8a6, #f59e0b, #0d9488)",
            backgroundSize: "300%",
            animation: "shimmer 4s ease infinite",
            borderRadius: "2px",
            marginBottom: "24px"
          }} />

          {/* Profile Header */}
          <div className="profile-header" style={{
            display: "flex",
            alignItems: isMobile ? "center" : "flex-end",
            gap: isMobile ? "16px" : "24px",
            marginBottom: "32px",
            flexDirection: isMobile ? "column" : "row",
            textAlign: isMobile ? "center" : "left"
          }}>
            <div style={{
              position: "relative",
              flexShrink: 0
            }}>
              <div className="avatar-wrapper" style={{
                width: isMobile ? "120px" : "140px",
                height: isMobile ? "120px" : "140px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #0d9488, #0f766e)",
                padding: "4px",
                boxShadow: "0 8px 30px rgba(13,148,136,0.25)",
                position: "relative"
              }}>
                <div style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  overflow: "hidden",
                  background: "#f0fdf4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {imagePreview ? (
                    <img src={imagePreview} alt='preview' style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.3s ease"
                    }}
                    onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                    onMouseLeave={(e) => e.target.style.transform = "scale(1)"} />
                  ) : !removeProfilePic && user?.profilePic ? (
                    <img src={user.profilePic} alt='pic' style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.3s ease"
                    }}
                    onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                    onMouseLeave={(e) => e.target.style.transform = "scale(1)"} />
                  ) : (
                    <span style={{
                      fontSize: isMobile ? "40px" : "52px",
                      fontWeight: "700",
                      color: "#0d9488",
                      background: "linear-gradient(135deg, #0d9488, #14b8a6)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent"
                    }}>
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </span>
                  )}
                </div>
              </div>
              
              {isEditing && (
                <>
                  <label style={{
                    position: "absolute",
                    bottom: "4px",
                    right: "4px",
                    width: "38px",
                    height: "38px",
                    background: "linear-gradient(135deg, #0d9488, #0f766e)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 4px 15px rgba(13,148,136,0.3)",
                    transition: "transform 0.3s ease"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
                    <input
                      type='file'
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                      accept='image/*'
                    />
                    <HiCamera size={18} color="white" />
                  </label>
                  
                  {(imagePreview || (!removeProfilePic && user?.profilePic)) && (
                    <button
                      type='button'
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                        setRemoveProfilePic(true);
                      }}
                      style={{
                        position: "absolute",
                        bottom: "4px",
                        left: "4px",
                        width: "38px",
                        height: "38px",
                        background: "linear-gradient(135deg, #ef4444, #dc2626)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 4px 15px rgba(239,68,68,0.3)",
                        transition: "transform 0.3s ease"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
                      <HiX size={18} color="white" />
                    </button>
                  )}
                </>
              )}
            </div>

            <div>
              <h2 style={{
                fontSize: isMobile ? "22px" : "28px",
                fontWeight: "800",
                color: "#0f172a",
                marginBottom: "6px"
              }}>{user?.name}</h2>
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                alignItems: "center",
                justifyContent: isMobile ? "center" : "flex-start"
              }}>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 14px",
                  background: "linear-gradient(135deg, #0d9488, #0f766e)",
                  color: "white",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "600",
                  boxShadow: "0 2px 10px rgba(13,148,136,0.2)"
                }}>
                  <FaUserCircle size={14} />
                  {user?.role?.toUpperCase()}
                </span>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 12px",
                  background: "#f1f5f9",
                  borderRadius: "20px",
                  fontSize: "11px",
                  color: "#64748b"
                }}>
                  <HiMail size={12} />
                  {user?.email}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 16px",
              background: "linear-gradient(135deg, #fef2f2, #fee2e2)",
              borderRadius: "12px",
              border: "1px solid #fca5a5",
              marginBottom: "24px",
              color: "#991b1b",
              fontSize: "14px",
              animation: "shake 0.5s ease"
            }}>
              <HiX size={18} />
              <span>{error}</span>
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handelUpdate} style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: isMobile ? "16px" : "20px"
            }}>
              <div style={{ gridColumn: isMobile ? "1" : "1 / -1" }}>
                <label style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#334155",
                  marginBottom: "6px"
                }}>Full Name</label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handelInputChange}
                  required
                  className="input-focus"
                  style={{
                    width: "100%",
                    padding: isMobile ? "12px 14px" : "14px 16px",
                    border: "2px solid #e2e8f0",
                    borderRadius: "12px",
                    fontSize: isMobile ? "14px" : "15px",
                    outline: "none",
                    transition: "all 0.3s ease",
                    background: "white",
                    color: "#0f172a"
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#334155",
                  marginBottom: "6px"
                }}>Phone Number</label>
                <input
                  type='tel'
                  name='phone'
                  value={formData.phone}
                  onChange={handelInputChange}
                  pattern='\d*'
                  className="input-focus"
                  placeholder='10-digit phone number'
                  style={{
                    width: "100%",
                    padding: isMobile ? "12px 14px" : "14px 16px",
                    border: "2px solid #e2e8f0",
                    borderRadius: "12px",
                    fontSize: isMobile ? "14px" : "15px",
                    outline: "none",
                    transition: "all 0.3s ease",
                    background: "white",
                    color: "#0f172a"
                  }}
                />
              </div>
              
              <div style={{ gridColumn: isMobile ? "1" : "2 / 3" }}>
                <label style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#334155",
                  marginBottom: "6px"
                }}>Address</label>
                <textarea
                  name='address'
                  value={formData.address}
                  onChange={handelInputChange}
                  className="input-focus"
                  placeholder='Enter your full address'
                  rows="2"
                  style={{
                    width: "100%",
                    padding: isMobile ? "12px 14px" : "14px 16px",
                    border: "2px solid #e2e8f0",
                    borderRadius: "12px",
                    fontSize: isMobile ? "14px" : "15px",
                    outline: "none",
                    transition: "all 0.3s ease",
                    background: "white",
                    color: "#0f172a",
                    resize: "vertical",
                    fontFamily: "inherit"
                  }}
                />
              </div>

              <div style={{
                gridColumn: isMobile ? "1" : "1 / -1",
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: "12px",
                marginTop: "8px"
              }}>
                <button
                  type='submit'
                  disabled={loading}
                  className="btn-gradient"
                  style={{
                    flex: 1,
                    padding: isMobile ? "12px 20px" : "14px 24px",
                    border: "none",
                    borderRadius: "12px",
                    color: "white",
                    fontWeight: "700",
                    fontSize: isMobile ? "14px" : "15px",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 20px rgba(13,148,136,0.3)"
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 8px 30px rgba(13,148,136,0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(13,148,136,0.3)";
                  }}
                >
                  {loading ? (
                    <>
                      <span style={{
                        display: "inline-block",
                        width: "18px",
                        height: "18px",
                        border: "2px solid white",
                        borderTop: "2px solid transparent",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite"
                      }} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <HiCheck size={20} />
                      Save Changes
                    </>
                  )}
                </button>
                
                <button
                  type='button'
                  onClick={handleCancel}
                  style={{
                    flex: 1,
                    padding: isMobile ? "12px 20px" : "14px 24px",
                    background: "white",
                    border: "2px solid #e2e8f0",
                    borderRadius: "12px",
                    color: "#64748b",
                    fontWeight: "600",
                    fontSize: isMobile ? "14px" : "15px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#94a3b8";
                    e.currentTarget.style.background = "#f8fafc";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.background = "white";
                  }}
                >
                  <HiX size={20} />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              {/* Info Cards Grid */}
              <div className="info-grid" style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                gap: isMobile ? "12px" : "16px",
                marginBottom: "32px"
              }}>
                {/* Email Card */}
                <div className="card-hover" style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "18px 20px",
                  background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  transition: "all 0.3s ease"
                }}>
                  <div style={{
                    width: "44px",
                    height: "44px",
                    background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 4px 15px rgba(59,130,246,0.2)"
                  }}>
                    <FaEnvelope size={20} color="white" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Email
                    </p>
                    <p style={{
                      fontSize: isMobile ? "13px" : "14px",
                      fontWeight: "600",
                      color: "#0f172a",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}>
                      {user?.email}
                    </p>
                  </div>
                </div>

                {/* Phone Card */}
                <div className="card-hover" style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "18px 20px",
                  background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  transition: "all 0.3s ease"
                }}>
                  <div style={{
                    width: "44px",
                    height: "44px",
                    background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 4px 15px rgba(245,158,11,0.2)"
                  }}>
                    <FaPhoneAlt size={20} color="white" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Phone
                    </p>
                    <p style={{
                      fontSize: isMobile ? "13px" : "14px",
                      fontWeight: "600",
                      color: "#0f172a",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}>
                      {user?.phone || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Address Card */}
                <div className="card-hover" style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "18px 20px",
                  background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  transition: "all 0.3s ease"
                }}>
                  <div style={{
                    width: "44px",
                    height: "44px",
                    background: "linear-gradient(135deg, #10b981, #34d399)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 4px 15px rgba(16,185,129,0.2)"
                  }}>
                    <FaMapMarkerAlt size={20} color="white" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Address
                    </p>
                    <p style={{
                      fontSize: isMobile ? "13px" : "14px",
                      fontWeight: "600",
                      color: "#0f172a",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}>
                      {user?.address || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Edit Profile Button */}
              <div style={{
                textAlign: "center",
                paddingTop: "8px"
              }}>
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    padding: isMobile ? "12px 32px" : "14px 40px",
                    background: "linear-gradient(135deg, #0d9488, #0f766e)",
                    border: "none",
                    borderRadius: "30px",
                    color: "white",
                    fontWeight: "700",
                    fontSize: isMobile ? "14px" : "15px",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 20px rgba(13,148,136,0.3)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 30px rgba(13,148,136,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(13,148,136,0.3)";
                  }}
                >
                  <HiPencil size={18} />
                  Edit Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return user?.role === 'seller' ? (
    <SellerLayout>{mainContent}</SellerLayout>
  ) : (
    mainContent
  );
}

export default Profile;