import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { CommandMenu } from "./commandMenu";
import { ThemeToggle } from "../ThemeToggle";
import { Home } from "lucide-react";

export function AppHeader() {
  const { pathname } = useLocation();
  const isHome = pathname === "/tools";

  return (
    <header className="bg-background flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
      <div></div>
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        {!isHome && (
          <>
            <Separator
              orientation="vertical"
              className="mr-2 hidden h-6 sm:block"
            />
            <Link
              to="/"
              className="text-primary hover:text-primary/80 text-lg font-bold no-underline"
            >
              <span className="hidden sm:flex"> Về trang chủ</span>
              <Home className="block size-5 sm:hidden"></Home>
            </Link>
          </>
        )}
      </div>
      <div className="flex flex-1 sm:justify-end">
        {" "}
        <CommandMenu />
      </div>
      <div className="hidden items-center sm:flex">
        <ThemeToggle />
      </div>
    </header>
  );
}
