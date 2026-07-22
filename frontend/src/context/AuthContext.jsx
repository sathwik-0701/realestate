import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
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
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("Error parsing stored user:", e);
                    localStorage.removeItem("user");
                    sessionStorage.removeItem("user");
                }
            }
        }
        setLoading(false);

        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if(
                    error.response &&
                    error.response.status === 403 &&
                    error.response.data &&
                    (error.response.data.message || error.response.data.Message)
                ) {
                    const msg = error.response.data.message || error.response.data.Message || "";
                    if (typeof msg === 'string' && msg.includes("blocked")) {
                        logout();
                    }
                }
                return Promise.reject(error);
            },
        );
        return () => axios.interceptors.response.eject(interceptor);
    }, [token]);

    // login
    const login = async (email, password) => {
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
                message: error.response?.data?.message || error.response?.data?.Message || "Login failed",
            };
        }
    };

    // Register
    const register = async (userData) => {
        try {
            const res = await axios.post(`${API_URL}/api/auth/register`, userData);
            return {
                success: true,
                message: res.data.message
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.response?.data?.Message || "Registration failed",
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
            const res = await axios.get(`${API_URL}/api/user/profile`, {
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
            console.error("Failed to refresh the user:", error);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            token,
            loading,
            login,
            register,
            logout,
            refreshUser,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
