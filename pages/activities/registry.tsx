import api from "@/lib/apiRequest";
import { Box, Button, ButtonGroup, CircularProgress, TextField, Typography } from "@mui/material";
import { passwordStrength } from "check-password-strength";
import router from "next/router";
import { useState } from "react";
import { z } from "zod";

const registrySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default function UserRegistry() {
  const defaultValue = {
    username: "",
    password: "",
    confirmPassword: "",
  };
  const [registryInfo, setRegistryInfo] = useState(defaultValue);
  const [waiting, setWaiting] = useState(false);
  const passwordNotTooWeak =
    registryInfo.password !== "" &&
    passwordStrength(registryInfo.password).id !== 0;
  const passwordNotMatch =
    registryInfo.password !== "" &&
    registryInfo.confirmPassword !== "" &&
    registryInfo.password !== registryInfo.confirmPassword;
  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <Box>
        <Typography variant="h6">Registry a new account</Typography>
      </Box>
      <TextField
        label="Email (as your account name.)"
        value={registryInfo.username}
        onChange={(e) =>
          setRegistryInfo({ ...registryInfo, username: e.target.value })
        }
        placeholder="E-mail as your username"
      />
      <Typography variant="overline">
        Password length must be greater than 6 characters, includes at least two
        of uppercase, lowercase, symbol or number character.
      </Typography>
      <TextField
        label={"Password"}
        value={registryInfo.password}
        onChange={(e) =>
          setRegistryInfo({ ...registryInfo, password: e.target.value })
        }
        placeholder="Set a password"
        type="password"
        error={!passwordNotTooWeak}
        helperText={passwordNotTooWeak ? "" : "Too weak"}
      />
      <TextField
        label={"Confirm password"}
        value={registryInfo.confirmPassword}
        onChange={(e) =>
          setRegistryInfo({ ...registryInfo, confirmPassword: e.target.value })
        }
        placeholder="Confirm your password"
        error={passwordNotMatch}
        helperText={passwordNotMatch ? "Doesn't match" : ""}
        type="password"
      />
      <ButtonGroup variant="contained">
        <Button
          disabled={
            registryInfo.password === "" ||
            registryInfo.confirmPassword === "" ||
            passwordNotMatch ||
            !passwordNotTooWeak ||
            waiting
          }
          color="success"
          onClick={() => {
            setWaiting(true);
            api
              .post("/user/registry", {
                email: registryInfo.username,
                password: registryInfo.password,
              })
              .then((res) => {
                if (res.status === 200) {
                  alert("Account registry successfully, please login.");
                  router.push("/activities/login");
                } else {
                  alert("Failed to registry, please retry later.");
                  setRegistryInfo(defaultValue);
                }
              })
              .finally(() => {
                setWaiting(false);
              });
          }}
        >
          {waiting ? <CircularProgress /> : "Registry"}
        </Button>
        <Button
          disabled={waiting}
          color="error"
          onClick={() => {
            setRegistryInfo(defaultValue);
          }}
        >
          Reset
        </Button>
      </ButtonGroup>
      <Button
        variant="contained"
        color="info"
        onClick={() => router.push("/activities/login")}
      >
        Go to login
      </Button>
    </Box>
  );
}
