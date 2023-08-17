import api from "@/lib/apiRequest";
import Head from "next/head";
import { useUser } from "@/lib/useUser";
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useAlert from "@/components/useAlert";
import Contact from "@/components/Contact";

export default function LoginPage() {
  useUser({ redirectTo: "/abstracts/me", redirectOnLoggedIn: true });
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [errorMessage, setErrorMessage] = useState<string | undefined>(
  //   undefined
  // );
  const [setAlertInfo, alertElement] = useAlert(6000);
  useEffect(() => {
    if (router.query["registered"] !== undefined) {
      setEmail(router.query["registered"] as string);
      setAlertInfo({
        color: "success",
        message: `Account ${router.query["registered"]} registry successfully, please login.`,
      });
    }
  }, [router, setAlertInfo]);
  return (
    <>
      <Head>
        <title>Login - ICCOC2023</title>
      </Head>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Contact></Contact>
        <Box>
          <Typography variant="h6">Login</Typography>
        </Box>
        {alertElement}
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail as your username"
        />
        <TextField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
        />
        <ButtonGroup variant="contained">
          <Button
            color="success"
            onClick={() => {
              if (email !== "" && password !== "") {
                api
                  .post(
                    "/user/login",
                    { email, password },
                    { withCredentials: true }
                  )
                  .then((res) => {
                    if (res.status === 200) {
                      router.push("/abstracts/me");
                    } else {
                      setAlertInfo({
                        color: "error",
                        message: "Failed to login, please retry.",
                      });
                      setPassword("");
                    }
                  });
              } else {
                setEmail("");
                setPassword("");
                setAlertInfo({
                  color: "error",
                  message: "Both username and password must be input",
                });
              }
            }}
          >
            Login
          </Button>
          <Button
            color="error"
            onClick={() => {
              setEmail("");
              setPassword("");
            }}
          >
            Reset
          </Button>
        </ButtonGroup>
        <Button
          variant="contained"
          color="info"
          onClick={() => router.push("/abstracts/registration")}
        >
          Registration
        </Button>
      </Box>
    </>
  );
}
