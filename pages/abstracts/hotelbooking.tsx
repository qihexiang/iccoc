import Contact from "@/components/Contact";
import useAlert from "@/components/useAlert";
import api from "@/lib/apiRequest";
import { useUser } from "@/lib/useUser";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import axios from "axios";
import { update } from "lodash";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

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

  const hotelList = useMemo(
    () => [
      {
        name: "Guizhou Hotel",
        notice: "(Standard room 658 CNY incluidng one breakfast)",
      },
      {
        name: "Guest House of BUCT",
        notice: "(Standard twin room 380 CNY including two breakfast)",
      },
    ],
    []
  );

  const user = useUser({
    redirectTo: "/abstracts/login?redirectTo=/abstracts/hotelbooking",
    redirectOnLoggedIn: false,
  });

  const [bookBySelf, setBookHotelBySelf] = useState<boolean>(false);

  const [otherHotel, setOtherHotel] = useState<string | undefined>(undefined);

  const [hotelInfo, setHotelInfo] = useState<EditableStatus>({
    needHotelBookingHelp: false,
    checkinDate: new Date(),
    checkoutDate: new Date(),
    standardRooms: 0,
    kingRooms: 0,
    location: "Guizhou Hotel",
  });
  const updateHotelInfo = useCallback(
    (patch: Partial<typeof hotelInfo>) => {
      setHotelInfo((hotelInfo) => ({ ...hotelInfo, ...patch }));
    },
    [setHotelInfo]
  );

  useEffect(() => {
    if (otherHotel !== undefined) {
      updateHotelInfo({ location: otherHotel });
    } else {
      updateHotelInfo({ location: hotelList[0].name });
    }
  }, [otherHotel, updateHotelInfo, hotelList]);

  useEffect(() => {
    if (bookBySelf) {
      updateHotelInfo({ needHotelBookingHelp: false });
    } else {
      updateHotelInfo({
        location: hotelList.find(({name}) => hotelInfo.location == name) !== undefined
          ? hotelInfo.location
          : hotelList[0].name,
      });
      setOtherHotel(undefined);
    }
  }, [bookBySelf, hotelInfo.location, hotelList, updateHotelInfo]);

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
              bookBySelf,
            } = res.data;
            setHotelInfo({
              needHotelBookingHelp: !bookBySelf,
              checkinDate: new Date(checkinDate),
              checkoutDate: new Date(checkoutDate),
              standardRooms,
              kingRooms,
              location,
            });
            setBookHotelBySelf(bookBySelf);
            if (!hotelList.includes(location)) {
              setOtherHotel(location);
            }
          }
        } else {
          setAlertInfo({
            color: "error",
            message: "Failed to get data. Please refresh the page.",
          });
        }
      });
  }, [setAlertInfo, setOtherHotel, setHotelInfo, hotelList]);

  const validatedChecker = ():
    | { validated: true; message: undefined }
    | { validated: false; message: string } => {
    if (bookBySelf) {
      return {
        validated: true,
        message: undefined,
      };
    }
    if (!hotelInfo.needHotelBookingHelp) {
      return {
        validated: true,
        message: undefined,
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
      message: undefined,
    };
  };

  const validated = validatedChecker();

  useEffect(() => {
    if (!validated.validated) {
      setAlertInfo({ color: "error", message: validated.message });
    } else {
      setAlertInfo({ color: "success", message: "" });
    }
  }, [hotelInfo, setAlertInfo, validated.message, validated.validated]);

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
      <Box>
        <FormControlLabel
          label={"I book hotel by myself."}
          control={
            <Checkbox
              checked={bookBySelf}
              onChange={(e) => {
                setBookHotelBySelf(e.target.checked);
                updateHotelInfo({ needHotelBookingHelp: false });
              }}
            ></Checkbox>
          }
        ></FormControlLabel>
        <FormControlLabel
          label={"I need the conference organization to book hotel for me."}
          control={
            <Checkbox
              checked={hotelInfo.needHotelBookingHelp}
              onChange={(e) => {
                if (e.target.checked) {
                  setBookHotelBySelf(false);
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
        <Typography variant="subtitle1">
          Number of standard rooms (two beds in one room)
        </Typography>
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
      <Box display={"flex"} flexDirection={"row"} gap={1}>
        {hotelList.map(({name, notice}, idx) => (
          <FormControlLabel
            key={idx}
            label={<div>{name}<br></br>{notice}</div>}
            control={
              <Checkbox
                checked={name === hotelInfo.location}
                onChange={(e) => {
                  if (e.target.checked) {
                    updateHotelInfo({ location: name });
                    setOtherHotel(undefined);
                  }
                }}
              ></Checkbox>
            }
          ></FormControlLabel>
        ))}
        <Box display={"flex"} alignItems={"center"}>
          <FormControlLabel
            label={"other"}
            control={
              <>
                <Checkbox
                  disabled={hotelInfo.needHotelBookingHelp}
                  checked={otherHotel !== undefined}
                  onChange={(e) => {
                    if (e.target.checked) setOtherHotel("");
                    else setOtherHotel(undefined);
                  }}
                ></Checkbox>
              </>
            }
          ></FormControlLabel>
          <TextField
            disabled={hotelInfo.needHotelBookingHelp}
            value={otherHotel ?? ""}
            onChange={(e) => setOtherHotel(e.target.value)}
            placeholder="Input hotel you choose."
          ></TextField>
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          disabled={
            (!bookBySelf && !hotelInfo.needHotelBookingHelp) ||
            !validated.validated
          }
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
            axios
              .put("/api/user/hotelbooking", {
                checkinDate,
                checkoutDate,
                standardRooms,
                kingRooms,
                location,
                bookBySelf,
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
