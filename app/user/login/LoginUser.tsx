"use client";

import { h2 } from "@/components/TypoElement";
import useAlert from "@/components/useAlert";
import { div, button, TextField } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginUser() {
  const router = useRouter();
  const [setInformation, alertComponent] = useAlert(6000);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      }}
    >
      {alertComponent}
      <h2>Login to Admin</h2>
      <TextField
        label="Username"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email as username"
      ></TextField>
      <TextField
        label="Password"
        type={"password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Input your password here"
      ></TextField>
      <button
        variant="contained"
        color="success"
        onClick={() => {
          axios.post("/api/v2/user/login", {
            email,
            password,
          }).then((res) => {
            setInformation({
              color: "success",
              message: "Login success.",
            });
            setEmail("");
            router.push("/user");
          }).catch(() => {
            setInformation({
              color: "error",
              message: "Failed to registry",
            });
          })
            .finally(() => setPassword(""));
        }}
      >
        Login
      </button>
    </div>
  );
}
