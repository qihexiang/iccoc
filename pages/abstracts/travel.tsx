import useAlert from "@/components/useAlert";
import api from "@/lib/apiRequest";
import { useUser } from "@/lib/useUser";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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

  const [setAlertInfo, alertElement] = useAlert(6000);

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

  const confEnd = new Date("2023-10-23T00:00:00.000Z");
  const router = useRouter();

  const validatedChecker = (): { validated: true } | { validated: false, message: string } => {
    if (travelInfo.arrivalDate > travelInfo.departureDate) {
      return {
        validated: false, message: "Arrival date must earlier than departure date."
      }
    }

    if (travelInfo.arrivalNo === "" || travelInfo.departureNo === "") {
      return {
        validated: false, message: "Must fill arrival no. and departure no."
      }
    }

    return {
      validated: true
    }
  }

  const validated = validatedChecker()

  useEffect(() => {
    if (!validated.validated) {
      setAlertInfo({ color: "error", message: validated.message })
    } else {
      setAlertInfo({ color: "success", message: "" })
    }
  }, [travelInfo])

  useEffect(() => {
    api.get("/user/travel").then((res) => {
      console.log("GET")
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
        setAlertInfo({ color: "error", message: "Failed to get data. Please refresh the page." });
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
      {alertElement}
      <Box sx={{ display: "flex", gap: 1 }}>
        <DatePicker
          label={"Arrival date"}
          minDate={new Date()}
          maxDate={confEnd}
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
          disabled={!validated.validated}
          variant="contained"
          color="success"
          onClick={() => {
            api.put("/user/travel", travelInfo).then((res) => {
              if (res.status === 200) {
                setAlertInfo({ color: "success", message: "Saved" });
              } else {
                setAlertInfo({
                  color: "error",
                  message: "Failed to update travel information, please refresh and retry later."
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
