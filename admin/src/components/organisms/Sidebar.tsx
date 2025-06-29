import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSession } from "../providers/SessionProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { GrTransaction } from "react-icons/gr";
import { ChevronUp, User2, BarChart2 } from "lucide-react";
import { logoutUser } from "@/lib/utils";
import { BiPurchaseTagAlt } from "react-icons/bi";
import { IoFastFoodOutline } from "react-icons/io5";
import { GiNotebook } from "react-icons/gi";

import { MdDashboard } from "react-icons/md";
import { FcSalesPerformance } from "react-icons/fc";

import { MdEventNote } from "react-icons/md";

import { MenuItem } from "@/@types/general";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>Admin Aqil Frozen Food</SidebarHeader>
      <SidebarContent>
        <Navigation />
        <Reports />
        <Tools />
      </SidebarContent>
      <Footer />
    </Sidebar>
  );
}

const items: MenuItem[] = [
  {
    name: "Dashboard",
    url: "/dashboard",
    icon: MdDashboard,
  },
  {
    name: "Produk",
    url: "/products",
    icon: IoFastFoodOutline,
  },
  {
    name: "Transaksi",
    url: "/transactions",
    icon: GrTransaction,
  },
  {
    name: "Pembelian",
    url: "/purchases",
    icon: BiPurchaseTagAlt,
  },
];

const reportItems: MenuItem[] = [
  {
    name: "Laporan Penjualan",
    url: "/reports/sales",
    icon: FcSalesPerformance,
  },
  {
    name: "Laporan Pembelian",
    url: "/reports/purchases",
    icon: GiNotebook,
  },
  {
    name: "Laba Rugi",
    url: "/reports/profit-loss",
    icon: BarChart2,
  },
];

const toolsItem: MenuItem[] = [
  {
    name: "Rencana Pembelian",
    url: "/tools/purchase-planning",
    icon: MdEventNote,
  },
];

const Navigation = () => {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={pathname === item.url}>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

const Reports = () => {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Laporan</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {reportItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={pathname === item.url}>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
const Tools = () => {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Tools</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {toolsItem.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={pathname === item.url}>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

const Footer = () => {
  const { user } = useSession();

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="cursor-pointer">
                <User2 /> {user?.full_name}
                <ChevronUp className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              className="w-[--radix-popper-anchor-width]"
            >
              <DropdownMenuItem className="cursor-pointer">
                <span>Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logoutUser} className="cursor-pointer">
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};
