import { Button, Box } from "@mui/material";
import Link from "next/link";

export default function Category2016() {
  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      {[
        ["Home", "/"],
        ["Program", "/program"],
        ["General Info", "/general_info"],
        ["Speakers", "/speakers"],
        ["Registration", "/registration"],
        ["Visa Info", "/visa"],
        ["Accommodation", "/accommodation"],
      ].map(([name, path], idx) => (
        <Button key={idx} LinkComponent={Link} href={`/2016${path}`}>
          {name}
        </Button>
      ))}
    </Box>
  );
}
