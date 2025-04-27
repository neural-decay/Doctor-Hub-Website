import axios from "axios";
import { API_BASE_URL } from "./constants";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// interceptors configuration ==> later

export default apiClient;
