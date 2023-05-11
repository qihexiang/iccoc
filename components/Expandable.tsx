import { Close } from "@mui/icons-material";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";

export default function Expandable(props: {
  buttonName: string;
  autoExpand: boolean;
  title: string;
  children: JSX.Element | JSX.Element[] | null;
}) {
  const { buttonName, autoExpand, title } = props;
  const [expand, setExpand] = useState(autoExpand);
  return (
    <Box>
      {expand ? (<Box display={"flex"} flexDirection={"column"} gap={1}>
        <Box display={"flex"} gap={1}>
          <Button
            color="error"
            variant="contained"
            onClick={() => setExpand(false)}
          >
            <Close></Close>
          </Button>
          <Typography variant="h6">{title}</Typography>
        </Box>
        {props.children}
      </Box>
      ) : (
        <Button
          color="primary"
          variant="contained"
          onClick={() => setExpand(true)}
        >
          {buttonName}
        </Button>
      )
      }
    </Box >
  );
}
