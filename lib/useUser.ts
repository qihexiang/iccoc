import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import { APIResponse } from "lib/APIResponse";

type LoginResponse = APIResponse<{ user: { email: string } }>

export function useUser(options: { redirectTo: string, redirectOnLoggedIn: boolean }) {
    const [email, setEmail] = useState("");
    const router = useRouter();
    useEffect(() => {
        fetch("/api/user").then(res => res.json())
            .then((res: LoginResponse) => {
                if (res.ok) {
                    setEmail(res.data.user.email)
                }
                // 仅当返回值结果和跳转规则匹配时进行跳转
                if (res.ok === options.redirectOnLoggedIn) {
                    router.push(options.redirectTo)
                }
            })
            .catch(() => {
                if (!options.redirectOnLoggedIn) {
                    router.push(options.redirectTo)
                }
            })
    })
    return email
}