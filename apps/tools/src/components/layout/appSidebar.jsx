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
import { routeConfig, groups } from "@/routes/routesConfig";
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
        {groups.map((group) => {
          const groupRoutes = routeConfig.filter(
            (route) => route.group === group.id && route.showInSidebar
          );

          if (groupRoutes.length === 0) return null;

          return (
            <SidebarGroup key={group.id} className="py-2">
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/75 uppercase tracking-wider px-3">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {groupRoutes.map((item, index) => {
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
                            <span className="truncate font-medium">{item.label}</span>
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
      <SidebarFooter>
        <div className="flex justify-end sm:hidden">
          <ThemeToggle className="" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
