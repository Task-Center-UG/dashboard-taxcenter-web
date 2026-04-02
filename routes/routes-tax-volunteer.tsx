import {
  LayoutDashboard,
  HeartHandshake,
  FileImage,
  LucideIcon,
  BookText,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
}

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  items?: NavSubItem[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const routesTaxVolunteer: { navGroups: NavGroup[] } = {
  navGroups: [
    {
      label: "HOME",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard-tax-volunteers",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      label: "PROGRAM DAN LAYANAN",
      items: [
        {
          title: "Relawan Pajak",
          url: "#",
          icon: HeartHandshake,
          items: [
            {
              title: "Module",
              url: "/dashboard-tax-volunteers/modules",
              icon: BookText,
            },
            {
              title: "Dokumentasi",
              url: "/dashboard-tax-volunteers/documentations",
              icon: FileImage,
            },
          ],
        },
      ],
    },
  ],
};
