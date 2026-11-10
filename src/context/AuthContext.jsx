import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [donorProfile, setDonorProfile] = useState(() => {
    const saved = localStorage.getItem('donorProfile');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Load user profile on mount if token exists
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await authService.getMe();
          if (res.success) {
            setUser(res.user);
            setDonorProfile(res.donorProfile || null);
            localStorage.setItem('user', JSON.stringify(res.user));
            if (res.donorProfile) {
              localStorage.setItem('donorProfile', JSON.stringify(res.donorProfile));
            } else {
              localStorage.removeItem('donorProfile');
            }
          }
        } catch (error) {
          console.error('Session validation error:', error.message);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const loginUser = (userData, userToken, donorData = null) => {
    setUser(userData);
    setToken(userToken);
    setDonorProfile(donorData);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    if (donorData) {
      localStorage.setItem('donorProfile', JSON.stringify(donorData));
    }
  };

  const logout = async () => {
    try {
      if (token) await authService.logout();
    } catch (e) {
      // Ignore network logout error
    }
    setUser(null);
    setToken(null);
    setDonorProfile(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('donorProfile');
  };

  const refreshUser = async () => {
    try {
      const res = await authService.getMe();
      if (res.success) {
        setUser(res.user);
        setDonorProfile(res.donorProfile || null);
        localStorage.setItem('user', JSON.stringify(res.user));
        if (res.donorProfile) {
          localStorage.setItem('donorProfile', JSON.stringify(res.donorProfile));
        }
      }
    } catch (e) {
      console.error('Error refreshing user:', e);
    }
  };

  const updateDonorLocally = (donor) => {
    setDonorProfile(donor);
    if (donor) {
      localStorage.setItem('donorProfile', JSON.stringify(donor));
    } else {
      localStorage.removeItem('donorProfile');
    }
  };

  const value = {
    user,
    token,
    donorProfile,
    loading,
    isLoggedIn: Boolean(user && token),
    isVerified: Boolean(user && user.isEmailVerified),
    isAdmin: Boolean(user && user.role === 'admin'),
    isDonor: Boolean(donorProfile),
    loginUser,
    logout,
    refreshUser,
    updateDonorLocally
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

