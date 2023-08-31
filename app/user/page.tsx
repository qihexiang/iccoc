import pageRequireUser from "@/lib/pageRequireUser";
import UserPage from "./UserPage";

export default async function AbstractsV2() {
    const email = await pageRequireUser()
    return <UserPage></UserPage>
}