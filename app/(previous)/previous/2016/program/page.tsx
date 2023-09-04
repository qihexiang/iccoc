import { H1 } from "@/components/TypoElement";

export const metadata = {
  title: "Program",
};

export default function Page() {
  return (
    <>
      <H1>Program</H1>
      <a href="./downlaod/program.pdf" download={"program.pdf"}>
        Program PDF Download
      </a>
    </>
  );
}
