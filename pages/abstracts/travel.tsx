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
  Checkbox,
  FormControl,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useRouter } from "next/router";

type EditableTravelInfo = {
  arrivalDate: Date;
  arrivalNo: string;
  departureDate: Date;
  departureNo: string;
  attendVisit: boolean;
};

export default function TravelView() {
  const user = useUser({
    redirectTo: "/abstracts/login",
    redirectOnLoggedIn: false,
  });

  const [travelInfo, setTravelInfo] = useState<EditableTravelInfo>({
    arrivalDate: new Date(),
    arrivalNo: "",
    departureDate: new Date(),
    departureNo: "",
    attendVisit: false,
  });
  const updateTravelInfo = (patch: Partial<typeof travelInfo>) => {
    setTravelInfo({ ...travelInfo, ...patch });
  };

  const confBegin = new Date("2023-10-20T00:00:00.000Z");
  const router = useRouter();

  useEffect(() => {
    api.get("/user/travel").then((res) => {
      if (res.status < 400) {
        if (res.data !== null) {
          const {
            arrivalDate,
            arrivalNo,
            departureDate,
            departureNo,
            attendVisit,
          } = res.data;
          setTravelInfo({
            arrivalNo,
            departureNo,
            arrivalDate: new Date(arrivalDate),
            departureDate: new Date(departureDate),
            attendVisit,
          });
        }
      } else {
        alert("Failed to get data. Please refresh the page.");
      }
    });
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h6">Your travel infomation</Typography>
      <Box sx={{ display: "flex", gap: 1 }}>
        <DatePicker
          label={"Arrival date"}
          minDate={new Date()}
          maxDate={confBegin}
          value={travelInfo.arrivalDate}
          onChange={(value) =>
            updateTravelInfo({ arrivalDate: value ?? new Date() })
          }
        ></DatePicker>
        <TextField
          label={"Arrival flight number/train number"}
          value={travelInfo.arrivalNo}
          onChange={(e) => updateTravelInfo({ arrivalNo: e.target.value })}
        ></TextField>
      </Box>
      <Box sx={{ display: "flex", gap: 1 }}>
        <DatePicker
          minDate={travelInfo.arrivalDate}
          label={"Departure date"}
          value={travelInfo.departureDate}
          onChange={(value) =>
            updateTravelInfo({ departureDate: value ?? new Date() })
          }
        ></DatePicker>
        <TextField
          label={"Departure flight number/train number"}
          value={travelInfo.departureNo}
          onChange={(e) => updateTravelInfo({ departureNo: e.target.value })}
        ></TextField>
      </Box>
      <FormControlLabel
        label="Attend visit on October 23"
        control={
          <Checkbox
            checked={travelInfo.attendVisit}
            onChange={(e) =>
              updateTravelInfo({ attendVisit: e.target.checked })
            }
          ></Checkbox>
        }
      ></FormControlLabel>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            api.put("/user/travel", travelInfo).then((res) => {
              if (res.status === 200) {
                const {
                  arrivalDate,
                  arrivalNo,
                  departureDate,
                  departureNo,
                  attendVisit,
                } = res.data;
                setTravelInfo({
                  arrivalNo,
                  departureNo,
                  arrivalDate: new Date(arrivalDate),
                  departureDate: new Date(departureDate),
                  attendVisit,
                });
                alert("Saved");
              } else {
                alert(
                  "Failed to update travel information, please refresh and retry later."
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
