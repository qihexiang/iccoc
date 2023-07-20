import { Metadata } from "next";
import Registration from "./registration";

export const metadata: Metadata = {
    title: "Registration Information | ICCOC2023"
}

export default function RegistrationPage() {
    return <Registration></Registration>
}