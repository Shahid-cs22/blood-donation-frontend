import api from './api';

export const contactService = {
  submitInquiry: async (data) => {
    const res = await api.post('/contact', data);
    return res.data;
  }
};

