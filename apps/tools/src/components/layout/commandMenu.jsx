import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { routeConfig, groups } from "../../routes/routesConfig";
import { Search } from "lucide-react";
import { Button } from "../ui/button";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command) => {
    setOpen(false);
    command();
  };

  return (
    <>
      <Button
        variant="outline"
        className="bg-muted/50 text-muted-foreground relative h-9 w-full justify-start rounded-[0.5rem] text-sm font-normal shadow-none sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Tìm kiếm nhanh...</span>
        <span className="inline-flex lg:hidden">Tìm kiếm...</span>
        <kbd className="bg-muted pointer-events-none absolute top-[0.3rem] right-[0.3rem] hidden h-6 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="min-w-1/3 pt-2"
      >
        <CommandInput
          classNameInput="h-10!"
          placeholder="Gõ tên công cụ cần tìm..."
        />
        <CommandList>
          <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
          {groups.map((group) => {
            const groupRoutes = routeConfig.filter(
              (route) => route.group === group.id && route.showInSidebar,
            );

            if (groupRoutes.length === 0) return null;

            return (
              <CommandGroup key={group.id} heading={group.label}>
                {groupRoutes.map((route, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => runCommand(() => navigate(route.path))}
                  >
                    {route.icon && <route.icon className="mr-2 h-4 w-4" />}
                    <span>{route.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}
