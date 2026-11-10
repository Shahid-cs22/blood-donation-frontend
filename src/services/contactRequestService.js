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

