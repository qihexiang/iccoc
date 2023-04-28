import axios from "axios";

export const api = axios.create({
    baseURL: "/api", withCredentials: true, validateStatus: _ => true
})

export default api
