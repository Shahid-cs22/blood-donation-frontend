import api from './api';

export const donorService = {
  getDonors: async (params = {}) => {
    const response = await api.get('/donors', { params });
    return response.data;
  },

  getDonorById: async (id) => {
    const response = await api.get(`/donors/${id}`);
    return response.data;
  },

  getMyDonorProfile: async () => {
    const response = await api.get('/donors/me');
    return response.data;
  },

  createDonor: async (donorData) => {
    const response = await api.post('/donors', donorData);
    return response.data;
  },

  updateMyDonorProfile: async (donorData) => {
    const response = await api.put('/donors/me', donorData);
    return response.data;
  },

  toggleAvailability: async (isAvailable) => {
    const response = await api.patch('/donors/me/availability', { isAvailable });
    return response.data;
  },

  deleteMyDonorProfile: async () => {
    const response = await api.delete('/donors/me');
    return response.data;
  }
};

