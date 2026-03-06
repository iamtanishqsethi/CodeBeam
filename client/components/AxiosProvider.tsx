'use client'

import {useAxiosInterceptor} from "@/hooks/useAxiosInterceptor";

export default function AxiosProvider({children}:{children:React.ReactNode}) {
    useAxiosInterceptor()
    return<>{children}</>
}
