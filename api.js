import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api",
    timeout: 8000,
});

// 请求拦截器 - 添加token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export const loginApi = (data) => api.post("/auth/login", data);
export const registerApi = (data) => api.post("/auth/register", data);
export const getBlindBoxes = (params) => api.get("/blindboxes", { params });
export const getBlindBoxDetail = (id) => api.get(`/blindboxes/${id}`);
export const drawBlindBox = (id) => api.post(`/blindboxes/${id}/draw`);
export const getOrders = () => api.get("/orders");
export const getUserInfo = () => api.get("/user/info");
export const recharge = (amount) => api.post("/user/recharge", { amount });
export const getPlayerShows = () => api.get("/playershows");
export const createPlayerShow = (data) => api.post("/playershows", data);
export const uploadImage = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/images", formData);
};

export default api;