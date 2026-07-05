import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import { Link } from "react-router-dom";
import { CommandMenu } from "./CommandMenu";
import { ThemeToggle } from "../ThemeToggle";

export function AppHeader() {

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-6" />
                <Link to="/" className="font-bold text-lg text-primary no-underline hover:text-primary/80">
                    Về trang chủ
                </Link>
            </div>
            <div className="flex items-center gap-4">
                <CommandMenu />
                <a href="/shareme/" className="font-medium hover:text-primary transition-colors no-underline">Docs</a>
                <ThemeToggle />
            </div>
        </header>
    )
}