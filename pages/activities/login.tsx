import api from "@/lib/apiRequest";
import { useUser } from "@/lib/useUser";
import { Alert, Box, Button, ButtonGroup, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

export default function LoginPage() {
    useUser({ redirectTo: "/activities/me", redirectOnLoggedIn: true });
    const router = useRouter()
    const [email, setEmail] = useState("");
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
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail as your username" />
        <TextField label="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
        <ButtonGroup variant="contained">
            <Button color="success" onClick={() => {
                if (email !== "" && password !== "") {
                    api.post("/user/login", { email, password }, {withCredentials: true})
                        .then(res => {
                            if(res.status === 200) {
                                router.push("/activities/me");
                            } else {
                                setErrorMessage(res.data)
                                setPassword("")
                            }
                        })
                } else {
                    setEmail("")
                    setPassword("")
                    setErrorMessage("Please input username and password")
                }
            }}>Login</Button>
            <Button color="error" onClick={() => {
                setEmail("")
                setPassword("")
            }}>Reset</Button>
        </ButtonGroup>
        <Button variant="contained" color="info" onClick={() => router.push("/activities/registry")}>Registry</Button>
    </Box>
}