import api from './axios_config';

export const tao_don_hang = async (du_lieu) => {
  const response = await api.post('/don-hang/', du_lieu);
  return response.data;
};

export const lay_danh_sach_don_hang = async () => {
  const response = await api.get('/don-hang/');
  return response.data;
};

export const cap_nhat_trang_thai_don_hang = async (id, trang_thai) => {
  const response = await api.put(`/don-hang/${id}/trang-thai?trang_thai=${trang_thai}`);
  return response.data;
};
