import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visa information | ICCOC2023",
};

export default function VisaPage() {
  return <div>
    <p>Please contact with us by email iccoc@mail.buct.edu.cn.</p>
    <h2>
      Please supply the following information with your request for an
      invitation letter:
    </h2>
    <ol>
      <li>Citizenship;</li>
      <li>Full name as in the passport;</li>
      <li>Passport number;</li>
      <li>Passport expiry date (with day and month).</li>
    </ol>
  </div>;
}
