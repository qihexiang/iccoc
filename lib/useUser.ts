import axios from "axios";
import { APIResponse } from "lib/APIResponse";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type LoginResponse = APIResponse<{ user: { email: string } }>

export function useUser(options: { redirectTo: string, redirectOnLoggedIn: boolean }) {
    const [email, setEmail] = useState("");
    const router = useRouter();
    useEffect(() => {
        axios.get("/api/user", { withCredentials: true })
            .then(res => {
                console.log((res.status === 200 || res.status === 304) === options.redirectOnLoggedIn, options.redirectTo)
                // 仅当返回值结果和跳转规则匹配时进行跳转
                if ((res.status === 200 || res.status === 304) === options.redirectOnLoggedIn) {
                    console.log("Router pushed")
                    router.push(options.redirectTo)
                }
            })
            .catch(() => {
                if (!options.redirectOnLoggedIn) {
                    router.push(options.redirectTo)
                }
            })
    }, [])
    return email
}