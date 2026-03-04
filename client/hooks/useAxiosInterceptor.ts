import {useSession} from "@clerk/nextjs";
import {useEffect} from "react";
import apiClient from "@/lib/api";

export const useAxiosInterceptor = () => {
    const {session}=useSession()
    useEffect(()=>{
        const interceptorId=apiClient.interceptors.request.use(async (config)=>{
            if(session){
                const token=await session.getToken()
                if(token){
                    config.headers.Authorization=`Bearer ${token}`
                }
            }
            return config
        })

        return ()=>{
            apiClient.interceptors.request.eject(interceptorId)
        }
    },[session])
    return apiClient
};