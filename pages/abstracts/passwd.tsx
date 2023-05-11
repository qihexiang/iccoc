import api from "@/lib/apiRequest";
import { useUser } from "@/lib/useUser";
import { Button, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { passwordStrength } from "check-password-strength";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

export default function PasswdView() {
  const user = useUser({
    redirectTo: "/abstracts/login ",
    redirectOnLoggedIn: false,
  });
  const [newPassword, setNewPassword] = useState("");
  const passwordNotTooWeak =
    newPassword === "" || passwordStrength(newPassword).id !== 0;
  const [confirmPassword, setConfirmPassword] = useState("");
  const passwordNotMatch = confirmPassword !== newPassword;
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Reset password - ICCOC2023</title>
      </Head>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography variant="h6">Reset password for {user?.email}</Typography>
        <TextField
          label={"Password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Set a password"
          type="password"
          error={!passwordNotTooWeak}
          helperText={passwordNotTooWeak ? "" : "Too weak"}
        />
        <TextField
          label={"Confirm password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
          error={passwordNotMatch}
          helperText={passwordNotMatch ? "Doesn't match" : ""}
          type="password"
        />
        <Button
          variant="contained"
          color="error"
          disabled={passwordNotMatch || !passwordNotTooWeak}
          onClick={() => {
            api
              .put("/user/passwd", {
                password: newPassword,
              })
              .then((res) => {
                if (res.status === 200) {
                  alert("Successfully updated your password");
                  router.push("/abstracts/me");
                } else {
                  alert(res.data.message ?? "Unknown error");
                }
              });
          }}
        >
          Reset Password
        </Button>
      </Box>
    </>
  );
}
