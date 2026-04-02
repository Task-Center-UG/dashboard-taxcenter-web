"use client";

import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";

import { NavGroup } from "@/routes/routes-admin";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  routes: { navGroups: NavGroup[] };
}

export function AppSidebar({ routes, ...props }: AppSidebarProps) {
  const pathname = usePathname();

  const checkActive = (url: string) => {
    if (!url || url === "#") return false;
    if (url === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(url);
  };

  return (
    <Sidebar
      collapsible="offcanvas"
      className="border-r-0 shadow-2xl"
      {...props}
    >
      <SidebarHeader className="bg-[#2D1B69] text-white pt-5">
        <div className="flex w-full items-center justify-center">
          <Image
            src={"/common/logo-dark-tc.webp"}
            height={160}
            width={160}
            alt="Logo Tax Center Gunadarma"
            className="object-contain"
            priority
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-[#2D1B69]">
        <ScrollArea className="flex-1">
          <div className="px-3 pt-4 pb-10">
            {routes.navGroups.map((group) => (
              <SidebarGroup key={group.label}>
                <SidebarGroupLabel className="uppercase tracking-[0.2em] text-white/60 text-[10px] mt-4 mb-2">
                  {group.label}
                </SidebarGroupLabel>
                <SidebarMenu className="gap-1">
                  {group.items.map((item) => {
                    const isMainActive = checkActive(item.url);
                    const isChildActive = item.items?.some((sub) =>
                      checkActive(sub.url),
                    );
                    const hasSubmenu = item.items && item.items.length > 0;
                    const shouldOpen = isMainActive || isChildActive;

                    if (hasSubmenu) {
                      return (
                        <Collapsible
                          key={item.title}
                          asChild
                          defaultOpen={shouldOpen}
                          className="group/collapsible"
                        >
                          <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton
                                className={`
                                  py-6 rounded-xl transition-all duration-200
                                  hover:bg-white/10 hover:text-white
                                  ${shouldOpen ? "bg-white/10 text-white" : "text-white/70"}
                                `}
                              >
                                {item.icon && (
                                  <item.icon
                                    className={`h-5 w-5 shrink-0 ${shouldOpen ? "text-white" : "text-white/70"}`}
                                  />
                                )}
                                <span
                                  className={`font-medium ${shouldOpen ? "font-bold" : ""}`}
                                >
                                  {item.title}
                                </span>
                                <ChevronRight className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 text-white/30" />
                              </SidebarMenuButton>
                            </CollapsibleTrigger>

                            <CollapsibleContent>
                              <SidebarMenuSub className="ml-4 border-l border-white/20 py-2 gap-1">
                                {item.items!.map((subItem) => {
                                  const isSubActive = checkActive(subItem.url);
                                  return (
                                    <SidebarMenuSubItem key={subItem.title}>
                                      <SidebarMenuSubButton
                                        asChild
                                        isActive={isSubActive}
                                        className={`
                                          transition-all h-auto py-2.5 px-4 rounded-lg text-sm
                                          ${
                                            isSubActive
                                              ? "bg-white/20 text-white font-bold shadow-sm"
                                              : "text-white/60 hover:text-white hover:bg-white/5"
                                          }
                                        `}
                                      >
                                        <Link
                                          href={subItem.url}
                                          className="flex items-center gap-3"
                                        >
                                          {subItem.icon && (
                                            <subItem.icon
                                              className={`h-4 w-4 shrink-0 ${isSubActive ? "" : "text-white/40!"}`}
                                            />
                                          )}
                                          <span>{subItem.title}</span>
                                        </Link>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  );
                                })}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </SidebarMenuItem>
                        </Collapsible>
                      );
                    }

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          className={`
                            py-6 rounded-xl transition-all duration-200
                            hover:bg-white/10 hover:text-white
                            ${isMainActive ? "bg-white/10 text-white font-bold" : "text-white/70"}
                          `}
                        >
                          <Link
                            href={item.url}
                            className="flex items-center gap-3"
                          >
                            {item.icon && (
                              <item.icon className="h-5 w-5 shrink-0" />
                            )}
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroup>
            ))}
          </div>
        </ScrollArea>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
