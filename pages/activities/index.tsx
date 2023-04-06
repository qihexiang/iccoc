import { useContext, useEffect } from "react"
import { LoginStatusStorage } from "../_app"
import { useRouter } from "next/router";
import { useUser } from "@/lib/useUser";

export default function ActivitesIndex() {
    useUser({ redirectTo: "/activities/login", redirectOnLoggedIn: false });
    useUser({ redirectTo: "/activities/panel", redirectOnLoggedIn: true });
    return null
}