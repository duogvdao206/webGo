import api from './axios_config';

export const lay_thong_ke_tong_quan = async () => {
  const response = await api.get('/thong-ke/tong-quan');
  return response.data;
};
