import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import FindDonors from './pages/FindDonors';
import BloodRequests from './pages/BloodRequests';
import CreateBloodRequest from './pages/CreateBloodRequest';
import DonationCamps from './pages/DonationCamps';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import DonorRegistration from './pages/DonorRegistration';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <div className="flex flex-col min-h-screen">
            {/* Global Toasts */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#FFFFFF',
                  color: '#1E293B',
                  borderRadius: '16px',
                  boxShadow: '0 10px 25px rgba(187, 43, 41, 0.15)',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: '1px solid #FFE8E8'
                },
                success: {
                  iconTheme: {
                    primary: '#BB2B29',
                    secondary: '#FFFFFF'
                  }
                }
              }}
            />

            {/* Navigation Header */}
            <Navbar />

            {/* Main Application Routes */}
            <main className="flex-1 pb-24 md:pb-0">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/donors" element={<FindDonors />} />
                <Route path="/requests" element={<BloodRequests />} />
                <Route path="/camps" element={<DonationCamps />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* User Protected Routes */}
                <Route
                  path="/requests/create"
                  element={
                    <ProtectedRoute>
                      <CreateBloodRequest />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/donor/register"
                  element={
                    <ProtectedRoute>
                      <DonorRegistration />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Protected Routes */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Footer */}
            <Footer />

            {/* Mobile Dock Navigation (matches Reference UI) */}
            <MobileBottomNav />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

