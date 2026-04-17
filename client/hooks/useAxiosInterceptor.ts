import {useSession} from "@clerk/nextjs";
import {useEffect, useRef} from "react";
import apiClient from "@/lib/api";

export const useAxiosInterceptor = () => {
    const {session}=useSession()
    const sessionRef=useRef(session)

    // to avoid multiple interceptors
    //always keep ref up to date
    useEffect(() => {
        sessionRef.current = session;
    }, [session]);
    useEffect(()=>{
        const interceptorId=apiClient.interceptors.request.use(async (config)=>{
            const activeSession = sessionRef.current;
            if(activeSession){
                const token=await activeSession.getToken()
                if(token){
                    config.headers.Authorization=`Bearer ${token}`
                }
            }
            return config
        })

        return ()=>{
            apiClient.interceptors.request.eject(interceptorId)
        }
    },[])//runs once , the ref handler session updates
    return apiClient
};
