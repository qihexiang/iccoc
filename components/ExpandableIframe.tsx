import { Button } from "@mui/material";
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
        <>
          <Button color="error" onClick={() => setExpand(false)}>
            <Close></Close>
          </Button>
          <iframe {...iframeProps}></iframe>
        </>
      ) : (
        <Button color="primary" onClick={() => setExpand(true)}>
          {buttonName}
        </Button>
      )}
    </Box>
  );
}
