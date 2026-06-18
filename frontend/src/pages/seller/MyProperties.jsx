import React, { useEffect, useState } from 'react';
import { myPropertiesStyles as s } from '../../assets/dummyStyles';
import SellerLayout from '../../components/common/SellerLayout';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import API_URL from '../../config';
import { Link, useNavigate } from 'react-router-dom';
import { 
  HiOutlinePlus, 
  HiOutlineTrash, 
  HiOutlinePencil, 
  HiOutlineEye, 
  HiOutlineLocationMarker, 
  HiOutlineCurrencyDollar,
  HiOutlineDownload,
  HiOutlineSearch,
  HiOutlineChevronDown
} from 'react-icons/hi';
import { FaBed, FaBath, FaRulerCombined } from 'react-icons/fa';

const MyProperties = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchMyProperties = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/property/my`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setProperties(res.data.properties);
        }
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchMyProperties();
    }
  }, [token]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axios.patch(
        `${API_URL}/api/property/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setProperties(properties.map(p => p._id === id ? { ...p, status: newStatus } : p));
      }
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property? This action cannot be undone.")) return;
    try {
      const res = await axios.delete(`${API_URL}/api/property/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setProperties(properties.filter(p => p._id !== id));
        alert("Property deleted successfully");
      }
    } catch (error) {
      alert("Failed to delete property");
    }
  };

  const handleExportCSV = () => {
    if (properties.length === 0) return alert("No properties to export");
    const headers = ["ID", "Title", "Type", "Price", "City", "Area", "BHK", "Bathrooms", "Area Size (sqft)", "Furnishing", "Status", "Views", "Created At"];
    const rows = properties.map(p => [
      p._id,
      `"${p.title.replace(/"/g, '""')}"`,
      p.propertyType,
      p.price,
      p.city,
      p.area,
      p.bhk || '',
      p.bathrooms || '',
      p.areaSize || '',
      p.furnishing || '',
      p.status,
      p.views || 0,
      p.createdAt
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_listings.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.area.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <SellerLayout>
        <div className={s.loaderFullPage}>
          <div className={s.loader} />
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className={s.fadeIn}>
        {/* Header */}
        <div className={s.header}>
          <div>
            <h1 className={s.heading}>My Listings</h1>
            <p className={s.subheading}>Manage and track all your submitted property listings</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', width: window.innerWidth < 768 ? '100%' : 'auto' }}>
            <button 
              onClick={handleExportCSV} 
              className={s.addButton} 
              style={{ background: 'white', color: '#1e293b', border: '1px solid #e2e8f0' }}
            >
              <HiOutlineDownload size={18} />
              Export
            </button>
            <Link to="/add-property" className={s.addButton}>
              <HiOutlinePlus size={18} />
              Add Property
            </Link>
          </div>
        </div>

        {/* Filter bar */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '16px 20px',
          marginBottom: '28px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'sale', 'sold'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: '8px 16px',
                  background: statusFilter === status ? '#0d9488' : '#f8fafc',
                  color: statusFilter === status ? 'white' : '#64748b',
                  border: statusFilter === status ? 'none' : '1px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.2s'
                }}
              >
                {status === 'all' ? 'All Listings' : status === 'sale' ? 'Live for Sale' : 'Sold'}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: window.innerWidth < 640 ? '100%' : '260px' }}>
            <HiOutlineSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by title, city, area..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px 10px 40px',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Listings Content */}
        {filteredProperties.length === 0 ? (
          <div className={s.emptyCard}>
            <div className={s.emptyIconWrapper}>
              <HiOutlineEye size={40} style={{ color: '#94a3b8' }} />
            </div>
            <h3 className={s.emptyTitle}>No listings found</h3>
            <p className={s.emptyText}>
              {properties.length === 0 
                ? "You haven't added any properties yet. Start selling now!" 
                : "No listings match your current filters."}
            </p>
            {properties.length === 0 && (
              <Link to="/add-property" className={s.emptyButton}>
                Add Your First Property
              </Link>
            )}
          </div>
        ) : (
          <div className={s.grid}>
            {filteredProperties.map(property => {
              const firstImage = property.images?.[0] || null;
              return (
                <div 
                  key={property._id}
                  className="card-premium"
                  style={{
                    background: 'white',
                    borderRadius: '20px',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s'
                  }}
                >
                  {/* Image container */}
                  <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                    {firstImage ? (
                      <img 
                        src={firstImage} 
                        alt={property.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#cbd5e1', fontSize: '14px' }}>No Image</span>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      padding: '4px 10px',
                      background: property.status === 'sale' ? '#e6f4ea' : '#fce8e6',
                      color: property.status === 'sale' ? '#137333' : '#c5221f',
                      borderRadius: '30px',
                      fontSize: '11px',
                      fontWeight: '700',
                      textTransform: 'uppercase'
                    }}>
                      {property.status === 'sale' ? 'Live' : 'Sold'}
                    </div>

                    {/* Price */}
                    <div style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      background: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '700'
                    }}>
                      ₹{property.price?.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '11px', color: '#0d9488', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
                      {property.propertyType}
                    </span>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {property.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '12px', marginBottom: '16px' }}>
                      <HiOutlineLocationMarker size={14} />
                      <span>{property.area}, {property.city}</span>
                    </div>

                    {/* Specs Grid */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '10px 0',
                      borderTop: '1px solid #f1f5f9',
                      borderBottom: '1px solid #f1f5f9',
                      marginBottom: '16px',
                      fontSize: '12px',
                      color: '#64748b'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FaBed />
                        <span>{property.bhk || '0'} BHK</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FaBath />
                        <span>{property.bathrooms || '0'} Bath</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FaRulerCombined />
                        <span>{property.areaSize || '0'} sqft</span>
                      </div>
                    </div>

                    {/* Views */}
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '16px' }}>
                      Views: <strong style={{ color: '#64748b' }}>{property.views || 0}</strong>
                    </div>

                    {/* Action Panel */}
                    <div className={s.actionContainer}>
                      <div className={s.selectWrapper}>
                        <select
                          value={property.status}
                          onChange={(e) => handleStatusChange(property._id, e.target.value)}
                          className={`${s.select} ${property.status === 'sale' ? s.selectAvailable : s.selectSold}`}
                        >
                          <option value="sale">Sale / Live</option>
                          <option value="sold">Sold</option>
                        </select>
                        <HiOutlineChevronDown className={s.selectIcon} size={14} />
                      </div>

                      <button 
                        onClick={() => navigate(`/edit-property/${property._id}`)} 
                        className={s.editButton}
                        title="Edit Listing"
                      >
                        <HiOutlinePencil size={15} />
                      </button>

                      <button 
                        onClick={() => handleDelete(property._id)} 
                        className={s.deleteButton}
                        title="Delete Listing"
                      >
                        <HiOutlineTrash size={15} />
                      </button>

                      <Link 
                        to={`/property/${property._id}`} 
                        target="_blank" 
                        className="btn btn-primary"
                        style={{ padding: '8px', borderRadius: '8px' }}
                      >
                        <HiOutlineEye size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </SellerLayout>
  );
};

export default MyProperties;
