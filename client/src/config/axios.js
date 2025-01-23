import { API_URL } from "@/constants/constant"
import axios from "axios"

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})

export default axiosInstance