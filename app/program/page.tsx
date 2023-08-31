import LectureTimetable from "@/images/LecturesTimetable.png"
import Image from "next/image"

export const metadata = {
  title: "Program | ICCOC2023",
};

export default function ProgramPage() {
  return <div>
    <div className="m-2 shadow-neutral-200 shadow-md rounded overflow-hidden border-black border-2"> 
           <Image
        className=""
        src={LectureTimetable}
        alt="program table"
      ></Image>
      </div>
  </div>;
}
