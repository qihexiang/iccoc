import Contact from "@/components/Contact";
import useAlert from "@/components/useAlert";
import api from "@/lib/apiRequest";
import { useUser } from "@/lib/useUser";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { UserType } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type EditablePersonalInfo = {
  name: string;
  institution: string;
  title: string;
  phoneNumber: string;
  userType: UserType;
};

export default function PersonalView() {
  const user = useUser({
    redirectTo: "/abstracts/login?redirectTo=/abstracts/personal",
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
  const [setAlertInfo, alertElement] = useAlert(6000);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Contact></Contact>
      <Typography variant="h6">Update your personal infomation</Typography>
      {alertElement}
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
                setAlertInfo({ color: "success", message: "Saved" });
              } else {
                setAlertInfo({
                  color: "error",
                  message:
                    "Failed to update personal information, please refresh and retry later.",
                });
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
