import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}`;

export const login = async (identifier, password) => {
  const response = await axios.post(`${API_URL}/token/`, { identifier, password });
  if (response.data.access) {
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    localStorage.setItem('issatup',response.data.user.issatup);
    localStorage.setItem('user_data', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

export const logout = async () => {
  const refresh = localStorage.getItem('refresh_token');
  await axios.post(`${API_URL}/logout/`, { refresh });
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_data');
};


export const refreshAccessToken = async () => {
    const refresh = localStorage.getItem('refresh_token');
    try {
        const response = await axios.post(`${API_URL}/token/refresh/`, { refresh });
        localStorage.setItem('access_token', response.data.access);
        return response.data.access;
    } catch (error) {
        console.error('Error refreshing access token', error);
        throw error;
    }
};
