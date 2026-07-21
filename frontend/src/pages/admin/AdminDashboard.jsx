import React, { useEffect, useState } from 'react';
import { adminDashboardStyles as s } from '../../assets/dummyStyles';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import API_URL from '../../config';
import { HiOutlineCheckCircle, HiOutlineLibrary, HiOutlineTicket, HiOutlineUserGroup } from 'react-icons/hi';

// Real Estate Sunset House background image
const BACKGROUND_IMAGE_URL = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80";

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
        console.log("Admin Dashboard mounted");
        const fetchDashboardData = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data.success) {
                    console.log("Stats received:", res.data.stats);
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
        {
            title: "Total Users",
            value: stats.totalUsers || 0,
            icon: HiOutlineUserGroup,
            color: "#2dd4bf",
            bg: "rgba(45, 212, 191, 0.15)",
            border: "rgba(45, 212, 191, 0.3)",
        },
        {
            title: "Total Properties",
            value: stats.totalProperties || 0,
            icon: HiOutlineLibrary,
            color: "#fbbf24",
            bg: "rgba(251, 191, 36, 0.15)",
            border: "rgba(251, 191, 36, 0.3)",
        },
        {
            title: "Active Listings",
            value: stats.activeListings || 0,
            icon: HiOutlineTicket,
            color: "#60a5fa",
            bg: "rgba(96, 165, 250, 0.15)",
            border: "rgba(96, 165, 250, 0.3)",
        },
        {
            title: "Sold Properties",
            value: stats.soldProperties || 0,
            icon: HiOutlineCheckCircle,
            color: "#34d399",
            bg: "rgba(52, 211, 153, 0.15)",
            border: "rgba(52, 211, 153, 0.3)",
        },
    ];

    return (
        <div 
            className={s.dashboardContainer}
            style={{ backgroundImage: `url(${BACKGROUND_IMAGE_URL})` }}
        >
            {/* Dark Glass Overlay */}
            <div className={s.overlay}></div>

            <div className={s.contentWrapper}>
                <div className={s.headerContainer}>
                    <div>
                        <h1 className={s.pageTitle}>Admin Overview</h1>
                        <p className={s.pageSubtitle}>
                            Welcome back, administrator. Here's today's summary.
                        </p>
                    </div>
                    <button onClick={() => {
                        setLoading(true);
                        window.location.reload();
                    }} className={s.refreshButton}>
                        Refresh Data
                    </button>
                </div>

                <div className={s.statsGrid}>
                    {statCards.map((card, i) => (
                        <div 
                            key={i} 
                            className={s.statCard}
                        >
                            <div 
                                className={s.statIconContainer} 
                                style={{ 
                                    backgroundColor: card.bg,
                                    border: `1px solid ${card.border}`,
                                    color: card.color 
                                }}
                            >
                                <card.icon size={26} />
                            </div>
                            <div>
                                <h3 className={s.statTitle}>{card.title}</h3>
                                <p className={s.statValue}>{card.value}</p>
                            </div>
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
                                        <span className={s.statusDot}></span>
                                        <span className={s.statusText}>Online</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={s.adminToolsCard}>
                        <div>
                            <h3 className={s.adminToolsTitle}>Admin Tools</h3>
                            <p className={s.adminToolsDesc}>
                                Quickly manage platform resources and tasks.
                            </p>
                        </div>
                        <div className={s.adminToolsButtonsContainer}>
                            <button className={s.adminToolButton}>System Logs</button>
                            <button className={s.adminToolButton}>DB Backup</button>
                            <button className={s.adminToolButton}>Settings</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
