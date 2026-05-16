import api from './axios_config';

export const lay_thong_bao = async () => {
  const response = await api.get('/thong-bao/');
  return response.data;
};

export const doc_thong_bao = async (id) => {
  const response = await api.put(`/thong-bao/${id}/doc`);
  return response.data;
};

export const doc_tat_ca_thong_bao = async () => {
  const response = await api.put('/thong-bao/doc-tat-ca');
  return response.data;
};
