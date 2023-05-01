import { Button, Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Box } from "@mui/system";
import { useState } from "react";

export default function ExpandableIframe(
  props: {
    buttonName: string;
    autoExpand: boolean;
  } & React.IframeHTMLAttributes<HTMLIFrameElement>
) {
  const { buttonName, autoExpand, ...iframeProps } = props;
  const [expand, setExpand] = useState(autoExpand);
  return (
    <Box>
      {expand ? (
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: 1 }}>
              <Typography variant="h6">Google Map</Typography>
              <Button color="error" variant="contained" onClick={() => setExpand(false)}>
                <Close></Close>
              </Button>
            </Box>
            <iframe {...iframeProps}></iframe>
          </CardContent>
        </Card>
      ) : (
        <Button color="primary" variant="contained" onClick={() => setExpand(true)}>
          {buttonName}
        </Button>
      )}
    </Box>
  );
}
