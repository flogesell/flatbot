import axios from 'axios';
import { useAuthStore } from '../store';

const useAxiosClient = () => {
  const { authToken } = useAuthStore();
  console.log(import.meta.env.VITE_API_URL);
  return axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
};

export default useAxiosClient;
