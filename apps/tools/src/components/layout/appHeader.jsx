import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import { Link } from "react-router-dom";
import { CommandMenu } from "./commandMenu";
import { ThemeToggle } from "../ThemeToggle";
import { BookMarked, Home } from "lucide-react";

export function AppHeader() {
  return (
    <header className="bg-background flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
      <div></div>
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
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
      </div>
      <div className="flex flex-1 sm:justify-end">
        {" "}
        <CommandMenu />
      </div>
      <div className="hidden items-center sm:flex">
        <a
          href="/shareme/"
          className="hover:text-primary font-medium no-underline transition-colors"
        >
          <div className="hover:bg-accent flex items-center gap-1 rounded-md px-2 py-1">
            <BookMarked className="size-4" />
            <span>Docs</span>
          </div>
        </a>
        <ThemeToggle />
      </div>
    </header>
  );
}
