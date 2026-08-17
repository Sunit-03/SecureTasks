import { api } from "@/lib/api"

export const signup = async(data:{email: string, password: string}) => {
    const response = await api.post("/auth/signup", data);
    return response.data;
};

export const login = async(data:{email: string, password: string}) => {
    const response = await api.post("/auth/login", data);
    return response.data;
};