import api from './api';

export const bloodRequestService = {
  createRequest: async (requestData) => {
    const response = await api.post('/blood-requests', requestData);
    return response.data;
  },

  getAllRequests: async (params = {}) => {
    const response = await api.get('/blood-requests', { params });
    return response.data;
  },

  getMyRequests: async () => {
    const response = await api.get('/blood-requests/me');
    return response.data;
  },

  getRequestById: async (id) => {
    const response = await api.get(`/blood-requests/${id}`);
    return response.data;
  },

  updateMyRequest: async (id, data) => {
    const response = await api.put(`/blood-requests/${id}`, data);
    return response.data;
  },

  updateRequestStatus: async (id, status) => {
    const response = await api.patch(`/blood-requests/${id}/status`, { status });
    return response.data;
  },

  cancelMyRequest: async (id) => {
    const response = await api.delete(`/blood-requests/${id}`);
    return response.data;
  }
};

