import api from './axios_config';

export const lay_san_pham_trang_chu = async () => {
  const response = await api.get('/san-pham/trang-chu');
  return response.data;
};

export const them_san_pham = async (du_lieu) => {
  const response = await api.post('/san-pham/', du_lieu);
  return response.data;
};

export const lay_tat_ca_san_pham = async () => {
  const response = await api.get('/san-pham/');
  return response.data;
};

export const cap_nhat_san_pham = async (id, du_lieu) => {
  const response = await api.put(`/san-pham/${id}`, du_lieu);
  return response.data;
};

export const xoa_san_pham = async (id) => {
  const response = await api.delete(`/san-pham/${id}`);
  return response.data;
};
