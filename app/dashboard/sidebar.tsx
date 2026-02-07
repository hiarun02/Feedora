import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";
import SidebarContent from "../../components/SidebarContent";

const Sidebar = async () => {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  return <SidebarContent />;
};

export default Sidebar;
