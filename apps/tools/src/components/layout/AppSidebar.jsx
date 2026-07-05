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
} from "../ui/sidebar";
import { routeConfig } from "../../routes/routesConfig";
import { Settings2 } from "lucide-react";

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4 flex flex-row items-center space-x-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary to-green-500 text-primary-foreground shadow-lg shadow-primary/20 mr-0">
          <Settings2 className="h-6 w-6" />
        </div>
        <div className="flex flex-col truncate">
          <span className="font-extrabold text-xl leading-tight tracking-tight">
            <span className="bg-linear-to-r from-primary to-green-500 bg-clip-text text-transparent">Share</span>
            <span className="text-foreground/80 font-semibold ml-1.5">Tools</span>
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Công cụ Kỹ thuật</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {routeConfig
                .filter((route) => route.showInSidebar)
                .map((item, index) => {
                  const isActive =
                    location.pathname === item.path ||
                    (item.path !== "/tool" && location.pathname.startsWith(item.path));

                  return (
                    <SidebarMenuItem key={index}>
                      <Link to={item.path}>
                        <SidebarMenuButton className="flex items-center gap-2" asChild isActive={isActive} tooltip={item.label}>
                          {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
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
    </Sidebar>
  );
}
