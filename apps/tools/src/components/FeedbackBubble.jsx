import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  Bug,
  Sparkles,
  MessageSquare,
  ExternalLink,
  GitPullRequest,
} from "lucide-react";

const GITHUB_REPO = "https://github.com/2Naq/Shareme";

function GithubIcon({ className = "h-5 w-5", ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export function FeedbackBubble() {
  return (
    <div className="fixed right-5 bottom-5 z-40">
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger
            render={
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    aria-label="Đóng góp hoặc Báo lỗi GitHub"
                    className="border-border/60 bg-card/90 text-foreground hover:bg-accent hover:text-foreground group flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border shadow-md backdrop-blur-md transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-hidden active:scale-95"
                  >
                    <GithubIcon className="h-5 w-5 transition-transform duration-200 group-hover:rotate-6" />
                  </button>
                }
              />
            }
          />
          <TooltipContent side="left" className="font-medium">
            Đóng góp &amp; Báo lỗi
          </TooltipContent>
        </Tooltip>

        <DropdownMenuContent
          align="end"
          side="top"
          sideOffset={8}
          className="border-border/60 bg-popover/95 w-64 rounded-xl p-1.5 shadow-xl backdrop-blur-md"
        >
          <DropdownMenuLabel className="text-muted-foreground px-2.5 py-1.5 text-xs font-semibold">
            Đóng góp &amp; Phản hồi dự án
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-1" />

          <DropdownMenuGroup className="space-y-0.5">
            {/* Report Bug */}
            <DropdownMenuItem
              className="cursor-pointer rounded-lg px-2.5 py-2 text-xs font-medium"
              render={
                <a
                  href={`${GITHUB_REPO}/issues/new?title=%5BBug%5D%3A+&labels=bug`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-destructive flex w-full items-center gap-2.5 no-underline"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-red-500/10 text-red-500">
                    <Bug className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex flex-col">
                    <span>Báo lỗi (Report Bug)</span>
                    <span className="text-muted-foreground text-[10px] font-normal">
                      Phát hiện lỗi tính toán hoặc UI
                    </span>
                  </div>
                  <ExternalLink className="text-muted-foreground/50 ml-auto h-3 w-3" />
                </a>
              }
            />

            {/* Feature Request */}
            <DropdownMenuItem
              className="cursor-pointer rounded-lg px-2.5 py-2 text-xs font-medium"
              render={
                <a
                  href={`${GITHUB_REPO}/issues/new?title=%5BFeature%5D%3A+&labels=enhancement`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary flex w-full items-center gap-2.5 no-underline"
                >
                  <div className="bg-primary/10 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-md">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex flex-col">
                    <span>Góp ý tính năng</span>
                    <span className="text-muted-foreground text-[10px] font-normal">
                      Đề xuất công cụ hoặc cải tiến
                    </span>
                  </div>
                  <ExternalLink className="text-muted-foreground/50 ml-auto h-3 w-3" />
                </a>
              }
            />

            {/* GitHub Repo / Star / Pull Requests */}
            <DropdownMenuItem
              className="cursor-pointer rounded-lg px-2.5 py-2 text-xs font-medium"
              render={
                <a
                  href={GITHUB_REPO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground flex w-full items-center gap-2.5 no-underline hover:text-emerald-500"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-500">
                    <GitPullRequest className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex flex-col">
                    <span>Mã nguồn &amp; Đóng góp</span>
                    <span className="text-muted-foreground text-[10px] font-normal">
                      GitHub Repo: 2Naq/Shareme
                    </span>
                  </div>
                  <ExternalLink className="text-muted-foreground/50 ml-auto h-3 w-3" />
                </a>
              }
            />

            {/* Discussions / Q&A */}
            <DropdownMenuItem
              className="cursor-pointer rounded-lg px-2.5 py-2 text-xs font-medium"
              render={
                <a
                  href={`${GITHUB_REPO}/discussions`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground flex w-full items-center gap-2.5 no-underline hover:text-blue-500"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-500/10 text-blue-500">
                    <MessageSquare className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex flex-col">
                    <span>Thảo luận &amp; Hỏi đáp</span>
                    <span className="text-muted-foreground text-[10px] font-normal">
                      Trao đổi và chia sẻ kiến thức
                    </span>
                  </div>
                  <ExternalLink className="text-muted-foreground/50 ml-auto h-3 w-3" />
                </a>
              }
            />
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
