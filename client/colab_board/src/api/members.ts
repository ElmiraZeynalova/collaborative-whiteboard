import {apiClient} from './client'

export async function changeUsername(userName: string){
    const {data} = await apiClient.patch("/api/members/me/name", {name: userName})
    return data 
}