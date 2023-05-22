import api from "@/lib/apiRequest";
import { useUser } from "@/lib/useUser";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { withIronSessionSsr } from "iron-session/next";
import prisma from "@/lib/prisma";
import travel from "../api/user/travel";
import { sessionOptions } from "@/lib/session";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useRouter } from "next/router";
import { UserType } from "@prisma/client";

type EditablePersonalInfo = {
  name: string;
  institution: string;
  title: string;
  phoneNumber: string;
  userType: UserType;
};

export default function PersonalView() {
  const user = useUser({
    redirectTo: "/abstracts/login",
    redirectOnLoggedIn: false,
  });

  const [personalInfo, setPersonalInfo] = useState<EditablePersonalInfo>({
    name: "",
    institution: "",
    title: "",
    phoneNumber: "",
    userType: UserType.FACULTY as UserType,
  });
  const updatePersonalInfo = (patch: Partial<typeof personalInfo>) => {
    setPersonalInfo({ ...personalInfo, ...patch });
  };

  const confBegin = new Date("2023-10-20T00:00:00.000Z");
  const router = useRouter();

  useEffect(() => {
    if (user !== undefined) {
      const { name, institution, phoneNumber, title, userType } = user;
      setPersonalInfo({ name, institution, phoneNumber, title, userType });
    }
  }, [user]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h6">Update your travel infomation</Typography>
      <TextField
        label="Name"
        value={personalInfo.name}
        onChange={(e) => updatePersonalInfo({ name: e.target.value })}
      ></TextField>
      <TextField
        label="Institution"
        value={personalInfo.institution}
        onChange={(e) => updatePersonalInfo({ institution: e.target.value })}
      ></TextField>
      <TextField
        label="Title"
        value={personalInfo.title}
        onChange={(e) => updatePersonalInfo({ title: e.target.value })}
      ></TextField>
      <TextField
        label="Phone number"
        value={personalInfo.phoneNumber}
        onChange={(e) => updatePersonalInfo({ phoneNumber: e.target.value })}
      ></TextField>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Typography variant="subtitle1">Type: </Typography>
        <Select
          value={personalInfo.userType}
          onChange={(e) =>
            updatePersonalInfo({ userType: e.target.value as UserType })
          }
        >
          <MenuItem value={UserType.FACULTY}>Faculty</MenuItem>
          <MenuItem value={UserType.STUDENT}>Student</MenuItem>
        </Select>
      </Box>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            api.put("/user", personalInfo).then((res) => {
              if (res.status === 200) {
                const { name, institution, phoneNumber, title, userType } =
                  res.data;
                setPersonalInfo({
                  name,
                  institution,
                  phoneNumber,
                  title,
                  userType,
                });
                alert("Saved");
              } else {
                alert(
                  "Failed to update personal information, please refresh and retry later."
                );
              }
            });
          }}
        >
          Save
        </Button>
        <Button
          variant="contained"
          color="info"
          onClick={() => {
            router.push("/abstracts/me");
          }}
        >
          Go back
        </Button>
      </Box>
    </Box>
  );
}
