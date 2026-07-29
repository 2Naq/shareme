import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import { Link } from "react-router-dom";
import { CommandMenu } from "./commandMenu";
import { ThemeToggle } from "../ThemeToggle";
import { BookMarked, Home } from "lucide-react";

export function AppHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-4">
      <div></div>
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 h-6 hidden sm:block"
        />
        <Link
          to="/"
          className="font-bold text-lg text-primary no-underline hover:text-primary/80"
        >
          <span className="sm:flex hidden"> Về trang chủ</span>
          <Home className="sm:hidden block size-5"></Home>
        </Link>
      </div>
      <div className="flex-1 flex sm:justify-end">
        {" "}
        <CommandMenu />
      </div>
      <div className="sm:flex hidden items-center">
        <a
          href="/shareme/"
          className="font-medium hover:text-primary transition-colors no-underline"
        >
          <div className="flex items-center gap-1 hover:bg-accent px-2 py-1 rounded-md">
            <BookMarked className="size-4" />
            <span>Docs</span>
          </div>
        </a>
        <ThemeToggle />
      </div>
    </header>
  );
}
