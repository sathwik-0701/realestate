import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/common/Logo';
import { Link, useNavigate } from 'react-router-dom';
import { HiEye, HiEyeOff, HiArrowLeft, HiOutlineMail, HiOutlineLockClosed, HiOutlineUser } from 'react-icons/hi';

const Register = () => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "buyer"
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {register} = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value });
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
           const result = await register(formData); 

           if (result && result.success) {
            setSuccess("Registration successful! Redirecting to verification...");
            setTimeout(
                () => navigate("/verify-email", {state: {email: formData.email}}),
                1500,
            );
           } else {
            setError(result?.message || "Registration failed");
           }
        } catch (err) {
            console.error("Registration error:", err);
            setError(err.message || "An unexpected error occurred during registration.");
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <div className="authWrap2">
        <style>{`
            @keyframes authKenBurns2 {
                0% { transform: scale(1) translate(0, 0); }
                100% { transform: scale(1.12) translate(1%, -1%); }
            }
            @keyframes authFadeUp2 {
                from { opacity: 0; transform: translateY(24px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .auth-input2:focus {
                border-color: #92400E !important;
                box-shadow: 0 0 0 4px rgba(146,64,14,0.08) !important;
            }
            .auth-submit2:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 30px rgba(28,25,23,0.35) !important;
            }
            .role-card {
                transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
            }

            .authWrap2 {
                min-height: 100vh;
                display: flex;
                background: #FFFFFF;
            }
            .authForm2 {
                flex: 1 1 45%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 48px;
                min-height: 100vh;
                background: #FFFFFF;
                position: relative;
                order: 1;
            }
            .authVisual2 {
                flex: 1 1 55%;
                position: relative;
                overflow: hidden;
                min-height: 100vh;
                order: 2;
            }
            .authVisualInner2 {
                position: relative;
                z-index: 2;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding: 48px;
            }
            .authBackLink2 {
                position: absolute;
                top: 48px;
                right: 48px;
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 13px;
                font-weight: 600;
                color: #78716C;
                text-decoration: none;
            }

            @media (max-width: 900px) {
                .authWrap2 {
                    flex-direction: column;
                }
                .authVisual2 {
                    flex: none;
                    min-height: 260px;
                    height: 42vh;
                    order: 1;
                }
                .authVisualInner2 {
                    padding: 24px;
                }
                .authVisualInner2 h2 {
                    font-size: 1.6rem !important;
                }
                .authVisualInner2 p {
                    font-size: 0.9rem !important;
                }
                .authForm2 {
                    flex: none;
                    min-height: auto;
                    padding: 32px 24px 48px;
                    order: 2;
                }
                .authBackLink2 {
                    top: 24px;
                    right: 24px;
                }
            }
        `}</style>

        {/* Form Panel */}
        <div className="authForm2">
            <Link to="/" className="authBackLink2">
                <HiArrowLeft size={14} /> Back home
            </Link>

            <div style={{
                width: '100%',
                maxWidth: '400px',
                animation: 'authFadeUp2 0.7s cubic-bezier(0.16,1,0.3,1)'
            }}>
                <h2 style={{
                    fontSize: '1.9rem',
                    fontWeight: '700',
                    color: '#1C1917',
                    marginBottom: '8px',
                    letterSpacing: '-0.5px'
                }}>Create your account</h2>
                <p style={{
                    color: '#78716C',
                    marginBottom: '28px',
                    fontSize: '0.95rem'
                }}>
                    Join our community to find or list properties
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
                {success && (
                    <div style={{
                        padding: '12px 16px',
                        background: '#F0FDF4',
                        color: '#16A34A',
                        borderRadius: '10px',
                        marginBottom: '20px',
                        fontSize: '0.85rem',
                        border: '1px solid #BBF7D0'
                    }}>{success}</div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            color: '#44403C'
                        }}>Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <HiOutlineUser size={18} style={{
                                position: 'absolute',
                                left: '14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#A8A29E'
                            }} />
                            <input
                                type='text'
                                name='name'
                                placeholder='John Doe'
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="auth-input2"
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
                                className="auth-input2"
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
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            color: '#44403C'
                        }}>Password</label>
                        <div style={{position: "relative"}}>
                            <HiOutlineLockClosed size={18} style={{
                                position: 'absolute',
                                left: '14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#A8A29E'
                            }} />
                            <input type={showPassword ? "text": "password"}
                            name='password'
                            placeholder='● ● ● ● '
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="auth-input2"
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

                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            color: '#44403C'
                        }}>I am a...</label>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            {['buyer', 'seller'].map((roleOption) => {
                                const active = formData.role === roleOption;
                                return (
                                    <label key={roleOption} className="role-card" style={{
                                        flex: 1,
                                        cursor: 'pointer',
                                        padding: '12px',
                                        borderRadius: '10px',
                                        border: active ? '2px solid #92400E' : '1.5px solid #E7E5E4',
                                        background: active ? '#FEF3E8' : '#FFFFFF',
                                        textAlign: 'center',
                                        fontWeight: '600',
                                        fontSize: '0.9rem',
                                        color: active ? '#92400E' : '#78716C'
                                    }}>
                                        <input
                                            type='radio'
                                            name='role'
                                            value={roleOption}
                                            checked={active}
                                            onChange={handleChange}
                                            style={{ display: 'none' }}
                                        />
                                        {roleOption === 'buyer' ? 'Buyer' : 'Seller'}
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <button
                        className="auth-submit2"
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
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <p style={{
                    textAlign: 'center',
                    marginTop: '28px',
                    fontSize: '0.85rem',
                    color: '#A8A29E'
                }}>
                    Already have an account?{" "}
                    <Link to="/login" style={{ color: '#92400E', fontWeight: '700' }}>
                        Sign in here
                    </Link>
                </p>
            </div>
        </div>

        {/* Visual Panel */}
        <div className="authVisual2">
            <img
                src="/register-bg.jpg"
                alt="Elegant two-story home at twilight"
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    animation: 'authKenBurns2 20s ease-in-out infinite alternate'
                }}
            />
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(28,25,23,0.55) 0%, rgba(28,25,23,0.15) 35%, rgba(28,25,23,0.75) 100%)'
            }} />

            <div className="authVisualInner2">
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Logo style={{ color: '#fff' }} />
                </div>

                <div style={{ maxWidth: '480px', marginLeft: 'auto', textAlign: 'right' }}>
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
                        Join Us
                    </span>
                    <h2 style={{
                        fontSize: '2.4rem',
                        fontWeight: '600',
                        color: '#fff',
                        lineHeight: '1.2',
                        letterSpacing: '-1px',
                        marginBottom: '16px'
                    }}>
                        Start your search for the perfect home.
                    </h2>
                    <p style={{
                        fontSize: '1.05rem',
                        color: 'rgba(255,255,255,0.8)',
                        lineHeight: '1.7'
                    }}>
                        Create a free account to save listings, chat with sellers, and get alerts on new properties.
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Register;
