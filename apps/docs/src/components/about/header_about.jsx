import React from "react";
import Link from "@docusaurus/Link";
import { useColorMode } from "@docusaurus/theme-common";
import { Sun, Moon } from "lucide-react";
import { myData } from "@site/src/constants/my_data";
import GithubIcon from "@/components/icons/github";
import { cn } from "@/lib/utils";

const tw = {
  btn: "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-foreground/80 hover:text-foreground hover:bg-muted transition-colors no-underline",
};
function HeaderAbout() {
  const { colorMode, setColorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const toggleTheme = () => {
    setColorMode(isDark ? "light" : "dark");
  };

  return (
    <header className="bg-background/80 border-edge sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="mx-auto flex items-center justify-between px-4 py-3 font-mono md:max-w-3xl">
        <div className="flex-1"></div>
        <div className="flex items-center gap-1">
          {/* Blog Button */}
          <Link to="/blog" className={cn(tw.btn)}>
            <span>Blog</span>
          </Link>

          {/* GitHub Button */}
          <a
            href={myData.link_github}
            className={cn(tw.btn)}
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub Profile"
          >
            <GithubIcon className="size-4" />
          </a>

          {/* Toggle Theme Button */}
          <button
            onClick={toggleTheme}
            type="button"
            className="text-foreground/80 hover:text-foreground hover:bg-muted flex cursor-pointer items-center justify-center rounded-md border-none bg-transparent p-2 transition-colors"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <Sun className="size-4 text-yellow-400" />
            ) : (
              <Moon className="size-4 text-slate-700 dark:text-slate-200" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default HeaderAbout;
