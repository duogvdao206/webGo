import api from './axios_config';

export const dang_ky = async (thong_tin) => {
  const response = await api.post('/auth/dang-ky', thong_tin);
  return response.data;
};

export const dang_nhap = async (thong_tin) => {
  const response = await api.post('/auth/dang-nhap', thong_tin);
  return response.data;
};
