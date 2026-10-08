import {apiClient} from './client'

export async function login(userId: string, userName: string,email: string, password: string){
    const {data} = await apiClient.post("/api/auth/login", {userId, userName, email, password})
    return data 
}

export async function logout(){
    const {data} = await apiClient.post("/api/auth/logout")
    return data 
}

export async function userIsValid(){
    const {data} = await apiClient.get("/api/auth/me")
    return data
}

export async function refreshToken(){
    const {data} = await apiClient.get("/api/auth/refresh")
    return data
}