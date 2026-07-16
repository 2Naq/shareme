import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "../ui/sidebar";
import { routeConfig } from "@/routes/routesConfig";
import { ShareToolsLogo } from "../ShareToolsLogo";
import { ThemeToggle } from "../ThemeToggle";

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <ShareToolsLogo size="md" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Toolkit</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {routeConfig
                .filter((route) => route.showInSidebar)
                .map((item, index) => {
                  const isActive =
                    location.pathname === item.path ||
                    (item.path !== "/tool" &&
                      location.pathname.startsWith(item.path));

                  return (
                    <SidebarMenuItem key={index}>
                      <Link to={item.path}>
                        <SidebarMenuButton
                          className="flex items-center gap-2"
                          isActive={isActive}
                          tooltip={item.label}
                        >
                          {item.icon && (
                            <item.icon className="h-4 w-4 shrink-0" />
                          )}
                          <span className="truncate">{item.label}</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex justify-end sm:hidden">
          <ThemeToggle className="" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
