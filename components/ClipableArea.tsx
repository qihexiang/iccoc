import { Box, Button, Card, CardActions, Typography } from "@mui/material";

export default function ClipaleArea({ content }: { content: string }) {
  return (
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
                alert("Text successfully copied into your clipboard.")
              )
              .catch(() =>
                alert(
                  "Unable to copy the text into your clipboard. Please copy it manually."
                )
              )
          }
        >
          Copy
        </Button>
      </CardActions>
    </Card>
  );
}
