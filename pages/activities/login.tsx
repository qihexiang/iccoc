import { Box, Button, ButtonGroup, FormControl, FormHelperText, Input, InputLabel, Paper, TextField, Typography } from "@mui/material";
import { LoginStatusStorage } from "@/pages/_app";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Submit() {
    const loginStatus = useContext(LoginStatusStorage)
    const router = useRouter()
    useEffect(() => {
        if (loginStatus.state !== null) {
            router.push("/activities/submit")
        } else {
            document.title = "Login"
        }
    })
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    return <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <Box>
            <Typography variant="h6">Login</Typography>
        </Box>
        <TextField value={username} onChange={(e) => setUsername(e.target.value)} placeholder="E-mail as your username" />
        <TextField value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
        <ButtonGroup variant="contained">
            <Button color="success" onClick={() => {
                if (username !== "" && password !== "") {
                    loginStatus.login({
                        username: username,
                        accessToken: password,
                        authToken: password
                    })
                } else {
                    setUsername("")
                    setPassword("")
                    alert("Please input username and password")
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