"use client";

import { H1 } from "@/components/TypoElement";
import useAlert from "@/components/useAlert";
import { Box, Button, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import totpGenerator from "totp-generator";

const tEncoder = new TextEncoder();

function useTotp(secret: string) {
    const [current, setCurrent] = useState("------")
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent(totpGenerator(secret))
        }, 1000)
        return () => clearInterval(interval)
    }, [secret])
    return current
} 

export default function LoginAdmin() {
    const router = useRouter();
    const [setInformation, alertComponent] = useAlert(6000);
    const [username, setUsername] = useState("");
    const [totp, setTotp] = useState("");
    return <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1
    }}>
        {alertComponent}
        <H1>Add an administrator</H1>
        <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Email as username"></TextField>
        <TextField label="Token" value={totp} onChange={(e) => setTotp(e.target.value)} placeholder="Input your token here"></TextField>
        <Button variant="contained" color="success" onClick={() => {
            fetch("/admin/manage/login", {
                method: "POST",
                body: JSON.stringify({
                    username, totp
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => {
                if(res.ok) {
                    setInformation({
                        color: "success",
                        message: "Login success."
                    })
                    setUsername("")
                    router.push("/admin")
                } else {
                    setInformation({
                        color: "error",
                        message: "Failed to registry"
                    })
                }
                setTotp("")
            })
        }}>Login</Button>
    </Box>
}