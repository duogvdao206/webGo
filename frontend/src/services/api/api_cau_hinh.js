import api from './axios_config';

export const lay_cau_hinh = async () => {
  const response = await api.get('/cau-hinh/');
  return response.data;
};

export const cap_nhat_cau_hinh = async (du_lieu) => {
  const response = await api.post('/cau-hinh/', du_lieu);
  return response.data;
};
