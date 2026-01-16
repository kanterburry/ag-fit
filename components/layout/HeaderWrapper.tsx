import { getActiveProtocols } from "@/app/actions/dashboard";
import { DashboardHeader } from "./DashboardHeader";

export async function HeaderWrapper() {
    const protocols = await getActiveProtocols();
    return <DashboardHeader protocols={protocols} />;
}
