import api from './api';

export const campService = {
  getCamps: async (params = {}) => {
    const response = await api.get('/camps', { params });
    return response.data;
  },

  getCampById: async (id) => {
    const response = await api.get(`/camps/${id}`);
    return response.data;
  },

  registerForCamp: async (id) => {
    const response = await api.post(`/camps/${id}/register`);
    return response.data;
  },

  cancelCampRegistration: async (id) => {
    const response = await api.delete(`/camps/${id}/register`);
    return response.data;
  },

  getMyCampRegistrations: async () => {
    const response = await api.get('/camps/me/registrations');
    return response.data;
  },

  createCamp: async (campData) => {
    const response = await api.post('/camps', campData);
    return response.data;
  },

  updateCamp: async (id, campData) => {
    const response = await api.put(`/camps/${id}`, campData);
    return response.data;
  },

  deleteCamp: async (id) => {
    const response = await api.delete(`/camps/${id}`);
    return response.data;
  }
};

