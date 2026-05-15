import api from './axios_config';

export const tai_anh_len = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/uploads/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data; // Trả về { url: '...' }
};
