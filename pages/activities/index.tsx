import { useContext, useEffect } from "react"
import { LoginStatusStorage } from "../_app"
import { useRouter } from "next/router";

export default function ActivitesIndex() {
    const loginStatus = useContext(LoginStatusStorage);
    const router = useRouter();
    useEffect(() => {
        if (loginStatus.state === null) {
            router.push("/activities/login")
        } else {
            router.push("/activities/submit")
        }
    })
    return null
}