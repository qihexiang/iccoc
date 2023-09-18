import { H1 } from "@/components/TypoElement";
import { Box } from "@mui/system";

export const metadata = {
  title: "Program",
};

export default function Page() {
  return (
    <>
      <H1>Program</H1>
      <Box display={"flex"} flexDirection={"column"}>
      <object data="/program2016.pdf" style={{border: "none", width: "100%", minHeight: "100vh"}}></object>
      <a href="/program2016.pdf" download={"program.pdf"}>
        Program PDF Download
      </a>
      </Box>
    </>
  );
}
