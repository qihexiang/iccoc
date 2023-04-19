import { APIResponse } from "@/lib/APIResponse";
import { useUser } from "@/lib/useUser";
import { Alert, Box, Button, ButtonGroup, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

type LoginResponse = APIResponse<{
    user: { email: string }
}>

export default function LoginPage() {
    useUser({ redirectTo: "/activities/panel", redirectOnLoggedIn: true });
    const router = useRouter()
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    return <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <Box>
            <Typography variant="h6">Login</Typography>
        </Box>
        {
            errorMessage !== undefined ?
                <Alert severity="error">{errorMessage}</Alert> : null
        }
        <TextField value={username} onChange={(e) => setUsername(e.target.value)} placeholder="E-mail as your username" />
        <TextField value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
        <ButtonGroup variant="contained">
            <Button color="success" onClick={() => {
                if (username !== "" && password !== "") {
                    fetch("/api/auth/login", {
                        body: JSON.stringify({ username, password }), method: "POST", headers: new Headers({
                            "Content-Type": "application/json"
                        })
                    }).then(res => res.json())
                        .then((res: LoginResponse) => {
                            if (!res.ok) {
                                setErrorMessage(res.message)
                                setPassword("")
                            } else {
                                router.push("/activities")
                            }                            
                        })
                } else {
                    setUsername("")
                    setPassword("")
                    setErrorMessage("Please input username and password")
                }
            }}>Login</Button>
            <Button color="error" onClick={() => {
                setUsername("")
                setPassword("")
            }}>Reset</Button>
        </ButtonGroup>
        <Button variant="contained" color="info" onClick={() => router.push("/activities/registry")}>Registry</Button>
    </Box>
}