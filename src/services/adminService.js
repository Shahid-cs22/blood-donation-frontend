import api from './api';

export const contactRequestService = {
  createContactRequest: async (data) => {
    const response = await api.post('/contact-requests', data);
    return response.data;
  },

  getMyContactRequests: async () => {
    const response = await api.get('/contact-requests/me');
    return response.data;
  },

  respondToContactRequest: async (id, status, donorNotes = '') => {
    const response = await api.patch(`/contact-requests/${id}/respond`, { status, donorNotes });
    return response.data;
  }
};

export const notificationService = {
  getMyNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  },

  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  }
};

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  toggleUserSuspension: async (id) => {
    const response = await api.patch(`/admin/users/${id}/suspend`);
    return response.data;
  },

  updateUserRole: async (id, role) => {
    const response = await api.patch(`/admin/users/${id}/role`, { role });
    return response.data;
  },

  getDonors: async (params = {}) => {
    const response = await api.get('/admin/donors', { params });
    return response.data;
  },

  exportCsvUrl: (type) => {
    const token = localStorage.getItem('token');
    const baseUrl = import.meta.env.VITE_API_URL || '/api';
    return `${baseUrl}/admin/export/${type}?token=${token || ''}`;
  }
};

