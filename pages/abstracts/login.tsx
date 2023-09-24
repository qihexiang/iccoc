import Contact from "@/components/Contact";
import { H2, LI, P } from "@/components/TypoElement";
import useAlert from "@/components/useAlert";
import api from "@/lib/apiRequest";
import { useUser } from "@/lib/useUser";
import {
  Box,
  Button,
  ButtonGroup,
  Link,
  TextField,
  Typography
} from "@mui/material";
import { Container } from "@mui/system";
import Head from "next/head";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const redirectTo = useSearchParams()?.get("redirectTo") ?? undefined
  useUser({ redirectTo: redirectTo ?? "/abstracts/me", redirectOnLoggedIn: true });
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <Container>
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
                      router.push(redirectTo ?? "/abstracts/me");
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
      <H2>Abstract Submission and Deadlines:</H2>
      <ul>
        <LI>
          Abstract Submission Deadline: Sept. 30<sup>th</sup>, 2023
        </LI>
        <LI>
          Registration Deadline: Sept. 30<sup>th</sup>, 2023
        </LI>
        <LI>
          Conference Date: Oct. 20<sup>th</sup>-23<sup>rd</sup>, 2023
        </LI>
      </ul>
      <H2>Please observe the following guidelines:</H2>
      <ul>
        <LI>We accept abstracts in PDF format only.</LI>
        <LI>The language of the abstracts is English.</LI>
        <LI>
          The abstract has two parts: 1. Graphic summary and 2. Full abstract.
        </LI>
        <LI>The full abstract should fit on one A4 page (210 x 297 mm).</LI>
        <LI>Please use Times New Roman 12 point font.</LI>
        <LI>Please follow the layout and instructions below.</LI>
      </ul>
      <P>
        Abstracts can be prepared according to the provided templates and submit
        it on line which will be available soon.
      </P>
      <Link href="/Template.docx">Abstract_doc Template</Link>
      <H2>Information for Poster Presenters:</H2>
      <P>
        The poster (A0 size) should be designed to fit the space of 85 cm width
        x 120 cm height. Pushpins or other related materials will be provided on
        site for your convenience. Poster space will be allocated by the number
        on the poster board in the conference hall.
      </P>
      <P>
        Taking photograph of his/her poster without permission is strictlly
        prohibited!
      </P>
    </Container>
  );
}
