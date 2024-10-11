import axios from "axios";


const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const login =async (details)=> {
    return await axios.post(`${API_BASE_URL}/auth/login`, details);
}

export const signup = async (data) => {
    return await axios.post(`${API_BASE_URL}/auth/signup`, data);
}