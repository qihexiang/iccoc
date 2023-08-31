"use client";

import useAlert from "@/components/useAlert";
import { TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginAdmin() {
  const router = useRouter();
  const [setInformation, alertComponent] = useAlert(6000);
  const [username, setUsername] = useState("");
  const [totp, setTotp] = useState("");
  return (
    <div
      className="flex flex-col items-center gap-1"
    >
      {alertComponent}
      <h1>Login to Admin</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Email as username"
      ></input>
      <input
        type="password"
        value={totp}
        onChange={(e) => setTotp(e.target.value)}
        placeholder="Input your token here"
      ></input>
      <button
        className="btn safe"
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
      </button>
    </div>
  );
}
