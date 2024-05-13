import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_FRONTEND_BASE_URL;

const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = BASE_URL;
axiosInstance.defaults.withCredentials = true;

axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('session-auth-access');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
