"use client";

import BUCT from "@/images/BUCT.jpg";
import CRE from "@/images/CRE.png";
import ForbiddenCity from "@/images/forbiddencity.jpg";
import GreatWall from "@/images/greatwall.jpg";
import SummerPalace from "@/images/summerpalace.jpg";
import Image from "next/image";

export default function Homepage() {
  return (
    <div className="typoblock">
      <h1 className="typoblock">Welcome</h1>

      <p className="typoblock">
        It is our great pleasure to invite you to the International Conference
        of Computational Organometallic Catalysis (ICCOC2023), which will be
        held in Beijing, China, from October 20<sup>th</sup> to 23<sup>th</sup>,
        2023. This is an international conference dedicated to promoting
        advances in the integration of theoretical and computational chemistry
        with homogeneous and heterogeneous catalysis involving transition
        metals.
      </p>

      <ul className="typoblock">
        <li>
          The International Conference on Computational Organometallic Catalysis
          2023 (ICCOC2023) focuses on the application of theoretical and
          computational chemistry in homogeneous and hetergeneous organometallic
          catalysis. Advances covered range from new catalyzed reactions and
          processes, to ligand and catalyst design, and new mechanistic insights
          that could change implementation into practice.
        </li>
        <li>
          Participants include scientists involved in theoretical and
          computational chemistry related to catalysis, organometallic
          chemistry, organic synthesis, polymers etc., from both academia and
          industry. The ICCOC2023 is trying to provide a platform to exchange
          academic ideas in this field with a highly engaged discussion. The
          single oral session and one poster session style for oral
          presentations and posters promote discussion and debate, as does the
          conference size (typically 100-150 participants).
        </li>
      </ul>

      <h2 className="typoblock">Important dates:</h2>

      <ul className="typoblock">
        <li>
          Abstract Submission Deadline: Sept. 30<sup>th</sup>, 2023
        </li>
        <li>
          Registration Deadline: Sept. 30<sup>th</sup>, 2023
        </li>
        <li>
          Conference Date: Oct. 20<sup>th</sup>-23<sup>rd</sup>, 2023
        </li>
      </ul>

      <div className="typoblock grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-1">
        {[
          { ...GreatWall, title: "The Great Wall" },
          { ...SummerPalace, title: "Summer Palace" },
          { ...ForbiddenCity, title: "Forbidden City" },
        ].map((item, idx) => (
          <div className="relative" key={idx} >
            <Image
              src={item}
              alt={item.title}
              className="w-full h-48  object-cover object-center"
            ></Image>
            <p className="bg-black/75 p-1 z-10 absolute bottom-0 left-0 right-0 text-white">{item.title}</p>
          </div>
        ))}
      </div>

      <p className="typoblock">Organizers:</p>

      <div className="flex gap-1 items-center flex-wrap typoblock">
        <Image
          alt="Beijing University of Chemical Technology"
          src={BUCT}
          height={128}
        ></Image>

        <Image alt="CRE" src={CRE} height={128}></Image>
      </div>
    </div>
  );
}
