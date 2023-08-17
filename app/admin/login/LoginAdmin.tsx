"use client";

import { H1 } from "@/components/TypoElement";
import useAlert from "@/components/useAlert";
import { Box, Button, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginAdmin() {
  const router = useRouter();
  const [setInformation, alertComponent] = useAlert(6000);
  const [username, setUsername] = useState("");
  const [totp, setTotp] = useState("");
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      }}
    >
      {alertComponent}
      <H1>Login to Admin</H1>
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Email as username"
      ></TextField>
      <TextField
        label="Token"
        value={totp}
        onChange={(e) => setTotp(e.target.value)}
        placeholder="Input your token here"
      ></TextField>
      <Button
        variant="contained"
        color="success"
        onClick={() => {
          fetch("/api/v2/admin/login", {
            method: "POST",
            body: JSON.stringify({
              username,
              totp,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }).then((res) => {
            if (res.ok) {
              setInformation({
                color: "success",
                message: "Login success.",
              });
              setUsername("");
              router.push("/admin");
            } else {
              setInformation({
                color: "error",
                message: "Failed to registry",
              });
            }
            setTotp("");
          });
        }}
      >
        Login
      </Button>
    </Box>
  );
}
