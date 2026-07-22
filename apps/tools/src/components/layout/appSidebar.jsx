import React, { useEffect, useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { routeConfig, groups } from "@/routes/routesConfig";
import { ShareToolsLogo } from "../ShareToolsLogo";
import { ThemeToggle } from "../ThemeToggle";
import {
  ChevronsUpDown,
  Download,
  ExternalLink,
  ShieldCheck,
  BookOpen,
  Sparkles,
} from "lucide-react";

export function AppSidebar() {
  const location = useLocation();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePrompt = () => {
      setDeferredPrompt(window.deferredPrompt);
    };

    window.addEventListener("pwa-install-prompt-ready", handlePrompt);
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      window.deferredPrompt = e;
      setDeferredPrompt(e);
    });

    if (window.deferredPrompt) {
      setDeferredPrompt(window.deferredPrompt);
    }

    const checkStandalone = () => {
      if (
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone
      ) {
        setIsInstalled(true);
      }
    };
    checkStandalone();
  }, []);

  const handleInstall = async () => {
    const promptEvent = deferredPrompt || window.deferredPrompt;
    if (!promptEvent) return;

    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
      setDeferredPrompt(null);
      window.deferredPrompt = null;
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <ShareToolsLogo size="md" />
      </SidebarHeader>

      <SidebarContent>
        {groups.map((group) => {
          const groupRoutes = routeConfig.filter(
            (route) => route.group === group.id && route.showInSidebar,
          );

          if (groupRoutes.length === 0) return null;

          return (
            <SidebarGroup key={group.id} className="py-2">
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/75 tracking-wider px-3">
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
                            <span className="truncate font-medium">
                              {item.label}
                            </span>
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

      <SidebarFooter className="p-2 border-t border-border/40">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                nativeButton={false}
                render={
                  <SidebarMenuButton
                    render={<div />}
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src="./web-app-manifest-192x192.png"
                        alt="ShareMe"
                      />
                      <AvatarFallback className="rounded-lg bg-primary text-primary-foreground font-bold text-xs">
                        AN
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold text-foreground">
                        ShareMe Tools
                      </span>
                      <span className="truncate text-[11px] text-muted-foreground font-mono">
                        v1.0.0
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
                  </SidebarMenuButton>
                }
              />

              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-60 rounded-xl p-2 shadow-lg"
                side="top"
                align="end"
                sideOffset={8}
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="p-1 font-normal">
                    <div className="flex items-center gap-2.5 px-1 py-1 text-left text-sm">
                      <Avatar className="h-9 w-9 rounded-lg">
                        <AvatarImage
                          src="./web-app-manifest-192x192.png"
                          alt="ShareMe"
                        />
                        <AvatarFallback className="rounded-lg bg-primary text-primary-foreground font-bold">
                          AN
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold text-foreground">
                          ShareMe System
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          Tell me!
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="my-1.5" />

                {/* PWA Action */}
                {deferredPrompt && !isInstalled && (
                  <>
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={handleInstall}
                        className="cursor-pointer font-medium text-emerald-500 focus:text-emerald-500 focus:bg-emerald-500/10 rounded-lg py-2"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        <span>Cài đặt PWA Tools</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="my-1.5" />
                  </>
                )}

                {isInstalled && (
                  <>
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        disabled
                        className="text-emerald-500/80 text-xs py-1.5"
                      >
                        <ShieldCheck className="mr-2 h-4 w-4 text-emerald-500" />
                        <span>Đã cài đặt PWA Tools</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="my-1.5" />
                  </>
                )}

                {/* External links */}
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    render={
                      <a
                        href="/shareme/"
                        className="cursor-pointer flex items-center w-full no-underline py-2 rounded-lg text-foreground"
                      >
                        <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Tài liệu & Blog</span>
                        <ExternalLink className="ml-auto h-3.5 w-3.5 text-muted-foreground/60" />
                      </a>
                    }
                  ></DropdownMenuItem>
                  <DropdownMenuItem
                    render={
                      <a
                        href="/shareme/pwa"
                        className="cursor-pointer flex items-center w-full no-underline py-2 rounded-lg text-foreground"
                      >
                        <Sparkles className="mr-2 h-4 w-4 text-indigo-400" />
                        <span>Ứng dụng PWA</span>
                        <Download className="ml-auto h-3.5 w-3.5 text-muted-foreground/60" />
                      </a>
                    }
                  ></DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="my-1.5 sm:hidden" />

                {/* Theme Toggle row */}
                <div className="flex items-center justify-between px-2 py-1 sm:hidden">
                  <span className="text-xs font-medium text-muted-foreground">
                    Chế độ giao diện
                  </span>
                  <ThemeToggle />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
