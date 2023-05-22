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
  FormControlLabel,
  FormLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useRouter } from "next/router";
import { Prisma } from "@prisma/client";

type EditableStatus = {
  needHotelBookingHelp: boolean;
} & {
  checkinDate: Date;
  checkoutDate: Date;
  standardRooms: number;
  kingRooms: number;
  location: string;
};

export default function HotelView() {
  const user = useUser({
    redirectTo: "/abstracts/login",
    redirectOnLoggedIn: false,
  });

  const [hotelInfo, setHotelInfo] = useState<EditableStatus>({
    needHotelBookingHelp: false,
    checkinDate: new Date(),
    checkoutDate: new Date(),
    standardRooms: 0,
    kingRooms: 0,
    location: "Guizhou Hotel",
  });
  const updateHotelInfo = (patch: Partial<typeof hotelInfo>) => {
    setHotelInfo({ ...hotelInfo, ...patch });
  };

  const confBegin = new Date("2023-10-20T00:00:00.000Z");
  const router = useRouter();

  useEffect(() => {
    api.get("/user/hotelbooking").then((res) => {
      if (res.status < 400) {
        if (res.data !== null) {
          const {
            checkinDate,
            checkoutDate,
            standardRooms,
            kingRooms,
            location,
          } = res.data;
          setHotelInfo({
            needHotelBookingHelp: true,
            checkinDate: new Date(checkinDate),
            checkoutDate: new Date(checkoutDate),
            standardRooms,
            kingRooms,
            location,
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
      <Box>
        <FormControlLabel
          label={"I need help of hotel booking"}
          control={
            <Checkbox
              checked={hotelInfo.needHotelBookingHelp}
              onChange={(e) => {
                if (e.target.checked) {
                  updateHotelInfo({ needHotelBookingHelp: true });
                } else {
                  api.delete("/user/hotelbooking").then((res) => {
                    if (res.status < 400) {
                      updateHotelInfo({ needHotelBookingHelp: false });
                    } else {
                      alert(
                        "Failed to cancel the request, please refresh the page and retry"
                      );
                    }
                  });
                }
              }}
            ></Checkbox>
          }
        ></FormControlLabel>
      </Box>
      <Typography variant="h6">Your hotel booking infomation</Typography>
      <Box sx={{ display: "flex", gap: 1 }}>
        <DatePicker
          disabled={!hotelInfo.needHotelBookingHelp}
          label={"checkin date"}
          minDate={new Date()}
          maxDate={confBegin}
          value={hotelInfo.checkinDate}
          onChange={(value) =>
            updateHotelInfo({ checkinDate: value ?? new Date() })
          }
        ></DatePicker>
        <DatePicker
          disabled={!hotelInfo.needHotelBookingHelp}
          minDate={hotelInfo.checkinDate}
          label={"checkout date"}
          value={hotelInfo.checkoutDate}
          onChange={(value) =>
            updateHotelInfo({ checkoutDate: value ?? new Date() })
          }
        ></DatePicker>
      </Box>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Typography variant="subtitle1">Number of standard rooms</Typography>
        <TextField
          disabled={!hotelInfo.needHotelBookingHelp}
          type="number"
          value={hotelInfo.standardRooms}
          onChange={(e) =>
            updateHotelInfo({ standardRooms: Number(e.target.value) })
          }
          inputProps={{
            step: 1,
            min: 0,
            type: "number",
          }}
        ></TextField>
      </Box>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Typography variant="subtitle1">Number of king rooms</Typography>
        <TextField
          disabled={!hotelInfo.needHotelBookingHelp}
          type="number"
          value={hotelInfo.kingRooms}
          onChange={(e) =>
            updateHotelInfo({ kingRooms: Number(e.target.value) })
          }
          inputProps={{
            step: 1,
            min: 0,
            type: "number",
          }}
        ></TextField>
      </Box>
      <Typography variant="subtitle1">Select a hotel</Typography>
      <Select
        disabled={!hotelInfo.needHotelBookingHelp}
        value={hotelInfo.location}
        onChange={(e) => updateHotelInfo({ location: e.target.value })}
      >
        <MenuItem value={"Guizhou Hotel"}>Guizhou Hotel</MenuItem>
        <MenuItem value={"Guest House of BUCT"}>Guest House of BUCT</MenuItem>
      </Select>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          disabled={!hotelInfo.needHotelBookingHelp}
          variant="contained"
          color="success"
          onClick={() => {
            const {
              checkinDate,
              checkoutDate,
              standardRooms,
              kingRooms,
              location,
            } = hotelInfo;
            api
              .put("/user/hotelbooking", {
                checkinDate,
                checkoutDate,
                standardRooms,
                kingRooms,
                location,
              })
              .then((res) => {
                if (res.status === 200) {
                  const {
                    checkinDate,
                    checkoutDate,
                    standardRooms,
                    kingRooms,
                    location,
                  } = res.data;
                  setHotelInfo({
                    needHotelBookingHelp: true,
                    checkinDate: new Date(checkinDate),
                    checkoutDate: new Date(checkoutDate),
                    standardRooms,
                    kingRooms,
                    location,
                  });
                  alert("Saved");
                } else {
                  alert(
                    "Failed to update hotel booking information, please refresh and retry later."
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
