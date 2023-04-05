import { Box, Button, ButtonGroup, FormControl, InputLabel, TextField, Typography } from "@mui/material";
import router from "next/router";
import { useState } from "react";
import { passwordStrength } from "check-password-strength"

export default function UserRegistry() {
    const defaultValue = {
        username: "",
        password: "",
        confirmPassword: "",
    };
    const [registryInfo, setRegistryInfo] = useState(defaultValue)
    const passwordNotTooWeak = registryInfo.password !== "" && passwordStrength(registryInfo.password)  .id === 0
    const passwordNotMatch = registryInfo.password !== "" && registryInfo.confirmPassword !== "" && registryInfo.password !== registryInfo.confirmPassword
    return <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <Box>
            <Typography variant="h6">Registry a new account</Typography>
        </Box>
        <TextField value={registryInfo.username} onChange={(e) => setRegistryInfo({ ...registryInfo, username: e.target.value })} placeholder="E-mail as your username" />
        <Typography variant="overline">
            Password length must be greater than 6 characters, includes at least two of uppercase, lowercase, symbol or number character.
        </Typography>
        <TextField value={registryInfo.password} onChange={(e) => setRegistryInfo({ ...registryInfo, password: e.target.value })} placeholder="Set a password" type="password" error={passwordNotTooWeak} helperText={passwordNotTooWeak ? "Too weak" : ""}/>
        <TextField value={registryInfo.confirmPassword} onChange={(e) => setRegistryInfo({ ...registryInfo, confirmPassword: e.target.value })} placeholder="Confirm your password" error={passwordNotMatch} helperText={passwordNotMatch ? "Doesn't match" : ""} type="password" />
        <ButtonGroup variant="contained">
            <Button color="success">Registry</Button>
            <Button color="error" onClick={() => {
                setRegistryInfo(defaultValue)
            }}>Reset</Button>
        </ButtonGroup>
        <Button variant="contained" color="info" onClick={() => router.push("/activities/login")}>Go to login</Button>
    </Box>
}