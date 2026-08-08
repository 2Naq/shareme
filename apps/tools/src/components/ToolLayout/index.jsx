import React from "react";
import { SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "../layout/appSidebar";
import { AppHeader } from "../layout/appHeader";

export default function ToolLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex h-screen w-full flex-col overflow-hidden">
        <AppHeader />
        <main className="bg-muted/20 flex-1 scrollbar-gutter-stable overflow-auto">
          <div className="mx-auto h-full max-w-5xl p-4 md:p-8">
            {children}
            <div className="h-10 bg-transparent" />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
