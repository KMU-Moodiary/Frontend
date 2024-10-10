import { toast } from "react-toastify";

import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: 1000 * 60,
});

axiosInstance.interceptors.response.use(
  (response) => {
    if (response?.data?.error) {
      toast.error(response.data.error);
    }

    return response;
  }
);