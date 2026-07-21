import React, { useEffect, useState } from 'react';
import { adminDashboardStyles as s } from '../../assets/dummyStyles';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import API_URL from '../../config';
import {
    HiOutlineCheckCircle, HiOutlineLibrary, HiOutlineTicket, HiOutlineUserGroup,
    HiOutlineRefresh, HiOutlineDocumentText, HiOutlineDatabase, HiOutlineCog
} from 'react-icons/hi';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProperties: 0,
        activeListings: 0,
        soldProperties: 0,
    });

    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data.success) {
                    setStats(res.data.stats);
                }
                setLoading(false);
            } catch (error) {
                console.error("Failed to load admin dashboard stats:", error);
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [token]);

    if (loading) {
        return (
            <div className={s.loaderFullPage}>
                <div className={s.loader}></div>
            </div>
        )
    }

    const statCards = [
        { title: "Total Users", value: stats.totalUsers || 0, icon: HiOutlineUserGroup, color: "#0d9488", gradient: "from-[#ccfbf1] to-[#99f6e4]" },
        { title: "Total Properties", value: stats.totalProperties || 0, icon: HiOutlineLibrary, color: "#f59e0b", gradient: "from-[#fef3c7] to-[#fde68a]" },
        { title: "Active Listings", value: stats.activeListings || 0, icon: HiOutlineTicket, color: "#3b82f6", gradient: "from-[#dbeafe] to-[#bfdbfe]" },
        { title: "Sold Properties", value: stats.soldProperties || 0, icon: HiOutlineCheckCircle, color: "#10b981", gradient: "from-[#dcfce7] to-[#bbf7d0]" },
    ];

    const tools = [
        { label: "System Logs", icon: HiOutlineDocumentText },
        { label: "DB Backup", icon: HiOutlineDatabase },
        { label: "Settings", icon: HiOutlineCog },
    ];

    return (
        <div className={s.dashboardContainer}>
            <div className={s.headerContainer}>
                <div className={s.headerPattern}></div>
                <div className={s.headerTextWrap}>
                    <h1 className={s.pageTitle}>Admin Overview</h1>
                    <p className={s.pageSubtitle}>Welcome back, administrator. Here's today's summary.</p>
                </div>
                <button
                    onClick={() => { setLoading(true); window.location.reload(); }}
                    className={s.refreshButton}
                >
                    <HiOutlineRefresh size={16} />
                    Refresh Data
                </button>
            </div>

            <div className={s.statsGrid}>
                {statCards.map((card, i) => (
                    <div key={i} className={s.statCard}>
                        <div className={s.statAccentBar} style={{ backgroundColor: card.color }}></div>
                        <div className={`${s.statIconContainer} bg-gradient-to-br ${card.gradient}`} style={{ color: card.color }}>
                            <card.icon size={24} />
                        </div>
                        <h3 className={s.statTitle}>{card.title}</h3>
                        <p className={s.statValue}>{card.value}</p>
                    </div>
                ))}
            </div>

            <div className={s.secondGrid}>
                <div className={s.systemHealthCard}>
                    <h3 className={s.systemHealthTitle}>System Health</h3>
                    <div className={s.servicesContainer}>
                        {["Database", "Media Storage", "Auth Service", "API Gateway"].map((service, i) => (
                            <div key={i} className={s.serviceItem}>
                                <div className={s.serviceName}>{service}</div>
                                <div className={s.statusContainer}>
                                    <span className={s.statusPulseWrap}>
                                        <span className={s.statusPing}></span>
                                        <span className={s.statusDot}></span>
                                    </span>
                                    <span className={s.statusText}>Online</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={s.adminToolsCard}>
                    <h3 className={s.adminToolsTitle}>Admin Tools</h3>
                    <p className={s.adminToolsDesc}>Quickly manage platform resources and tasks.</p>
                    <div className={s.adminToolsGrid}>
                        {tools.map((tool, i) => (
                            <button key={i} className={s.adminToolButton}>
                                <tool.icon size={20} />
                                {tool.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
