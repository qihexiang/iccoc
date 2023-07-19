import useAlert from "@/components/useAlert";
import api from "@/lib/apiRequest";
import { useUser } from "@/lib/useUser";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { z } from "zod";

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
  const [setAlertInfo, alertElement] = useAlert(6000);

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

  const confEnd = new Date("2023-10-23T00:00:00.000Z");
  const router = useRouter();

  useEffect(() => {
    api
      .get("/user/hotelbooking")
      .catch((err) => ({ status: 500, data: "Network Error" }))
      .then((res) => {
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
          setAlertInfo({
            color: "error",
            message: "Failed to get data. Please refresh the page.",
          });
        }
      });
  }, []);

  const validatedChecker = ():
    | { validated: true }
    | { validated: false; message: string } => {
    if (!hotelInfo.needHotelBookingHelp) {
      return {
        validated: true,
      };
    }

    if (hotelInfo.checkoutDate < hotelInfo.checkinDate) {
      return {
        validated: false,
        message: "Please set checkin date before checkout date",
      };
    }

    if (
      hotelInfo.checkinDate <
      new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
    ) {
      return {
        validated: false,
        message: "You have to select a date after today",
      };
    }

    if (hotelInfo.kingRooms <= 0 && hotelInfo.standardRooms <= 0) {
      return {
        validated: false,
        message:
          "Please set at least one room if you need hotel booking service.",
      };
    }

    return {
      validated: true,
    };
  };

  const validated = validatedChecker();

  useEffect(() => {
    if (!validated.validated) {
      setAlertInfo({ color: "error", message: validated.message });
    } else {
      setAlertInfo({ color: "success", message: "" });
    }
  }, [hotelInfo]);

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
                      setAlertInfo({
                        color: "error",
                        message:
                          "Failed to cancel the request, please refresh the page and retry",
                      });
                    }
                  });
                }
              }}
            ></Checkbox>
          }
        ></FormControlLabel>
      </Box>
      <Typography variant="h6">Your hotel booking infomation</Typography>
      {alertElement}
      <Box sx={{ display: "flex", gap: 1 }}>
        <DatePicker
          disabled={!hotelInfo.needHotelBookingHelp}
          label={"checkin date"}
          minDate={new Date()}
          maxDate={confEnd}
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
          disabled={!hotelInfo.needHotelBookingHelp || !validated.validated}
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
                  setAlertInfo({ color: "success", message: "Saved" });
                } else {
                  setAlertInfo({
                    color: "error",
                    message:
                      "Failed to update hotel booking information, please refresh and retry later.",
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
