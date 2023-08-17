import api from "@/lib/apiRequest";
import Head from "next/head";
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { passwordStrength } from "check-password-strength";
import router from "next/router";
import { useState } from "react";
import { UserType } from "@prisma/client";
import useAlert from "@/components/useAlert";

export default function UserRegistry() {
  const defaultValue = {
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    institution: "",
    title: "",
    phoneNumber: "",
    userType: UserType.FACULTY as UserType,
  };
  const [registryInfo, setRegistryInfo] = useState(defaultValue);
  const [waiting, setWaiting] = useState(false);
  const [setAlertInfo, alertElement] = useAlert(6000);
  const passwordNotTooWeak =
    registryInfo.password === "" ||
    passwordStrength(registryInfo.password).id !== 0;
  const passwordNotMatch =
    registryInfo.password !== "" &&
    registryInfo.confirmPassword !== "" &&
    registryInfo.password !== registryInfo.confirmPassword;
  const updateRegistryInfo = (patch: Partial<typeof defaultValue>) => {
    setRegistryInfo({ ...registryInfo, ...patch });
  };
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
        <Box>
          <Typography variant="h6">Registry a new account</Typography>
        </Box>
        {alertElement}
        <Box
          display={"flex"}
          gap={1}
          flexWrap={"wrap"}
          justifyContent={"center"}
        >
          <TextField
            label={"Name (your full name)"}
            value={registryInfo.name}
            onChange={(e) => updateRegistryInfo({ name: e.target.value })}
            placeholder="Your name"
          />
          <TextField
            label="Email (as your account name.)"
            value={registryInfo.email}
            onChange={(e) => updateRegistryInfo({ email: e.target.value })}
            placeholder="E-mail as your username"
          />
          <TextField
            label="Phone number"
            value={registryInfo.phoneNumber}
            onChange={(e) =>
              updateRegistryInfo({ phoneNumber: e.target.value })
            }
            placeholder="Phone number"
          />
        </Box>
        <Typography variant="overline">
          Password length must be greater than 6 characters, includes at least
          two of uppercase, lowercase, symbol or number character.
        </Typography>
        <Box
          display={"flex"}
          gap={1}
          flexWrap={"wrap"}
          justifyContent={"center"}
        >
          <TextField
            label={"Password"}
            value={registryInfo.password}
            onChange={(e) => updateRegistryInfo({ password: e.target.value })}
            placeholder="Set a password"
            type="password"
            error={!passwordNotTooWeak}
            helperText={passwordNotTooWeak ? "" : "Too weak"}
          />
          <TextField
            label={"Confirm password"}
            value={registryInfo.confirmPassword}
            onChange={(e) =>
              updateRegistryInfo({
                confirmPassword: e.target.value,
              })
            }
            placeholder="Confirm your password"
            error={passwordNotMatch}
            helperText={passwordNotMatch ? "Doesn't match" : ""}
            type="password"
          />
        </Box>
        <Box
          display={"flex"}
          gap={1}
          flexWrap={"wrap"}
          justifyContent={"center"}
        >
          <TextField
            label={"Institution"}
            value={registryInfo.institution}
            onChange={(e) =>
              updateRegistryInfo({ institution: e.target.value })
            }
            placeholder="Your institution"
          />
          <TextField
            label={"Job title"}
            value={registryInfo.title}
            onChange={(e) => updateRegistryInfo({ title: e.target.value })}
            placeholder="Your job title"
          />
          <FormControl>
            <InputLabel>Registry as a</InputLabel>
            <Select
              label={"Registry as a"}
              value={registryInfo.userType}
              onChange={(e) =>
                updateRegistryInfo({ userType: e.target.value as UserType })
              }
            >
              <MenuItem value={UserType.FACULTY}>Faculty</MenuItem>
              <MenuItem value={UserType.STUDENT}>Student</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <ButtonGroup variant="contained">
          <Button
            disabled={
              registryInfo.password === "" ||
              registryInfo.confirmPassword === "" ||
              passwordNotMatch ||
              !passwordNotTooWeak ||
              waiting
            }
            color="primary"
            onClick={() => {
              setWaiting(true);
              const { confirmPassword, ...toSend } = registryInfo;
              api
                .post("/user/registry", toSend)
                .then((res) => {
                  if (res.status === 200) {
                    router.push(
                      `/abstracts/login?registered=${registryInfo.email}`
                    );
                  } else {
                    setAlertInfo({ color: "error", message: res.data });
                    // alert(res.data)
                    // setRegistryInfo(defaultValue);
                  }
                })
                .finally(() => {
                  setWaiting(false);
                });
            }}
          >
            {waiting ? <CircularProgress /> : "Registration"}
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
          onClick={() => router.push("/abstracts/login")}
        >
          Go to login
        </Button>
      </Box>
    </>
  );
}
