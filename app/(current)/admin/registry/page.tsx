"use client";

import { Box, Button, TextField } from "@mui/material";
import { H1, P } from "@/components/TypoElement";
import { useEffect, useState } from "react";
import base32Encode from "base32-encode";
import { QRCodeCanvas } from "qrcode.react";
import totpGenerator from "totp-generator";
import useAlert from "@/components/useAlert";
import { useRouter } from "next/navigation";

const tEncoder = new TextEncoder();

function useTotp(secret: string) {
  const [current, setCurrent] = useState("------");
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(totpGenerator(secret));
    }, 1000);
    return () => clearInterval(interval);
  }, [secret]);
  return current;
}

export default function AddAdmin() {
  const [setInformation, alertComponent] = useAlert(6000);
  const [username, setUsername] = useState("");
  const [secret, setSecret] = useState("");
  const encodedSecret = base32Encode(tEncoder.encode(secret), "RFC4648");
  const fullTotpURL = `otpauth://totp/${username}?secret=${encodedSecret}`;
  const totp = useTotp(encodedSecret);
  const router = useRouter();
  return (
<div className="flex flex-col items-center gap-1">
      {alertComponent}
      <h1>Add an administrator</h1>
      <input type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Email as username"
      ></input>
      <input
        type={"password"}
        value={secret}
        onChange={(e) => setSecret(e.target.value)}
        placeholder="Set secret here"
      ></input>
      <QRCodeCanvas value={fullTotpURL}></QRCodeCanvas>
      <p className="typoblock">Current code should be: {totp}</p>
      <button
        className="btn safe"
        onClick={() => {
          fetch("/api/v2/admin/registry", {
            method: "POST",
            body: JSON.stringify({
              username,
              secret: encodedSecret,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }).then((res) => {
            if (res.ok) {
              setInformation({
                color: "success",
                message: "Registry successfully",
              });
              setUsername("");
              router.push("/admin/login")
            } else {
              setInformation({
                color: "error",
                message: "Failed to registry",
              });
            }
            setSecret("");
          })
        }}
      >
        Registry
      </button>
      <button className="btn info" onClick={() => router.push("/admin/login")}>
        Go back to login
      </button>
    </div>
  );
}
