import React, { useEffect, useState, useRef } from 'react';
import SellerLayout from '../../components/common/SellerLayout';
import Navbar from '../../components/common/Navbar';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import API_URL from '../../config';
import { useLocation } from 'react-router-dom';
import { 
  HiOutlinePaperAirplane, 
  HiOutlineTrash, 
  HiChevronLeft,
  HiOutlineChatAlt2,
  HiOutlineSearch,
  HiOutlineMenu
} from 'react-icons/hi';
import { io } from 'socket.io-client';

// SellerLayout currently reserves only 170px of marginLeft for its content,
// but SellerSidebar is actually 280px wide (position: fixed). That leaves a
// 110px gap where the fixed sidebar overlaps this page's content.
// This local constant patches that gap WITHOUT touching the shared layout,
// so other pages using SellerLayout are unaffected.
const SIDEBAR_OVERLAP_FIX = 110;

const ChatMessages = () => {
  const { user, token } = useAuth();
  const location = useLocation();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const isMobile = window.innerWidth < 768;
  const extraLeftOffset = isMobile ? 0 : SIDEBAR_OVERLAP_FIX;

  // Fetch all user chats
  const fetchChats = async (selectChatId = null) => {
    try {
      const res = await axios.get(`${API_URL}/api/chat/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChats(res.data);
      
      if (selectChatId) {
        const found = res.data.find(c => c._id === selectChatId);
        if (found) {
          setActiveChat(found);
          if (isMobile) setShowSidebar(false);
        }
      } else if (location.state?.chat) {
        const found = res.data.find(c => c._id === location.state.chat._id);
        if (found) {
          setActiveChat(found);
          if (isMobile) setShowSidebar(false);
        }
      }
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchChats();
    }
  }, [token]);

  // Set up socket.io client
  useEffect(() => {
    socketRef.current = io(API_URL);

    socketRef.current.on('receiveMessage', (data) => {
      if (activeChat && data.chatId === activeChat._id) {
        setMessages(prev => {
          if (prev.some(m => m._id === data._id)) return prev;
          return [...prev, data];
        });
        setChats(prevChats => prevChats.map(c => 
          c._id === data.chatId 
            ? { ...c, message: [...c.message, data], updatedAt: new Date().toISOString() }
            : c
        ));
      } else {
        fetchChats();
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [activeChat]);

  // Fetch messages when active chat changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChat) return;
      setMessagesLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/chat/${activeChat._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data.message || []);
        
        if (socketRef.current) {
          socketRef.current.emit('joinChat', activeChat._id);
        }
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setMessagesLoading(false);
      }
    };

    fetchMessages();
  }, [activeChat]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;

    const textToSend = inputText;
    setInputText('');

    try {
      const res = await axios.post(
        `${API_URL}/api/chat/send`,
        { chatId: activeChat._id, text: textToSend },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.chat) {
        const newMsg = res.data.newMessage;
        
        setMessages(prev => [...prev, newMsg]);

        if (socketRef.current) {
          socketRef.current.emit('sendMessage', {
            ...newMsg,
            chatId: activeChat._id
          });
        }

        setChats(prevChats => prevChats.map(c => 
          c._id === activeChat._id 
            ? { ...c, message: [...c.message, newMsg], updatedAt: new Date().toISOString() }
            : c
        ));
      }
    } catch (error) {
      alert("Failed to send message");
    }
  };

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this conversation?")) return;
    try {
      const res = await axios.delete(`${API_URL}/api/chat/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.message) {
        setChats(chats.filter(c => c._id !== chatId));
        if (activeChat?._id === chatId) {
          setActiveChat(null);
          setMessages([]);
        }
        alert("Conversation deleted");
      }
    } catch (error) {
      alert("Failed to delete conversation");
    }
  };

  const getPartnerInfo = (chat) => {
    if (!chat || !user) return { name: 'Chat Partner', avatar: 'C', email: '' };
    const partner = chat.buyer?._id === user._id ? chat.seller : chat.buyer;
    return {
      name: partner?.name || 'User',
      avatar: partner?.name?.charAt(0).toUpperCase() || 'U',
      email: partner?.email || '',
      profilePic: partner?.profilePic || null
    };
  };

  const isSeller = user?.role === 'seller';

  const filteredChats = chats.filter(chat => {
    const partner = getPartnerInfo(chat);
    return partner.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Loading state
  if (loading) {
    if (isSeller) {
      return (
        <SellerLayout>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid rgba(13,148,136,0.2)', borderTop: '3px solid #0d9488', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        </SellerLayout>
      );
    } else {
      return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: '80px' }}>
          <Navbar />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid rgba(13,148,136,0.2)', borderTop: '3px solid #0d9488', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        </div>
      );
    }
  }

  // ============================================
  // SELLER VIEW - COMPLETE FIXED VERSION
  // ============================================
  if (isSeller) {
    return (
      <SellerLayout>
        <div style={{ 
          padding: '20px 24px 0',
          paddingLeft: 24 + extraLeftOffset,
          background: '#f8fafc',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#0f172a',
            marginBottom: '4px'
          }}>Messages</h1>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            Your conversation with buyers
          </p>
        </div>
        
        <div style={{
          display: 'flex',
          flex: 1,
          height: 'calc(100vh - 180px)',
          background: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          margin: `12px 24px 24px ${24 + extraLeftOffset}px`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          position: 'relative'
        }}>
          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
            @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
            .message-enter { animation: fadeIn 0.3s ease-out forwards; }
            .pulse-dot { animation: pulse 2s ease-in-out infinite; }
            
            /* FIX: Sidebar should be relative on desktop */
            @media (min-width: 769px) {
              .sidebar-fixed {
                position: relative !important;
                width: 340px !important;
                min-width: 340px !important;
                flex-shrink: 0 !important;
              }
            }
            
            @media (max-width: 768px) {
              .sidebar-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.5);
                z-index: 999;
                animation: fadeIn 0.3s ease-out;
              }
              .sidebar-panel {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                bottom: 0 !important;
                width: 85% !important;
                max-width: 320px !important;
                z-index: 1000 !important;
                border-radius: 0 !important;
                box-shadow: 0 20px 60px rgba(0,0,0,0.2) !important;
              }
            }
          `}</style>

          <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative', width: '100%' }}>
            {/* SIDEBAR */}
            <div 
              className={isMobile ? 'sidebar-panel' : 'sidebar-fixed'}
              style={{
                display: isMobile ? (showSidebar ? 'flex' : 'none') : 'flex',
                flexDirection: 'column',
                borderRight: isMobile ? 'none' : '1px solid #e2e8f0',
                background: '#fafbfc',
                height: '100%',
                overflow: 'hidden',
                position: isMobile ? 'fixed' : 'relative',
                top: isMobile ? 0 : 'auto',
                left: isMobile ? 0 : 'auto',
                bottom: isMobile ? 0 : 'auto',
                zIndex: isMobile ? 1000 : 1,
                animation: isMobile && showSidebar ? 'slideIn 0.3s ease-out forwards' : 'none',
                borderRadius: isMobile ? '0' : '0'
              }}
            >
              {/* Sidebar Header */}
              <div style={{
                padding: isMobile ? '16px' : '20px',
                borderBottom: '1px solid #e2e8f0',
                background: 'white'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h2 style={{ 
                    fontSize: isMobile ? '16px' : '18px', 
                    fontWeight: '700', 
                    color: '#0f172a', 
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <HiOutlineChatAlt2 size={isMobile ? 18 : 20} style={{ color: '#0d9488' }} />
                    Conversations
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: '500', 
                      color: '#94a3b8',
                      background: '#f1f5f9',
                      padding: '1px 8px',
                      borderRadius: '12px'
                    }}>
                      {chats.length}
                    </span>
                  </h2>
                  {isMobile && (
                    <button
                      onClick={() => setShowSidebar(false)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        color: '#64748b'
                      }}
                    >
                      <HiChevronLeft size={20} />
                    </button>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <HiOutlineSearch size={isMobile ? 14 : 16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: isMobile ? '6px 10px 6px 32px' : '8px 12px 8px 36px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: isMobile ? '12px' : '13px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      background: 'white',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#0d9488'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
              </div>

              {/* Chat List */}
              <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '6px' : '8px' }}>
                {filteredChats.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: isMobile ? '40px 16px' : '60px 20px', color: '#94a3b8' }}>
                    <HiOutlineChatAlt2 size={isMobile ? 36 : 48} style={{ marginBottom: '12px', opacity: 0.3 }} />
                    <p style={{ fontSize: isMobile ? '13px' : '15px', fontWeight: '500', color: '#475569' }}>No conversations yet</p>
                    <p style={{ fontSize: isMobile ? '11px' : '13px' }}>Start a chat from a property listing</p>
                  </div>
                ) : (
                  filteredChats.map((chat) => {
                    const partner = getPartnerInfo(chat);
                    const isActive = activeChat?._id === chat._id;
                    const lastMessage = chat.message?.[chat.message.length - 1];
                    return (
                      <div
                        key={chat._id}
                        onClick={() => {
                          setActiveChat(chat);
                          if (isMobile) setShowSidebar(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: isMobile ? '10px' : '12px',
                          padding: isMobile ? '10px 12px' : '12px 14px',
                          borderRadius: isMobile ? '10px' : '12px',
                          cursor: 'pointer',
                          background: isActive ? '#eff6ff' : 'transparent',
                          border: isActive ? '2px solid #bfdbfe' : '2px solid transparent',
                          transition: 'all 0.2s ease',
                          marginBottom: isMobile ? '4px' : '6px'
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = '#f8fafc';
                            e.currentTarget.style.borderColor = '#e2e8f0';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.borderColor = 'transparent';
                          }
                        }}
                      >
                        <div style={{
                          width: isMobile ? '40px' : '44px',
                          height: isMobile ? '40px' : '44px',
                          borderRadius: '50%',
                          background: isActive ? '#0d9488' : '#e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isActive ? 'white' : '#94a3b8',
                          fontSize: isMobile ? '14px' : '16px',
                          fontWeight: '600',
                          flexShrink: 0
                        }}>
                          {partner.profilePic ? (
                            <img src={partner.profilePic} alt={partner.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                          ) : partner.avatar}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: '600', color: '#0f172a', fontSize: isMobile ? '13px' : '14px' }}>
                            {partner.name}
                          </div>
                          <div style={{ fontSize: isMobile ? '10px' : '12px', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {lastMessage ? lastMessage.text : 'Start chatting'}
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleDeleteChat(chat._id, e)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '6px',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#dc2626'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
                        >
                          <HiOutlineTrash size={isMobile ? 14 : 16} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* CHAT AREA */}
            {activeChat ? (
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                background: 'white',
                height: '100%',
                overflow: 'hidden',
                minWidth: 0
              }}>
                {/* Chat Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? '10px' : '12px',
                  padding: isMobile ? '10px 14px' : '14px 20px',
                  borderBottom: '1px solid #e2e8f0',
                  background: 'white'
                }}>
                  {isMobile && (
                    <button
                      onClick={() => setShowSidebar(true)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <HiOutlineMenu size={20} />
                    </button>
                  )}
                  
                  <div style={{
                    width: isMobile ? '36px' : '40px',
                    height: isMobile ? '36px' : '40px',
                    borderRadius: '50%',
                    background: '#0d9488',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: isMobile ? '14px' : '15px',
                    fontWeight: '600',
                    flexShrink: 0
                  }}>
                    {getPartnerInfo(activeChat).profilePic ? (
                      <img src={getPartnerInfo(activeChat).profilePic} alt="partner" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : getPartnerInfo(activeChat).avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '600', color: '#0f172a', fontSize: isMobile ? '13px' : '14px' }}>
                      {getPartnerInfo(activeChat).name}
                    </div>
                    <div style={{ fontSize: isMobile ? '10px' : '11px', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {activeChat.property?.title || 'General Inquiry'}
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '4px',
                    padding: '3px 10px',
                    background: '#f1f5f9',
                    borderRadius: '12px',
                    fontSize: '10px',
                    color: '#64748b',
                    alignItems: 'center'
                  }}>
                    <span className="pulse-dot" style={{
                      display: 'inline-block',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#10b981',
                      marginRight: '4px'
                    }} />
                    {!isMobile && 'Online'}
                  </div>
                </div>

                {/* Messages */}
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: isMobile ? '12px 14px' : '16px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: isMobile ? '8px' : '10px',
                  background: '#f8fafc'
                }}>
                  {messagesLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <div style={{ width: '28px', height: '28px', border: '3px solid rgba(13,148,136,0.2)', borderTop: '3px solid #0d9488', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    </div>
                  ) : messages.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
                      <HiOutlineChatAlt2 size={isMobile ? 32 : 40} style={{ marginBottom: '12px', opacity: 0.3 }} />
                      <p style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: '500', color: '#475569' }}>No messages yet</p>
                      <p style={{ fontSize: isMobile ? '11px' : '12px' }}>Send a message to start the conversation</p>
                    </div>
                  ) : (
                    messages.map((msg, index) => {
                      const isOwn = msg.sender === user?._id || msg.sender?._id === user?._id;
                      return (
                        <div
                          key={msg._id || index}
                          className="message-enter"
                          style={{
                            maxWidth: isMobile ? '80%' : '70%',
                            padding: isMobile ? '8px 14px' : '10px 16px',
                            borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                            alignSelf: isOwn ? 'flex-end' : 'flex-start',
                            background: isOwn ? '#0d9488' : 'white',
                            color: isOwn ? 'white' : '#0f172a',
                            boxShadow: isOwn ? '0 2px 10px rgba(13,148,136,0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
                            border: isOwn ? 'none' : '1px solid #e2e8f0'
                          }}
                        >
                          <p style={{ fontSize: isMobile ? '13px' : '14px', margin: 0, wordWrap: 'break-word', lineHeight: '1.5' }}>{msg.text}</p>
                          <span style={{
                            fontSize: '9px',
                            color: isOwn ? 'rgba(255,255,255,0.7)' : '#94a3b8',
                            display: 'block',
                            marginTop: '4px',
                            textAlign: 'right'
                          }}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} style={{
                  display: 'flex',
                  gap: isMobile ? '8px' : '10px',
                  padding: isMobile ? '10px 14px' : '12px 20px',
                  borderTop: '1px solid #e2e8f0',
                  background: 'white'
                }}>
                  <input
                    type="text"
                    placeholder="Type your message here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    style={{
                      flex: 1,
                      padding: isMobile ? '10px 14px' : '10px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: isMobile ? '10px' : '12px',
                      fontSize: isMobile ? '13px' : '14px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      background: '#f8fafc'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0d9488';
                      e.target.style.background = 'white';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.background = '#f8fafc';
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    style={{
                      padding: isMobile ? '10px 14px' : '10px 18px',
                      background: inputText.trim() ? '#0d9488' : '#e2e8f0',
                      border: 'none',
                      borderRadius: isMobile ? '10px' : '12px',
                      color: 'white',
                      cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: inputText.trim() ? 1 : 0.5
                    }}
                    onMouseEnter={(e) => {
                      if (inputText.trim()) {
                        e.currentTarget.style.background = '#0f766e';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (inputText.trim()) {
                        e.currentTarget.style.background = '#0d9488';
                      }
                    }}
                  >
                    <HiOutlinePaperAirplane size={isMobile ? 16 : 18} />
                  </button>
                </form>
              </div>
            ) : (
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                padding: '20px',
                background: 'white',
                minWidth: 0
              }}>
                <div style={{
                  width: isMobile ? '60px' : '80px',
                  height: isMobile ? '60px' : '80px',
                  borderRadius: '50%',
                  background: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <HiOutlineChatAlt2 size={isMobile ? 28 : 40} style={{ color: '#cbd5e1' }} />
                </div>
                <h3 style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>
                  Select a Conversation
                </h3>
                <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: isMobile ? '12px' : '14px', maxWidth: '300px' }}>
                  Choose a buyer from the sidebar to view messages
                </p>
                {isMobile && (
                  <button
                    onClick={() => setShowSidebar(true)}
                    style={{
                      marginTop: '16px',
                      padding: '10px 24px',
                      background: '#0d9488',
                      border: 'none',
                      borderRadius: '10px',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'background 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#0f766e'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#0d9488'}
                  >
                    Open Conversations
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </SellerLayout>
    );
  }

  // ============================================
  // BUYER VIEW - COMPLETE VERSION (unchanged)
  // ============================================
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      paddingTop: isMobile ? '70px' : '80px',
      position: 'relative'
    }}>
      <Navbar />
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: isMobile ? 'calc(100vh - 140px)' : 'calc(100vh - 160px)',
        background: 'white',
        borderRadius: isMobile ? '0' : '16px',
        border: isMobile ? 'none' : '1px solid #e2e8f0',
        overflow: 'hidden',
        margin: isMobile ? '0' : '24px',
        boxShadow: isMobile ? 'none' : '0 4px 20px rgba(0,0,0,0.04)',
        position: 'relative'
      }}>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
          @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
          .message-enter { animation: fadeIn 0.3s ease-out forwards; }
          .pulse-dot { animation: pulse 2s ease-in-out infinite; }
          @media (max-width: 768px) {
            .sidebar-overlay {
              position: fixed;
              inset: 0;
              background: rgba(0,0,0,0.5);
              z-index: 999;
              animation: fadeIn 0.3s ease-out;
            }
            .sidebar-panel {
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              bottom: 0 !important;
              width: 85% !important;
              max-width: 320px !important;
              z-index: 1000 !important;
              border-radius: 0 !important;
              box-shadow: 0 20px 60px rgba(0,0,0,0.2) !important;
            }
          }
        `}</style>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative', width: '100%' }}>
          {/* SIDEBAR - Buyer */}
          <div 
            className={isMobile ? 'sidebar-panel' : ''}
            style={{
              width: isMobile ? '85%' : '340px',
              maxWidth: isMobile ? '320px' : 'none',
              minWidth: isMobile ? '0' : '340px',
              display: isMobile ? (showSidebar ? 'flex' : 'none') : 'flex',
              flexDirection: 'column',
              borderRight: isMobile ? 'none' : '1px solid #e2e8f0',
              background: '#fafbfc',
              height: '100%',
              overflow: 'hidden',
              position: isMobile ? 'fixed' : 'relative',
              top: isMobile ? 0 : 'auto',
              left: isMobile ? 0 : 'auto',
              bottom: isMobile ? 0 : 'auto',
              zIndex: isMobile ? 1000 : 1,
              animation: isMobile && showSidebar ? 'slideIn 0.3s ease-out forwards' : 'none',
              borderRadius: isMobile ? '0' : '0',
              flexShrink: 0
            }}
          >
            {/* Sidebar Header */}
            <div style={{
              padding: isMobile ? '16px' : '20px',
              borderBottom: '1px solid #e2e8f0',
              background: 'white'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h2 style={{ 
                  fontSize: isMobile ? '16px' : '18px', 
                  fontWeight: '700', 
                  color: '#0f172a', 
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <HiOutlineChatAlt2 size={isMobile ? 18 : 20} style={{ color: '#0d9488' }} />
                  Conversations
                  <span style={{ 
                    fontSize: '11px', 
                    fontWeight: '500', 
                    color: '#94a3b8',
                    background: '#f1f5f9',
                    padding: '1px 8px',
                    borderRadius: '12px'
                  }}>
                    {chats.length}
                  </span>
                </h2>
                {isMobile && (
                  <button
                    onClick={() => setShowSidebar(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      color: '#64748b'
                    }}
                  >
                    <HiChevronLeft size={20} />
                  </button>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <HiOutlineSearch size={isMobile ? 14 : 16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: isMobile ? '6px 10px 6px 32px' : '8px 12px 8px 36px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: isMobile ? '12px' : '13px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    background: 'white',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#0d9488'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            {/* Chat List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '6px' : '8px' }}>
              {filteredChats.length === 0 ? (
                <div style={{ textAlign: 'center', padding: isMobile ? '40px 16px' : '60px 20px', color: '#94a3b8' }}>
                  <HiOutlineChatAlt2 size={isMobile ? 36 : 48} style={{ marginBottom: '12px', opacity: 0.3 }} />
                  <p style={{ fontSize: isMobile ? '13px' : '15px', fontWeight: '500', color: '#475569' }}>No conversations yet</p>
                  <p style={{ fontSize: isMobile ? '11px' : '13px' }}>Start a chat from a property listing</p>
                </div>
              ) : (
                filteredChats.map((chat) => {
                  const partner = getPartnerInfo(chat);
                  const isActive = activeChat?._id === chat._id;
                  const lastMessage = chat.message?.[chat.message.length - 1];
                  return (
                    <div
                      key={chat._id}
                      onClick={() => {
                        setActiveChat(chat);
                        if (isMobile) setShowSidebar(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: isMobile ? '10px' : '12px',
                        padding: isMobile ? '10px 12px' : '12px 14px',
                        borderRadius: isMobile ? '10px' : '12px',
                        cursor: 'pointer',
                        background: isActive ? '#eff6ff' : 'transparent',
                        border: isActive ? '2px solid #bfdbfe' : '2px solid transparent',
                        transition: 'all 0.2s ease',
                        marginBottom: isMobile ? '4px' : '6px'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = '#f8fafc';
                          e.currentTarget.style.borderColor = '#e2e8f0';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.borderColor = 'transparent';
                        }
                      }}
                    >
                      <div style={{
                        width: isMobile ? '40px' : '44px',
                        height: isMobile ? '40px' : '44px',
                        borderRadius: '50%',
                        background: isActive ? '#0d9488' : '#e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isActive ? 'white' : '#94a3b8',
                        fontSize: isMobile ? '14px' : '16px',
                        fontWeight: '600',
                        flexShrink: 0
                      }}>
                        {partner.profilePic ? (
                          <img src={partner.profilePic} alt={partner.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : partner.avatar}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: '600', color: '#0f172a', fontSize: isMobile ? '13px' : '14px' }}>
                          {partner.name}
                        </div>
                        <div style={{ fontSize: isMobile ? '10px' : '12px', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {lastMessage ? lastMessage.text : 'Start chatting'}
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDeleteChat(chat._id, e)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          padding: '4px',
                          borderRadius: '6px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#dc2626'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
                      >
                        <HiOutlineTrash size={isMobile ? 14 : 16} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* CHAT AREA - Buyer */}
          {activeChat ? (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              background: 'white',
              height: '100%',
              overflow: 'hidden',
              minWidth: 0
            }}>
              {/* Chat Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: isMobile ? '10px' : '12px',
                padding: isMobile ? '10px 14px' : '14px 20px',
                borderBottom: '1px solid #e2e8f0',
                background: 'white'
              }}>
                {isMobile && (
                  <button
                    onClick={() => setShowSidebar(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <HiOutlineMenu size={20} />
                  </button>
                )}
                
                <div style={{
                  width: isMobile ? '36px' : '40px',
                  height: isMobile ? '36px' : '40px',
                  borderRadius: '50%',
                  background: '#0d9488',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: isMobile ? '14px' : '15px',
                  fontWeight: '600',
                  flexShrink: 0
                }}>
                  {getPartnerInfo(activeChat).profilePic ? (
                    <img src={getPartnerInfo(activeChat).profilePic} alt="partner" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : getPartnerInfo(activeChat).avatar}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '600', color: '#0f172a', fontSize: isMobile ? '13px' : '14px' }}>
                    {getPartnerInfo(activeChat).name}
                  </div>
                  <div style={{ fontSize: isMobile ? '10px' : '11px', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {activeChat.property?.title || 'General Inquiry'}
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '4px',
                  padding: '3px 10px',
                  background: '#f1f5f9',
                  borderRadius: '12px',
                  fontSize: '10px',
                  color: '#64748b',
                  alignItems: 'center'
                }}>
                  <span className="pulse-dot" style={{
                    display: 'inline-block',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#10b981',
                    marginRight: '4px'
                  }} />
                  {!isMobile && 'Online'}
                </div>
              </div>

              {/* Messages */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: isMobile ? '12px 14px' : '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: isMobile ? '8px' : '10px',
                background: '#f8fafc'
              }}>
                {messagesLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <div style={{ width: '28px', height: '28px', border: '3px solid rgba(13,148,136,0.2)', borderTop: '3px solid #0d9488', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  </div>
                ) : messages.length === 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
                    <HiOutlineChatAlt2 size={isMobile ? 32 : 40} style={{ marginBottom: '12px', opacity: 0.3 }} />
                    <p style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: '500', color: '#475569' }}>No messages yet</p>
                    <p style={{ fontSize: isMobile ? '11px' : '12px' }}>Send a message to start the conversation</p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isOwn = msg.sender === user?._id || msg.sender?._id === user?._id;
                    return (
                      <div
                        key={msg._id || index}
                        className="message-enter"
                        style={{
                          maxWidth: isMobile ? '80%' : '70%',
                          padding: isMobile ? '8px 14px' : '10px 16px',
                          borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                          alignSelf: isOwn ? 'flex-end' : 'flex-start',
                          background: isOwn ? '#0d9488' : 'white',
                          color: isOwn ? 'white' : '#0f172a',
                          boxShadow: isOwn ? '0 2px 10px rgba(13,148,136,0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
                          border: isOwn ? 'none' : '1px solid #e2e8f0'
                        }}
                      >
                        <p style={{ fontSize: isMobile ? '13px' : '14px', margin: 0, wordWrap: 'break-word', lineHeight: '1.5' }}>{msg.text}</p>
                        <span style={{
                          fontSize: '9px',
                          color: isOwn ? 'rgba(255,255,255,0.7)' : '#94a3b8',
                          display: 'block',
                          marginTop: '4px',
                          textAlign: 'right'
                        }}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} style={{
                display: 'flex',
                gap: isMobile ? '8px' : '10px',
                padding: isMobile ? '10px 14px' : '12px 20px',
                borderTop: '1px solid #e2e8f0',
                background: 'white'
              }}>
                <input
                  type="text"
                  placeholder="Type your message here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  style={{
                    flex: 1,
                    padding: isMobile ? '10px 14px' : '10px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: isMobile ? '10px' : '12px',
                    fontSize: isMobile ? '13px' : '14px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    background: '#f8fafc'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0d9488';
                    e.target.style.background = 'white';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.background = '#f8fafc';
                  }}
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  style={{
                    padding: isMobile ? '10px 14px' : '10px 18px',
                    background: inputText.trim() ? '#0d9488' : '#e2e8f0',
                    border: 'none',
                    borderRadius: isMobile ? '10px' : '12px',
                    color: 'white',
                    cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: inputText.trim() ? 1 : 0.5
                  }}
                  onMouseEnter={(e) => {
                    if (inputText.trim()) {
                      e.currentTarget.style.background = '#0f766e';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (inputText.trim()) {
                      e.currentTarget.style.background = '#0d9488';
                    }
                  }}
                >
                  <HiOutlinePaperAirplane size={isMobile ? 16 : 18} />
                </button>
              </form>
            </div>
          ) : (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              padding: '20px',
              background: 'white',
              minWidth: 0
            }}>
              <div style={{
                width: isMobile ? '60px' : '80px',
                height: isMobile ? '60px' : '80px',
                borderRadius: '50%',
                background: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <HiOutlineChatAlt2 size={isMobile ? 28 : 40} style={{ color: '#cbd5e1' }} />
              </div>
              <h3 style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>
                Select a Conversation
              </h3>
              <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: isMobile ? '12px' : '14px', maxWidth: '300px' }}>
                Choose a buyer from the sidebar to view messages
              </p>
              {isMobile && (
                <button
                  onClick={() => setShowSidebar(true)}
                  style={{
                    marginTop: '16px',
                    padding: '10px 24px',
                    background: '#0d9488',
                    border: 'none',
                    borderRadius: '10px',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'background 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#0f766e'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#0d9488'}
                >
                  Open Conversations
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;