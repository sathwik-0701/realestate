import React, { useEffect, useState } from 'react';
import { editPropertyStyles as s } from '../../assets/dummyStyles';
import SellerLayout from '../../components/common/SellerLayout';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import API_URL from '../../config';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  HiOutlineUpload, 
  HiX, 
  HiOutlineExclamationCircle 
} from 'react-icons/hi';
import { FaBuilding } from 'react-icons/fa';

const EditProperty = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    city: '',
    area: '',
    pincode: '',
    propertyType: 'apartment',
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
  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const amenitiesList = [
    { key: 'parking', label: 'Parking Space' },
    { key: 'gym', label: 'Gymnasium' },
    { key: 'wifi', label: 'Wi-Fi / Internet' },
    { key: 'lift', label: 'Elevator / Lift' },
    { key: 'security', label: '24/7 Security' },
    { key: 'powerBackup', label: 'Power Backup' },
    { key: 'swimmingPool', label: 'Swimming Pool' },
    { key: 'garden', label: 'Garden / Lawn' }
  ];

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/property/${id}`);
        if (res.data.success) {
          const prop = res.data.property;
          setFormData({
            title: prop.title || '',
            description: prop.description || '',
            price: prop.price || '',
            city: prop.city || '',
            area: prop.area || '',
            pincode: prop.pincode || '',
            propertyType: prop.propertyType || 'apartment',
            bhk: prop.bhk || '2',
            bathrooms: prop.bathrooms || '2',
            areaSize: prop.areaSize || '',
            furnishing: prop.furnishing || 'semi-furnished',
            floors: prop.amenities?.find(a => a.startsWith('Floors: '))?.split(': ')[1] || '',
            status: prop.status || 'sale'
          });

          // Match amenities
          const amenitiesMap = {};
          amenitiesList.forEach(item => {
            amenitiesMap[item.key] = prop.amenities?.includes(item.label) || false;
          });
          setSelectedAmenities(amenitiesMap);
          setExistingImages(prop.images || []);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load property details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPropertyDetails();
    }
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAmenityChange = (key) => {
    setSelectedAmenities(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Limit to 10 images total
    if (existingImages.length + newImageFiles.length + files.length > 10) {
      alert("You can upload a maximum of 10 images total");
      return;
    }

    const newFiles = [...newImageFiles, ...files];
    setNewImageFiles(newFiles);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setNewImagePreviews([...newImagePreviews, ...newPreviews]);
  };

  const removeExistingImage = (index) => {
    const images = [...existingImages];
    images.splice(index, 1);
    setExistingImages(images);
  };

  const removeNewImage = (index) => {
    const files = [...newImageFiles];
    files.splice(index, 1);
    setNewImageFiles(files);

    const previews = [...newImagePreviews];
    URL.revokeObjectURL(previews[index]);
    previews.splice(index, 1);
    setNewImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (existingImages.length === 0 && newImageFiles.length === 0) {
      setError("Please retain or upload at least one image of the property");
      setSaving(false);
      return;
    }

    try {
      const data = new FormData();
      // Basic fields
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('city', formData.city);
      data.append('area', formData.area);
      data.append('pincode', formData.pincode);
      data.append('propertyType', formData.propertyType);
      data.append('bhk', formData.bhk);
      data.append('bathrooms', formData.bathrooms);
      data.append('areaSize', formData.areaSize);
      data.append('furnishing', formData.furnishing);
      data.append('status', formData.status);

      // Build amenities array
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

      // Append list of remaining existing image URLs
      data.append('existingImages', JSON.stringify(existingImages));

      // Append new files
      newImageFiles.forEach(file => {
        data.append('images', file);
      });

      const res = await axios.put(`${API_URL}/api/property/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        alert("Property updated successfully!");
        navigate('/my-properties');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update listing. Please verify input fields.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SellerLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(13,148,136,0.2)', borderTop: '3px solid #0d9488', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className={s.pageContainer}>
        <div className={s.innerContainer}>
          <header className={s.headerWrapper}>
            <div style={{ display: 'inline-flex', background: '#e0f2f1', color: '#0d9488', padding: '8px 16px', borderRadius: '50px', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '12px', fontWeight: '700' }}>
              <FaBuilding />
              EDIT LISTING
            </div>
            <h1 className={s.pageTitle}>Edit Property Details</h1>
            <p className={s.pageSubtitle}>Update information or manage listing photos for your property</p>
          </header>

          <form onSubmit={handleSubmit} className={s.formContainer}>
            {error && (
              <div style={{ padding: '16px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                <HiOutlineExclamationCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {/* Section 1: Basic Information */}
            <div className={s.section}>
              <div className={s.sectionHeader}>
                <div className={s.sectionIndicator} />
                <h3 className={s.sectionTitle}>Basic Information</h3>
              </div>
              <div className={s.sectionContent}>
                <div>
                  <label className={s.label}>Property Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. 2 BHK Luxury Flat in Prime Location"
                    className={s.input}
                  />
                </div>
                <div>
                  <label className={s.label}>Detailed Description</label>
                  <textarea
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe key features, society atmosphere, proximity to schools/metros, water facility, etc."
                    className={s.textarea}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Pricing and Specifications */}
            <div className={s.section}>
              <div className={s.sectionHeader}>
                <div className={s.sectionIndicator} />
                <h3 className={s.sectionTitle}>Pricing & Specifications</h3>
              </div>
              
              <div className={s.twoColumnGrid}>
                <div>
                  <label className={s.label}>Price (INR)</label>
                  <input
                    type="number"
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Price in ₹"
                    className={s.input}
                  />
                </div>
                <div>
                  <label className={s.label}>Property Type</label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className={s.select}
                  >
                    <option value="flat">Flat</option>
                    <option value="apartment">Apartment</option>
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

              <div className={s.threeColumnGrid} style={{ marginBottom: '24px' }}>
                <div>
                  <label className={s.label}>BHK Configuration</label>
                  <select
                    name="bhk"
                    value={formData.bhk}
                    onChange={handleInputChange}
                    className={s.select}
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
                  <label className={s.label}>Bathrooms</label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    placeholder="No. of bathrooms"
                    className={s.input}
                  />
                </div>
                <div>
                  <label className={s.label}>Floor Number / Total Floors</label>
                  <input
                    type="text"
                    name="floors"
                    value={formData.floors}
                    onChange={handleInputChange}
                    placeholder="e.g. 3rd of 5 floors"
                    className={s.input}
                  />
                </div>
              </div>

              <div className={s.twoColumnGridInner}>
                <div>
                  <label className={s.label}>Area Size (sq ft)</label>
                  <input
                    type="number"
                    name="areaSize"
                    required
                    value={formData.areaSize}
                    onChange={handleInputChange}
                    placeholder="Area in square feet"
                    className={s.input}
                  />
                </div>
                <div>
                  <label className={s.label}>Furnishing Status</label>
                  <select
                    name="furnishing"
                    value={formData.furnishing}
                    onChange={handleInputChange}
                    className={s.select}
                  >
                    <option value="furnished">Furnished</option>
                    <option value="semi-furnished">Semi-Furnished</option>
                    <option value="unfurnished">Unfurnished</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Location Details */}
            <div className={s.section}>
              <div className={s.sectionHeader}>
                <div className={s.sectionIndicator} />
                <h3 className={s.sectionTitle}>Location Details</h3>
              </div>
              <div className={s.threeColumnGrid}>
                <div>
                  <label className={s.label}>City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Noida"
                    className={s.input}
                  />
                </div>
                <div>
                  <label className={s.label}>Area / Locality</label>
                  <input
                    type="text"
                    name="area"
                    required
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="e.g. Sector 62"
                    className={s.input}
                  />
                </div>
                <div>
                  <label className={s.label}>Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="6-digit pincode"
                    className={s.input}
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Amenities */}
            <div className={s.section}>
              <div className={s.sectionHeader}>
                <div className={s.sectionIndicator} />
                <h3 className={s.sectionTitle}>Amenities Available</h3>
              </div>
              <div className={s.amenitiesGrid}>
                {amenitiesList.map(item => {
                  const isActive = selectedAmenities[item.key];
                  return (
                    <label
                      key={item.key}
                      className={isActive ? 'bg-teal-50 border-teal-500' : 'bg-slate-50 border-slate-200'}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        padding: '12px',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        background: isActive ? '#e0f2f1' : '#f8fafc',
                        transition: 'all 0.2s'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() => handleAmenityChange(item.key)}
                        className={s.amenityCheckbox}
                        style={{ accentColor: '#0d9488' }}
                      />
                      <span style={{ fontSize: '13px', fontWeight: '600', color: isActive ? '#0d9488' : '#475569' }}>
                        {item.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Section 5: Property Images */}
            <div className={s.section}>
              <div className={s.sectionHeader}>
                <div className={s.sectionIndicator} />
                <h3 className={s.sectionTitle}>Property Images</h3>
              </div>
              
              {/* Existing Images */}
              <div style={{ marginBottom: '24px' }}>
                <label className={s.label} style={{ marginBottom: '12px' }}>Current Listing Photos</label>
                <div className={s.imageGrid}>
                  {existingImages.map((url, index) => (
                    <div key={index} className={s.imageCard}>
                      <img src={url} alt="existing" className={s.imageCardImg} />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className={s.removeImageBtn}
                        style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <HiX size={12} />
                      </button>
                      <span className={s.imageBadgeExisting}>Existing</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upload New Images */}
              <div>
                <label className={s.label}>Add More Photos</label>
                <div className={s.uploadCard} style={{ marginBottom: '16px' }}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className={s.uploadInput}
                  />
                  <HiOutlineUpload size={24} style={{ color: '#0d9488' }} />
                  <span className={s.uploadText}>Select files to add</span>
                </div>

                {newImagePreviews.length > 0 && (
                  <div className={s.imageGrid}>
                    {newImagePreviews.map((preview, index) => (
                      <div key={index} className={s.imageCardNew}>
                        <img src={preview} alt="new-preview" className={s.imageCardImg} />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className={s.removeImageBtn}
                          style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                          <HiX size={12} />
                        </button>
                        <span className={s.imageBadgeNew}>New</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className={s.formActions}>
              <button
                type="button"
                onClick={() => navigate('/my-properties')}
                className={s.cancelButton}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className={s.submitButton}
              >
                {saving ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </SellerLayout>
  );
};

export default EditProperty;
