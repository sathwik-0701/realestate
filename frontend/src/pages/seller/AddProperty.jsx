import React, { useState } from 'react';
import { addPropertyStyles as s } from '../../assets/dummyStyles';
import SellerLayout from '../../components/common/SellerLayout';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import API_URL from '../../config';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineUpload, 
  HiX, 
  HiOutlineExclamationCircle,
  HiOutlineHome,
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlinePhotograph,
  HiOutlineCheckCircle
} from 'react-icons/hi';
import { FaBuilding } from 'react-icons/fa';

const AddProperty = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    city: '',
    area: '',
    pincode: '',
    propertyType: 'apartment',  // ✅ Default is apartment
    bhk: '2',
    bathrooms: '2',
    areaSize: '',
    furnishing: 'semi-furnished',
    floors: '',
    status: 'sale'
  });
  const [selectedAmenities, setSelectedAmenities] = useState({
    parking: false,
    gym: false,
    wifi: false,
    lift: false,
    security: false,
    powerBackup: false,
    swimmingPool: false,
    garden: false
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const amenitiesList = [
    { key: 'parking', label: 'Parking Space', icon: '🅿️' },
    { key: 'gym', label: 'Gymnasium', icon: '💪' },
    { key: 'wifi', label: 'Wi-Fi / Internet', icon: '📶' },
    { key: 'lift', label: 'Elevator / Lift', icon: '🛗' },
    { key: 'security', label: '24/7 Security', icon: '🛡️' },
    { key: 'powerBackup', label: 'Power Backup', icon: '⚡' },
    { key: 'swimmingPool', label: 'Swimming Pool', icon: '🏊' },
    { key: 'garden', label: 'Garden / Lawn', icon: '🌿' }
  ];

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAmenityChange = (key) => {
    setSelectedAmenities(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    if (imageFiles.length + files.length > 10) {
      alert("You can upload a maximum of 10 images");
      return;
    }

    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newFiles = [...imageFiles];
    newFiles.splice(index, 1);
    setImageFiles(newFiles);

    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (imageFiles.length === 0) {
      setError("Please upload at least one image of the property");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('city', formData.city);
      data.append('area', formData.area);
      data.append('pincode', formData.pincode);
      data.append('propertyType', formData.propertyType);  // ✅ Sends "apartment"
      data.append('bhk', formData.bhk);
      data.append('bathrooms', formData.bathrooms);
      data.append('areaSize', formData.areaSize);
      data.append('furnishing', formData.furnishing);
      data.append('status', formData.status);

      const amenities = [];
      amenitiesList.forEach(item => {
        if (selectedAmenities[item.key]) {
          amenities.push(item.label);
        }
      });
      if (formData.floors) {
        amenities.push(`Floors: ${formData.floors}`);
      }
      data.append('amenities', JSON.stringify(amenities));

      imageFiles.forEach(file => {
        data.append('images', file);
      });

      const res = await axios.post(`${API_URL}/api/property`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        alert("Property added successfully!");
        navigate('/my-properties');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create listing. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SellerLayout>
      {/* === Design system: fonts, focus states, micro-interactions === */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap');

        .ap-root, .ap-root * { font-family: 'Inter', -apple-system, sans-serif; }
        .ap-serif { font-family: 'Fraunces', Georgia, serif !important; }

        .ap-input:focus, .ap-select:focus, .ap-textarea:focus {
          border-color: #0d9488 !important;
          box-shadow: 0 0 0 4px rgba(13,148,136,0.12), inset 0 1px 2px rgba(28,25,23,0.02) !important;
          background: #ffffff !important;
        }
        .ap-input::placeholder, .ap-textarea::placeholder { color: #B8AFA0; }

        .ap-dropzone:hover { border-color: #0f766e !important; background: rgba(13,148,136,0.07) !important; }
        .ap-dropzone:hover .ap-upload-icon { transform: translateY(-3px); }
        .ap-upload-icon { transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1); }

        .ap-amenity:hover { border-color: #C9BFA8 !important; transform: translateY(-1px); }
        .ap-amenity-active { box-shadow: 0 4px 14px rgba(13,148,136,0.16); }

        .ap-thumb { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .ap-thumb:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(28,25,23,0.16); }
        .ap-thumb:hover img { transform: scale(1.06); }
        .ap-thumb img { transition: transform 0.4s ease; }

        .ap-btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 32px rgba(13,148,136,0.38) !important;
        }
        .ap-btn-primary:active:not(:disabled) { transform: translateY(0); }
        .ap-btn-ghost:hover { border-color: #C9BFA8 !important; background: #FBF9F5 !important; }

        .ap-section-num {
          font-family: 'Fraunces', serif;
          font-feature-settings: 'tnum';
        }

        @media (prefers-reduced-motion: reduce) {
          .ap-root *, .ap-root *::before, .ap-root *::after { animation: none !important; transition: none !important; }
        }
      `}</style>

      <div className="ap-root" style={{
        minHeight: "100vh",
        background: "#FAF7F1",
        backgroundImage: "radial-gradient(circle at 100% 0%, rgba(13,148,136,0.05) 0%, transparent 45%), radial-gradient(circle at 0% 100%, rgba(194,116,42,0.04) 0%, transparent 45%)",
        padding: isMobile ? "12px" : "20px",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Animated Background Elements - Hidden on Mobile */}
        <div style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: isMobile ? "150px" : "320px",
          height: isMobile ? "150px" : "320px",
          background: "radial-gradient(circle, rgba(13,148,136,0.10) 0%, rgba(13,148,136,0) 70%)",
          borderRadius: "50%",
          animation: "float 25s ease-in-out infinite",
          display: isMobile ? "none" : "block"
        }} />
        <div style={{
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: isMobile ? "120px" : "260px",
          height: isMobile ? "120px" : "260px",
          background: "radial-gradient(circle, rgba(194,116,42,0.08) 0%, rgba(194,116,42,0) 70%)",
          borderRadius: "50%",
          animation: "float 20s ease-in-out infinite reverse",
          display: isMobile ? "none" : "block"
        }} />

        <div style={{
          maxWidth: "900px",
          width: "100%",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
          animation: "fadeSlideUp 0.6s ease-out"
        }}>
          {/* Header */}
          <div style={{
            textAlign: "center",
            marginBottom: isMobile ? "26px" : "44px"
          }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(194,116,42,0.10)",
              color: "#A85D1F",
              padding: isMobile ? "5px 14px" : "8px 20px",
              borderRadius: "50px",
              fontSize: isMobile ? "10px" : "11.5px",
              fontWeight: "700",
              letterSpacing: "1.6px",
              textTransform: "uppercase",
              marginBottom: isMobile ? "14px" : "20px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(194,116,42,0.18)"
            }}>
              <FaBuilding size={isMobile ? 11 : 14} />
              New Listing
            </div>
            <h1 className="ap-serif" style={{
              fontSize: isMobile ? "30px" : "48px",
              fontWeight: "600",
              color: "#1C1917",
              marginBottom: isMobile ? "8px" : "12px",
              letterSpacing: "-1px",
              lineHeight: 1.1
            }}>
              Add a new <span style={{
                fontStyle: "italic",
                fontWeight: "500",
                background: "linear-gradient(135deg, #0d9488, #0f766e)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>property</span>
            </h1>
            <p style={{
              fontSize: isMobile ? "13.5px" : "16px",
              color: "#78716C",
              maxWidth: "440px",
              margin: "0 auto",
              lineHeight: 1.5
            }}>
              List your property to reach thousands of verified buyers
            </p>
          </div>

          {/* Form Card */}
          <form onSubmit={handleSubmit} style={{
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(20px)",
            borderRadius: isMobile ? "18px" : "24px",
            boxShadow: "0 30px 60px -15px rgba(28,25,23,0.12), 0 1px 0 rgba(255,255,255,0.6) inset, 0 0 0 1px rgba(28,25,23,0.04)",
            padding: isMobile ? "18px" : "44px",
            border: "1px solid rgba(255,255,255,0.4)"
          }}>
            {error && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "14px 18px",
                background: "linear-gradient(135deg, #fef2f2, #fee2e2)",
                borderRadius: "12px",
                border: "1px solid #fca5a5",
                marginBottom: "24px",
                color: "#991b1b",
                fontSize: isMobile ? "13px" : "14px",
                animation: "shake 0.5s ease"
              }}>
                <HiOutlineExclamationCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {/* Section 1: Basic Information */}
            <div style={{
              marginBottom: isMobile ? "30px" : "44px"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                marginBottom: isMobile ? "18px" : "26px"
              }}>
                <span className="ap-section-num" style={{
                  fontSize: isMobile ? "13px" : "15px",
                  fontWeight: "600",
                  color: "#0d9488",
                  background: "rgba(13,148,136,0.09)",
                  width: isMobile ? "26px" : "30px",
                  height: isMobile ? "26px" : "30px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}>01</span>
                <h3 className="ap-serif" style={{
                  fontSize: isMobile ? "19px" : "23px",
                  fontWeight: "600",
                  color: "#1C1917",
                  letterSpacing: "-0.3px"
                }}>Basic Information</h3>
              </div>

              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: isMobile ? "16px" : "20px"
              }}>
                <div>
                  <label style={{
                    display: "block",
                    fontSize: isMobile ? "12.5px" : "13.5px",
                    fontWeight: "600",
                    color: "#57534E",
                    marginBottom: "7px",
                    letterSpacing: "0.2px"
                  }}>Property Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. 2 BHK Luxury Flat in Prime Location"
                    className="ap-input"
                    style={{
                      width: "100%",
                      padding: isMobile ? "12px 14px" : "13px 18px",
                      border: "1.5px solid #E7E2D9",
                      borderRadius: "12px",
                      fontSize: isMobile ? "14px" : "15px",
                      outline: "none",
                      transition: "all 0.25s ease",
                      background: "#FBF9F5",
                      color: "#1C1917",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: "block",
                    fontSize: isMobile ? "12.5px" : "13.5px",
                    fontWeight: "600",
                    color: "#57534E",
                    marginBottom: "7px",
                    letterSpacing: "0.2px"
                  }}>Detailed Description</label>
                  <textarea
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe key features, society atmosphere, proximity to schools/metros, water facility, etc."
                    rows={isMobile ? 4 : 5}
                    className="ap-textarea"
                    style={{
                      width: "100%",
                      padding: isMobile ? "12px 14px" : "13px 18px",
                      border: "1.5px solid #E7E2D9",
                      borderRadius: "12px",
                      fontSize: isMobile ? "14px" : "15px",
                      outline: "none",
                      transition: "all 0.25s ease",
                      background: "#FBF9F5",
                      resize: "vertical",
                      fontFamily: "inherit",
                      color: "#1C1917",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Pricing and Specifications */}
            <div style={{
              marginBottom: isMobile ? "30px" : "44px"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                marginBottom: isMobile ? "18px" : "26px"
              }}>
                <span className="ap-section-num" style={{
                  fontSize: isMobile ? "13px" : "15px",
                  fontWeight: "600",
                  color: "#0d9488",
                  background: "rgba(13,148,136,0.09)",
                  width: isMobile ? "26px" : "30px",
                  height: isMobile ? "26px" : "30px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}>02</span>
                <h3 className="ap-serif" style={{
                  fontSize: isMobile ? "19px" : "23px",
                  fontWeight: "600",
                  color: "#1C1917",
                  letterSpacing: "-0.3px"
                }}>Pricing &amp; Specifications</h3>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: isMobile ? "16px" : "20px",
                marginBottom: isMobile ? "16px" : "20px"
              }}>
                <div>
                  <label style={{
                    display: "block",
                    fontSize: isMobile ? "12.5px" : "13.5px",
                    fontWeight: "600",
                    color: "#57534E",
                    marginBottom: "7px",
                    letterSpacing: "0.2px"
                  }}>Price (INR)</label>
                  <input
                    type="number"
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Price in ₹"
                    className="ap-input"
                    style={{
                      width: "100%",
                      padding: isMobile ? "12px 14px" : "13px 18px",
                      border: "1.5px solid #E7E2D9",
                      borderRadius: "12px",
                      fontSize: isMobile ? "14px" : "15px",
                      outline: "none",
                      transition: "all 0.25s ease",
                      background: "#FBF9F5",
                      color: "#1C1917",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: "block",
                    fontSize: isMobile ? "12.5px" : "13.5px",
                    fontWeight: "600",
                    color: "#57534E",
                    marginBottom: "7px",
                    letterSpacing: "0.2px"
                  }}>Property Type</label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="ap-select"
                    style={{
                      width: "100%",
                      padding: isMobile ? "12px 14px" : "13px 18px",
                      border: "1.5px solid #E7E2D9",
                      borderRadius: "12px",
                      fontSize: isMobile ? "14px" : "15px",
                      outline: "none",
                      transition: "all 0.25s ease",
                      background: "#FBF9F5",
                      color: "#1C1917",
                      cursor: "pointer",
                      appearance: "auto",
                      boxSizing: "border-box"
                    }}
                  >
                    {/* ✅ Updated: Using "apartment" for Flat/Apartment */}
                    <option value="apartment">Flat/Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="house">House</option>
                    <option value="studio">Studio</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="office">Office Space</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="plot">Plot / Land</option>
                    <option value="commercial">Commercial Space</option>
                  </select>
                </div>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr",
                gap: isMobile ? "12px" : "16px",
                marginBottom: isMobile ? "16px" : "20px"
              }}>
                <div>
                  <label style={{
                    display: "block",
                    fontSize: isMobile ? "12.5px" : "13.5px",
                    fontWeight: "600",
                    color: "#57534E",
                    marginBottom: "7px",
                    letterSpacing: "0.2px"
                  }}>BHK Configuration</label>
                  <select
                    name="bhk"
                    value={formData.bhk}
                    onChange={handleInputChange}
                    className="ap-select"
                    style={{
                      width: "100%",
                      padding: isMobile ? "12px 14px" : "13px 18px",
                      border: "1.5px solid #E7E2D9",
                      borderRadius: "12px",
                      fontSize: isMobile ? "14px" : "15px",
                      outline: "none",
                      transition: "all 0.25s ease",
                      background: "#FBF9F5",
                      color: "#1C1917",
                      cursor: "pointer",
                      appearance: "auto",
                      boxSizing: "border-box"
                    }}
                  >
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4 BHK</option>
                    <option value="5+">5+ BHK</option>
                    <option value="0">N/A (Plot/Commercial)</option>
                  </select>
                </div>
                <div>
                  <label style={{
                    display: "block",
                    fontSize: isMobile ? "12.5px" : "13.5px",
                    fontWeight: "600",
                    color: "#57534E",
                    marginBottom: "7px",
                    letterSpacing: "0.2px"
                  }}>Bathrooms</label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    placeholder="No. of bathrooms"
                    className="ap-input"
                    style={{
                      width: "100%",
                      padding: isMobile ? "12px 14px" : "13px 18px",
                      border: "1.5px solid #E7E2D9",
                      borderRadius: "12px",
                      fontSize: isMobile ? "14px" : "15px",
                      outline: "none",
                      transition: "all 0.25s ease",
                      background: "#FBF9F5",
                      color: "#1C1917",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
                <div style={{
                  display: isMobile && "none" ? "none" : "block"
                }}>
                  <label style={{
                    display: "block",
                    fontSize: isMobile ? "12.5px" : "13.5px",
                    fontWeight: "600",
                    color: "#57534E",
                    marginBottom: "7px",
                    letterSpacing: "0.2px"
                  }}>Floor Number / Total Floors</label>
                  <input
                    type="text"
                    name="floors"
                    value={formData.floors}
                    onChange={handleInputChange}
                    placeholder="e.g. 3rd of 5 floors"
                    className="ap-input"
                    style={{
                      width: "100%",
                      padding: isMobile ? "12px 14px" : "13px 18px",
                      border: "1.5px solid #E7E2D9",
                      borderRadius: "12px",
                      fontSize: isMobile ? "14px" : "15px",
                      outline: "none",
                      transition: "all 0.25s ease",
                      background: "#FBF9F5",
                      color: "#1C1917",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
                {/* Mobile floor field - full width */}
                {isMobile && (
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{
                      display: "block",
                      fontSize: isMobile ? "12.5px" : "13.5px",
                      fontWeight: "600",
                      color: "#57534E",
                      marginBottom: "7px",
                      letterSpacing: "0.2px"
                    }}>Floor Number / Total Floors</label>
                    <input
                      type="text"
                      name="floors"
                      value={formData.floors}
                      onChange={handleInputChange}
                      placeholder="e.g. 3rd of 5 floors"
                      className="ap-input"
                      style={{
                        width: "100%",
                        padding: isMobile ? "12px 14px" : "13px 18px",
                        border: "1.5px solid #E7E2D9",
                        borderRadius: "12px",
                        fontSize: isMobile ? "14px" : "15px",
                        outline: "none",
                        transition: "all 0.25s ease",
                        background: "#FBF9F5",
                        color: "#1C1917",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                )}
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: isMobile ? "16px" : "20px"
              }}>
                <div>
                  <label style={{
                    display: "block",
                    fontSize: isMobile ? "12.5px" : "13.5px",
                    fontWeight: "600",
                    color: "#57534E",
                    marginBottom: "7px",
                    letterSpacing: "0.2px"
                  }}>Area Size (sq ft)</label>
                  <input
                    type="number"
                    name="areaSize"
                    required
                    value={formData.areaSize}
                    onChange={handleInputChange}
                    placeholder="Area in square feet"
                    className="ap-input"
                    style={{
                      width: "100%",
                      padding: isMobile ? "12px 14px" : "13px 18px",
                      border: "1.5px solid #E7E2D9",
                      borderRadius: "12px",
                      fontSize: isMobile ? "14px" : "15px",
                      outline: "none",
                      transition: "all 0.25s ease",
                      background: "#FBF9F5",
                      color: "#1C1917",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: "block",
                    fontSize: isMobile ? "12.5px" : "13.5px",
                    fontWeight: "600",
                    color: "#57534E",
                    marginBottom: "7px",
                    letterSpacing: "0.2px"
                  }}>Furnishing Status</label>
                  <select
                    name="furnishing"
                    value={formData.furnishing}
                    onChange={handleInputChange}
                    className="ap-select"
                    style={{
                      width: "100%",
                      padding: isMobile ? "12px 14px" : "13px 18px",
                      border: "1.5px solid #E7E2D9",
                      borderRadius: "12px",
                      fontSize: isMobile ? "14px" : "15px",
                      outline: "none",
                      transition: "all 0.25s ease",
                      background: "#FBF9F5",
                      color: "#1C1917",
                      cursor: "pointer",
                      appearance: "auto",
                      boxSizing: "border-box"
                    }}
                  >
                    <option value="furnished">Furnished</option>
                    <option value="semi-furnished">Semi-Furnished</option>
                    <option value="unfurnished">Unfurnished</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Location Details */}
            <div style={{
              marginBottom: isMobile ? "30px" : "44px"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                marginBottom: isMobile ? "18px" : "26px"
              }}>
                <span className="ap-section-num" style={{
                  fontSize: isMobile ? "13px" : "15px",
                  fontWeight: "600",
                  color: "#0d9488",
                  background: "rgba(13,148,136,0.09)",
                  width: isMobile ? "26px" : "30px",
                  height: isMobile ? "26px" : "30px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}>03</span>
                <h3 className="ap-serif" style={{
                  fontSize: isMobile ? "19px" : "23px",
                  fontWeight: "600",
                  color: "#1C1917",
                  letterSpacing: "-0.3px"
                }}>Location Details</h3>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
                gap: isMobile ? "16px" : "20px"
              }}>
                <div>
                  <label style={{
                    display: "block",
                    fontSize: isMobile ? "12.5px" : "13.5px",
                    fontWeight: "600",
                    color: "#57534E",
                    marginBottom: "7px",
                    letterSpacing: "0.2px"
                  }}>City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Noida"
                    className="ap-input"
                    style={{
                      width: "100%",
                      padding: isMobile ? "12px 14px" : "13px 18px",
                      border: "1.5px solid #E7E2D9",
                      borderRadius: "12px",
                      fontSize: isMobile ? "14px" : "15px",
                      outline: "none",
                      transition: "all 0.25s ease",
                      background: "#FBF9F5",
                      color: "#1C1917",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: "block",
                    fontSize: isMobile ? "12.5px" : "13.5px",
                    fontWeight: "600",
                    color: "#57534E",
                    marginBottom: "7px",
                    letterSpacing: "0.2px"
                  }}>Area / Locality</label>
                  <input
                    type="text"
                    name="area"
                    required
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="e.g. Sector 62"
                    className="ap-input"
                    style={{
                      width: "100%",
                      padding: isMobile ? "12px 14px" : "13px 18px",
                      border: "1.5px solid #E7E2D9",
                      borderRadius: "12px",
                      fontSize: isMobile ? "14px" : "15px",
                      outline: "none",
                      transition: "all 0.25s ease",
                      background: "#FBF9F5",
                      color: "#1C1917",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: "block",
                    fontSize: isMobile ? "12.5px" : "13.5px",
                    fontWeight: "600",
                    color: "#57534E",
                    marginBottom: "7px",
                    letterSpacing: "0.2px"
                  }}>Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="6-digit pincode"
                    className="ap-input"
                    style={{
                      width: "100%",
                      padding: isMobile ? "12px 14px" : "13px 18px",
                      border: "1.5px solid #E7E2D9",
                      borderRadius: "12px",
                      fontSize: isMobile ? "14px" : "15px",
                      outline: "none",
                      transition: "all 0.25s ease",
                      background: "#FBF9F5",
                      color: "#1C1917",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Amenities */}
            <div style={{
              marginBottom: isMobile ? "30px" : "44px"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                marginBottom: isMobile ? "18px" : "26px"
              }}>
                <span className="ap-section-num" style={{
                  fontSize: isMobile ? "13px" : "15px",
                  fontWeight: "600",
                  color: "#0d9488",
                  background: "rgba(13,148,136,0.09)",
                  width: isMobile ? "26px" : "30px",
                  height: isMobile ? "26px" : "30px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}>04</span>
                <h3 className="ap-serif" style={{
                  fontSize: isMobile ? "19px" : "23px",
                  fontWeight: "600",
                  color: "#1C1917",
                  letterSpacing: "-0.3px"
                }}>Amenities Available</h3>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
                gap: isMobile ? "8px" : "12px"
              }}>
                {amenitiesList.map(item => {
                  const isActive = selectedAmenities[item.key];
                  return (
                    <label
                      key={item.key}
                      className={`ap-amenity${isActive ? ' ap-amenity-active' : ''}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        cursor: "pointer",
                        padding: isMobile ? "10px 12px" : "14px 16px",
                        borderRadius: "12px",
                        border: `1.5px solid ${isActive ? '#0d9488' : '#E7E2D9'}`,
                        background: isActive ? 'rgba(13,148,136,0.07)' : '#FBF9F5',
                        transition: "all 0.25s ease",
                        fontSize: isMobile ? "12px" : "13px",
                        fontWeight: "600",
                        color: isActive ? '#0d9488' : '#57534E'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() => handleAmenityChange(item.key)}
                        style={{
                          accentColor: "#0d9488",
                          width: "16px",
                          height: "16px",
                          cursor: "pointer"
                        }}
                      />
                      <span style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}>
                        <span>{item.icon}</span>
                        {!isMobile && item.label}
                        {isMobile && item.label.length > 10 ? item.label.substring(0, 8) + '…' : item.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Section 5: Property Images */}
            <div style={{
              marginBottom: isMobile ? "30px" : "44px"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                marginBottom: isMobile ? "18px" : "26px"
              }}>
                <span className="ap-section-num" style={{
                  fontSize: isMobile ? "13px" : "15px",
                  fontWeight: "600",
                  color: "#0d9488",
                  background: "rgba(13,148,136,0.09)",
                  width: isMobile ? "26px" : "30px",
                  height: isMobile ? "26px" : "30px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}>05</span>
                <h3 className="ap-serif" style={{
                  fontSize: isMobile ? "19px" : "23px",
                  fontWeight: "600",
                  color: "#1C1917",
                  letterSpacing: "-0.3px"
                }}>Property Images</h3>
              </div>

              <div className="ap-dropzone" style={{
                border: "2px dashed #0d9488",
                borderRadius: "16px",
                padding: isMobile ? "24px 16px" : "44px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                background: "rgba(13,148,136,0.045)",
                position: "relative"
              }}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0,
                    cursor: "pointer"
                  }}
                />
                <div style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "14px"
                }}>
                  <div className="ap-upload-icon" style={{
                    width: isMobile ? "56px" : "68px",
                    height: isMobile ? "56px" : "68px",
                    background: "linear-gradient(135deg, rgba(13,148,136,0.14), rgba(13,148,136,0.06))",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <HiOutlineUpload size={isMobile ? 24 : 30} style={{ color: "#0d9488" }} />
                  </div>
                </div>
                <h4 className="ap-serif" style={{
                  fontSize: isMobile ? "15px" : "17px",
                  fontWeight: "600",
                  color: "#1C1917",
                  marginBottom: "5px"
                }}>Drag &amp; drop or click to upload</h4>
                <p style={{
                  fontSize: isMobile ? "11px" : "13px",
                  color: "#A8A29E"
                }}>Up to 10 images · JPEG, PNG, WEBP · Recommended 800×600px</p>
              </div>

              {imagePreviews.length > 0 && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "repeat(5, 1fr)",
                  gap: "12px",
                  marginTop: "16px"
                }}>
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="ap-thumb" style={{
                      position: "relative",
                      aspectRatio: "1",
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: "1.5px solid #E7E2D9",
                      background: "#FBF9F5"
                    }}>
                      <img
                        src={preview}
                        alt="preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover"
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        style={{
                          position: "absolute",
                          top: "4px",
                          right: "4px",
                          background: "rgba(28,25,23,0.55)",
                          backdropFilter: "blur(4px)",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: isMobile ? "22px" : "26px",
                          height: isMobile ? "22px" : "26px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "transform 0.2s ease, background 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.1)";
                          e.currentTarget.style.background = "rgba(220,38,38,0.9)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.background = "rgba(28,25,23,0.55)";
                        }}
                      >
                        <HiX size={isMobile ? 12 : 15} />
                      </button>
                      <div style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: "linear-gradient(to top, rgba(28,25,23,0.55), transparent)",
                        padding: "10px 6px 4px",
                        fontSize: "9.5px",
                        fontWeight: "600",
                        color: "white",
                        textAlign: "center"
                      }}>
                        {index + 1}
                      </div>
                    </div>
                  ))}
                  {imagePreviews.length < 10 && (
                    <div style={{
                      aspectRatio: "1",
                      borderRadius: "12px",
                      border: "1.5px dashed #D6CFC2",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#FBF9F5",
                      cursor: "pointer",
                      fontSize: isMobile ? "10px" : "12px",
                      color: "#A8A29E",
                      transition: "border-color 0.2s ease, color 0.2s ease"
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0d9488'; e.currentTarget.style.color = '#0d9488'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#D6CFC2'; e.currentTarget.style.color = '#A8A29E'; }}
                    onClick={() => document.querySelector('input[type="file"]').click()}>
                      <HiOutlineUpload size={isMobile ? 20 : 26} />
                      <span style={{ marginTop: "4px", fontWeight: 600 }}>Add more</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? "12px" : "16px",
              justifyContent: "center",
              paddingTop: isMobile ? "18px" : "26px",
              borderTop: "1.5px solid #EFEBE3"
            }}>
              <button
                type="button"
                onClick={() => navigate('/my-properties')}
                className="ap-btn-ghost"
                style={{
                  padding: isMobile ? "12px 24px" : "14px 40px",
                  background: "white",
                  border: "1.5px solid #E7E2D9",
                  borderRadius: "12px",
                  color: "#57534E",
                  fontWeight: "600",
                  fontSize: isMobile ? "14px" : "15.5px",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  flex: isMobile ? "1" : "none"
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="ap-btn-primary"
                style={{
                  padding: isMobile ? "12px 24px" : "14px 48px",
                  background: loading ? "#A8A29E" : "linear-gradient(135deg, #0d9488, #0f766e)",
                  border: "none",
                  borderRadius: "12px",
                  color: "white",
                  fontWeight: "700",
                  fontSize: isMobile ? "14px" : "15.5px",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                  flex: isMobile ? "1" : "none",
                  boxShadow: loading ? "none" : "0 6px 24px rgba(13,148,136,0.32)",
                  opacity: loading ? 0.7 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
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
                    Creating listing…
                  </>
                ) : (
                  <>
                    <HiOutlineCheckCircle size={20} />
                    Publish property
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(3deg); }
          }
          @keyframes fadeSlideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-8px); }
            75% { transform: translateX(8px); }
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </SellerLayout>
  );
};

export default AddProperty;