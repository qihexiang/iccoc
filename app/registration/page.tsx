import ClipableArea from "@/components/ClipableArea";
import { Metadata } from "next";
import Link from "next/link"

export const metadata: Metadata = {
  title: "Registration Information | ICCOC2023",
};

export default function RegistrationPage() {
  return (
    <div>
      <h1 className="typoblock">Registration</h1>
      <div className="typoblock flex items-center gap-1">
        <Link className="btn info" href={"/abstracts/registration"}>Registration</Link>
      </div>
      <h2 className="typoblock">Registration fees:</h2>
      <table className="typoblock">
        <thead>
          <tr>
            <td>Regular registrations*</td>
            <td>Fee</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Regular</td>
            <td>1600 RMB (230 US Dollar)</td>
          </tr>
          <tr>
            <td>Student</td>
            <td>1200 RMB (170 US Dollar)</td>
          </tr>
          <tr>
            <td>On site</td>
            <td>2000 RMB (285 US Dollar)</td>
          </tr>
        </tbody>
      </table>
      <span>
        *Graduate and undergraduate students with validated student IDs; Please
        provide the scanned file of the student ID and the letter from the
        advisor (both in pdf format) for the special rate for students.
      </span>
      <h2 className="typoblock">Insurance:</h2>
      <p className="typoblock">
        Neither travel insurance nor medical, accident or liability insurance is
        included in the registration fees. The ICCOC participants should make
        sure that they are fully insured from their home institution.
      </p>
      <h2 className="typoblock mb-2">Method of payment:</h2>
      <ClipableArea
        content={`Beijing Univ. of Chem. Tech.
Beneficiary Address: BeiSanHuan East Rd. 15th, ChaoYang District, Beijing, 100029 P. R. China
Bank Name: Bank of Beijing, Yinghua Branch
Bank Account: 0109 0504 3001 2010 5029 689
Swift Code:
Bank Address: BeiSanHuan East Rd. 15th, ChaoYang District, Beijing, 100029 P. R. China

北京化工大学
北京市朝阳区北三环东路 15 号
银行：北京银行樱花支行
银行账号： 0109 0504 3001 2010 5029 689
`}
      ></ClipableArea>
    </div>
  );
}
