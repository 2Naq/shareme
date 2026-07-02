import React from 'react';
import { SidebarProvider } from '../ui/sidebar';
import { AppSidebar } from '../layout/AppSidebar';
import { AppHeader } from '../layout/AppHeader';

export default function ToolLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex w-full flex-col h-screen overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-auto bg-muted/20">
          <div className="p-4 md:p-8 max-w-5xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
