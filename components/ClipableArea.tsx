import { Box, Button, Card, CardActions, Typography } from "@mui/material";
import useAlert from "./useAlert";

export default function ClipaleArea({ content }: { content: string }) {
  const [setInformation, alertElement] = useAlert(6000);
  return (
    <>
      {alertElement}
      <Card variant="outlined">
        <Box component={"div"} style={{ overflowX: "scroll", padding: 4 }}>
          <Typography component={"pre"} variant="body2">
            {content}
          </Typography>
        </Box>
        <CardActions>
          <Button
            onClick={() =>
              window.navigator.clipboard
                .writeText(content)
                .then(() =>
                  setInformation({
                    color: "success",
                    message: "Text successfully copied into your clipboard.",
                  })
                )
                .catch(() =>
                  setInformation({
                    color: "warning",
                    message:
                      "Unable to copy the text into your clipboard. Please copy it manually.",
                  })
                )
            }
          >
            Copy
          </Button>
        </CardActions>
      </Card>
    </>
  );
}
