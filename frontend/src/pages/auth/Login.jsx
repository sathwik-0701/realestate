import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/common/Logo';
import { Link, useNavigate } from 'react-router-dom';
import { HiEye, HiEyeOff, HiArrowLeft, HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';

const Login = () => {

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const isMobile = window.innerWidth < 900;

    const { login } = useAuth();
    const navigate = useNavigate();

    // to handleChange for input value
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    // to submit the data to login
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const result = await login(formData.email, formData.password);

        if(result.success)
        {
            const storedUser = JSON.parse(
                localStorage.getItem("user") || sessionStorage.getItem("user"),
            );
            if(storedUser?.role === "admin")
            {
               navigate("/admin-dashboard");
            } else if (storedUser?.role === "seller")
            {
                navigate("/dashboard");
            }  else {
                navigate("/");
            }
        } else {
            setError(result.message);
        }
        setIsLoading(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            background: '#FFFFFF'
        }}>
            <style>{`
                @keyframes authKenBurns {
                    0% { transform: scale(1) translate(0, 0); }
                    100% { transform: scale(1.12) translate(-1%, -1%); }
                }
                @keyframes authFadeUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .auth-input:focus {
                    border-color: #92400E !important;
                    box-shadow: 0 0 0 4px rgba(146,64,14,0.08) !important;
                }
                .auth-submit:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 30px rgba(28,25,23,0.35) !important;
                }
            `}</style>

            {/* Left Visual Panel */}
            {!isMobile && (
                <div style={{
                    flex: '1 1 55%',
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: '100vh'
                }}>
                    <img
                        src="/login-bg.jpg"
                        alt="Modern luxury home exterior at dusk"
                        style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            animation: 'authKenBurns 20s ease-in-out infinite alternate'
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(28,25,23,0.55) 0%, rgba(28,25,23,0.15) 35%, rgba(28,25,23,0.75) 100%)'
                    }} />

                    <div style={{
                        position: 'relative',
                        zIndex: 2,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '48px'
                    }}>
                        <Logo
                            style={{ color: '#fff' }}
                        />

                        <div style={{ maxWidth: '480px' }}>
                            <span style={{
                                display: 'inline-block',
                                padding: '6px 16px',
                                background: 'rgba(255,255,255,0.12)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.25)',
                                color: '#fff',
                                borderRadius: '50px',
                                fontSize: '12px',
                                fontWeight: '600',
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                                marginBottom: '20px'
                            }}>
                                Welcome Back
                            </span>
                            <h2 style={{
                                fontSize: '2.4rem',
                                fontWeight: '600',
                                color: '#fff',
                                lineHeight: '1.2',
                                letterSpacing: '-1px',
                                marginBottom: '16px'
                            }}>
                                Pick up right where you left off.
                            </h2>
                            <p style={{
                                fontSize: '1.05rem',
                                color: 'rgba(255,255,255,0.8)',
                                lineHeight: '1.7'
                            }}>
                                Track your saved homes, message agents, and continue your search across thousands of verified listings.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Right Form Panel */}
            <div style={{
                flex: isMobile ? '1 1 100%' : '1 1 45%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: isMobile ? '32px 24px' : '48px',
                minHeight: '100vh',
                background: '#FFFFFF',
                position: 'relative'
            }}>
                {isMobile && (
                    <div style={{ position: 'absolute', top: '24px', left: '24px' }}>
                        <Logo fontSize="1.2rem" iconSize={20} />
                    </div>
                )}

                <Link to="/" style={{
                    position: 'absolute',
                    top: isMobile ? '24px' : '48px',
                    right: isMobile ? '24px' : '48px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#78716C',
                    textDecoration: 'none'
                }}>
                    <HiArrowLeft size={14} /> Back home
                </Link>

                <div style={{
                    width: '100%',
                    maxWidth: '400px',
                    animation: 'authFadeUp 0.7s cubic-bezier(0.16,1,0.3,1)',
                    marginTop: isMobile ? '48px' : 0
                }}>
                    <h2 style={{
                        fontSize: '1.9rem',
                        fontWeight: '700',
                        color: '#1C1917',
                        marginBottom: '8px',
                        letterSpacing: '-0.5px'
                    }}>Sign in to your account</h2>
                    <p style={{
                        color: '#78716C',
                        marginBottom: '32px',
                        fontSize: '0.95rem'
                    }}>
                        New here?{" "}
                        <Link to="/register" style={{ color: '#92400E', fontWeight: '600' }}>
                            Create an account
                        </Link>
                    </p>

                    {error && (
                        <div style={{
                            padding: '12px 16px',
                            background: '#FEF2F2',
                            color: '#DC2626',
                            borderRadius: '10px',
                            marginBottom: '20px',
                            fontSize: '0.85rem',
                            border: '1px solid #FECACA'
                        }}>{error}</div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                color: '#44403C'
                            }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <HiOutlineMail size={18} style={{
                                    position: 'absolute',
                                    left: '14px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#A8A29E'
                                }} />
                                <input
                                    type='email'
                                    name='email'
                                    placeholder='name@company.com'
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="auth-input"
                                    style={{
                                        width: '100%',
                                        padding: '13px 16px 13px 42px',
                                        borderRadius: '10px',
                                        border: '1.5px solid #E7E5E4',
                                        outline: 'none',
                                        fontSize: '0.95rem',
                                        color: '#1C1917',
                                        transition: 'all 0.2s ease'
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '8px'
                            }}>
                                <label style={{
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    color: '#44403C'
                                }}>Password</label>
                                <Link to="/forgot-password" style={{
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    color: '#92400E'
                                }}>
                                    Forgot password?
                                </Link>
                            </div>
                            <div style={{ position: "relative" }}>
                                <HiOutlineLockClosed size={18} style={{
                                    position: 'absolute',
                                    left: '14px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#A8A29E'
                                }} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name='password'
                                    placeholder='● ● ● ● '
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="auth-input"
                                    style={{
                                        width: '100%',
                                        padding: '13px 42px 13px 42px',
                                        borderRadius: '10px',
                                        border: '1.5px solid #E7E5E4',
                                        outline: 'none',
                                        fontSize: '0.95rem',
                                        color: '#1C1917',
                                        transition: 'all 0.2s ease'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: "absolute",
                                        right: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "#A8A29E",
                                        display: "flex",
                                        alignItems: "center",
                                        padding: 0
                                    }}
                                >
                                    {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            className="auth-submit"
                            type='submit'
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: 'linear-gradient(135deg, #1C1917, #292524)',
                                border: 'none',
                                borderRadius: '10px',
                                color: '#fff',
                                fontWeight: '700',
                                fontSize: '0.95rem',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                marginTop: '8px',
                                boxShadow: '0 6px 20px rgba(28,25,23,0.25)',
                                transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                                opacity: isLoading ? 0.7 : 1
                            }}>
                            {isLoading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <p style={{
                        textAlign: 'center',
                        marginTop: '32px',
                        fontSize: '0.85rem',
                        color: '#A8A29E'
                    }}>
                        Don't have an account?{" "}
                        <Link to="/register" style={{ color: '#92400E', fontWeight: '700' }}>
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
