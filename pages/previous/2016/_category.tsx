import { Button, Box } from "@mui/material";
import Link from "next/link";

export const routes = [
  ["Home", "/welcome"],
  ["Program", "/program"],
  ["General Info", "/general_info"],
  ["Speakers", "/speakers"],
  ["Registration", "/registration"],
  ["Visa Info", "/visa"],
  ["Accommodation", "/accommodation"],
];

export default function Category2016(props: {
  vertical: boolean;
  noHeader: boolean;
  noCategory: boolean;
}) {
  return (
    <>
      {props.noHeader ? null : (
        <Box
          component={"div"}
          style={{
            backgroundImage: `url(/ICOC2016.jpg)`,
            backgroundPosition: "center center",
            backgroundSize: "cover",
            aspectRatio: "4/1",
          }}
        ></Box>
      )}
      {props.noCategory ? null : (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: props.vertical ? "column" : "row",
              gap: 1,
              alignItems: "flex-start",
              flexWrap: "wrap",
              marginTop: 1,
              marginBottom: 1,
            }}
          >
            {routes.map(([name, path], idx) => (
              <Button
                color="info"
                key={idx}
                LinkComponent={Link}
                href={`/previous/2016${path}`}
              >
                {name}
              </Button>
            ))}
            <Button
              color="success"
              variant="contained"
              LinkComponent={Link}
              href={`/`}
            >
              Back to 2023
            </Button>
          </Box>
        </>
      )}
    </>
  );
}
