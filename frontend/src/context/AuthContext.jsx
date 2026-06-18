import React, { createContext, useContext, useEffect, useState } from 'react'; // ✅ removed Children from import
import axios from 'axios';
import API_URL from '../config';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {  // ✅ was {Children} (uppercase)
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(
        localStorage.getItem("token") || sessionStorage.getItem("token") || null,
    );
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if(token) {
            const storedUser =
            localStorage.getItem("user") || sessionStorage.getItem("user");
            if(storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
        setLoading(false); // ✅ was missing, loading never became false

        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if(
                    error.response &&
                    error.response.status === 403 &&
                    error.response.data.message.includes("blocked")
                ) {
                    logout();
                }
                return Promise.reject(error);
            },
        );
        return () => axios.interceptors.response.eject(interceptor);
    }, [token]);

    // login
    const login = async (email, password) => {  // ✅ was (verifyEmailStyles, password)
        try {
            const res = await axios.post(`${API_URL}/api/auth/login`, {
                email,
                password,
            });

            const { token, user } = res.data;
            setToken(token);
            setUser(user);

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            return { success: true };
        }
        catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Login failed",  // ✅ was err (not defined)
            };
        }
    };

    // Register
    const register = async (userData) => {
        try {
            const res = await axios.post(`${API_URL}/api/auth/register`, userData);
            return {                                   // ✅ return was on separate line causing undefined
                success: true,
                message: res.data.message
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Registration failed",  // ✅ was err
            };
        }
    };

    // logout
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        navigate("/login");
    };

    // to get user details
    const refreshUser = async () => {
        if(!token) return;
        try {
            const res = await axios.get(`${API_URL}/api/user/profile`, {  // ✅ was /api/auth/me (wrong route)
                headers: { Authorization: `Bearer ${token}` },
            });
            if(res.data.success) {
                const updatedUser = res.data.user;
                setUser(updatedUser);
                const storage = localStorage.getItem("token")
                    ? localStorage
                    : sessionStorage;
                storage.setItem("user", JSON.stringify(updatedUser));
            }
        }
        catch (error) {
            console.error("Failed to refresh the user:", error);  // ✅ was err (not defined)
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            token,
            loading,
            login,        // ✅ was missing from value!
            register,
            logout,
            refreshUser,
        }}>
            {children}    {/* ✅ was {Children} (uppercase - renders nothing) */}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);