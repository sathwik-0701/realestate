import React, { useEffect, useState } from 'react';
import { myInquiriesStyles as s } from '../../assets/dummyStyles';
import SellerLayout from '../../components/common/SellerLayout';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import API_URL from '../../config';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineMail, 
  HiOutlinePhone, 
  HiOutlineCalendar, 
  HiOutlineCheckCircle, 
  HiOutlineChat,
  HiOutlineOfficeBuilding
} from 'react-icons/hi';

const MyInquiries = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/inquiry/seller`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setInquiries(res.data.inquires); // note backend uses spelling "inquires"
      }
    } catch (error) {
      console.error("Failed to load inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchInquiries();
    }
  }, [token]);

  const handleMarkAsRead = async (id) => {
    try {
      const res = await axios.patch(
        `${API_URL}/api/inquiry/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setInquiries(inquiries.map(inq => inq._id === id ? { ...inq, isRead: true } : inq));
      }
    } catch (error) {
      alert("Failed to mark inquiry as read");
    }
  };

  const handleChatStart = async (inquiry) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/chat/start`,
        { 
          propertyId: inquiry.property?._id, 
          buyerId: inquiry.buyer?._id 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const chat = res.data;
      navigate("/chat-messages", { state: { chat } });
    } catch (error) {
      console.error("Error starting chat:", error);
      alert("Failed to start chat session with buyer");
    }
  };

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
      <div className={s.containerFadeIn} style={{ padding: '0' }}>
        <header className={s.mb12}>
          <h1 className={s.heading}>Buyer Leads</h1>
          <p className={s.textMuted}>Manage property inquiries and contact information from interested buyers</p>
        </header>

        {inquiries.length === 0 ? (
          <div className={s.cardPremiumPy24Px8TextCenter}>
            <div className={s.iconContainer}>
              <HiOutlineOfficeBuilding size={32} />
            </div>
            <h3 className={s.mb4}>No leads received yet</h3>
            <p className={s.textMutedMb8}>When buyers express interest in your property listings, their requests will appear here.</p>
          </div>
        ) : (
          <div className={s.flexColGap6}>
            {inquiries.map(inquiry => (
              <div key={inquiry._id} className={s.inquiryCard} style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                <div className={s.inquiryMain}>
                  <div className={s.iconWrapper}>
                    <HiOutlineMail className={s.iconSize} />
                  </div>
                  
                  <div className={s.flex1}>
                    {/* Header Row */}
                    <div className={s.titleRow}>
                      <h4 className={s.titleText}>
                        Inquiry on: {inquiry.property?.title || 'Property Listing'}
                      </h4>
                      <span className={`${s.badge} ${inquiry.isRead ? s.badgeRead : s.badgeNew}`}>
                        {inquiry.isRead ? 'Read' : 'New'}
                      </span>
                    </div>

                    {/* Price & Location */}
                    <p style={{ fontSize: '13px', fontWeight: '700', color: '#0d9488', marginBottom: '16px' }}>
                      Price: ₹{inquiry.property?.price?.toLocaleString('en-IN') || 'N/A'} | City: {inquiry.property?.city || 'N/A'}
                    </p>

                    {/* Buyer Details */}
                    <div className={s.buyerInfo}>
                      <div className={s.infoItem}>
                        <span className={s.textMutedSmall}>Buyer:</span>
                        <span className={s.fontSemibold}>{inquiry.buyer?.name || 'Unknown'}</span>
                      </div>
                      <div className={s.infoItem}>
                        <HiOutlineMail size={14} className={s.textMutedSmall} />
                        <span className={s.fontSemibold}>{inquiry.buyer?.email || 'N/A'}</span>
                      </div>
                      <div className={s.infoItem}>
                        <HiOutlinePhone size={14} className={s.textMutedSmall} />
                        <span className={s.fontSemibold}>{inquiry.buyer?.phone || 'Not provided'}</span>
                      </div>
                    </div>

                    {/* Message */}
                    <p className={s.message}>
                      "{inquiry.message}"
                    </p>

                    {/* Date */}
                    <div className={s.meta}>
                      <div className={s.flexItemsCenterGap2}>
                        <HiOutlineCalendar size={14} />
                        <span>Received on: {new Date(inquiry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Panel */}
                <div className={s.actions}>
                  {!inquiry.isRead && (
                    <button 
                      onClick={() => handleMarkAsRead(inquiry._id)}
                      className={s.btnOutline}
                    >
                      <HiOutlineCheckCircle size={16} />
                      Mark Read
                    </button>
                  )}
                  <button 
                    onClick={() => handleChatStart(inquiry)}
                    className={s.btnMessage}
                    style={{ background: '#0d9488', borderRadius: '12px' }}
                  >
                    <HiOutlineChat size={16} />
                    Chat with Buyer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SellerLayout>
  );
};

export default MyInquiries;
