import api from './api';

export const donationService = {
  createDonation: async (donationData) => {
    const response = await api.post('/donations', donationData);
    return response.data;
  },

  getMyDonations: async () => {
    const response = await api.get('/donations/me');
    return response.data;
  },

  getAllDonations: async (params = {}) => {
    const response = await api.get('/donations', { params });
    return response.data;
  },

  getDonationById: async (id) => {
    const response = await api.get(`/donations/${id}`);
    return response.data;
  },

  updateMyDonation: async (id, data) => {
    const response = await api.put(`/donations/${id}`, data);
    return response.data;
  },

  updateDonationStatus: async (id, status) => {
    const response = await api.patch(`/donations/${id}/status`, { status });
    return response.data;
  },

  cancelMyDonation: async (id) => {
    const response = await api.delete(`/donations/${id}`);
    return response.data;
  }
};

