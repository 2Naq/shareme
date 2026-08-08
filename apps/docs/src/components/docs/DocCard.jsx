import React from "react";
import Link from "@docusaurus/Link";
import { FolderGit2, ArrowUpRight } from "lucide-react";
import NotFileIcon from "@/components/icons/not-file";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DocCard({ item }) {
  return (
    <Card className="group flex flex-col overflow-hidden pt-0">
      <div className="bg-muted/30 relative flex h-44 w-full items-center justify-center overflow-hidden">
        {item.image ? (
          <>
            <img
              src={item.image}
              alt={item.title}
              className={cn(
                "h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 dark:bg-white",
                item.folderName === "wecon" &&
                  "bg-black/60 object-contain px-3 dark:bg-black/60",
                item.folderName === "mitsubishi" && "object-contain px-3 pt-2",
                item.folderName === "omron" && "object-contain px-3",
              )}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-80" />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center p-4">
            <NotFileIcon className="opacity-80" />
          </div>
        )}

        {/* Top Badge */}
        {item.badge && (
          <Badge
            variant={item.image ? "secondary" : "outline"}
            className="border-input/30 absolute top-3 right-3 border"
          >
            {item.badge}
          </Badge>
        )}

        {/* Folder Name Badge */}
        {/* <Badge
          variant={item.image ? "secondary" : "outline"}
          className="absolute bottom-3 left-3 gap-1 px-2.5 py-1 text-xs"
        >
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>{item.folderName}</span>
        </Badge> */}
      </div>

      {/* Card Header & Description */}
      <CardHeader className="flex-1 p-5 pb-3">
        <CardTitle className="m-0 line-clamp-1 text-lg font-bold transition-colors">
          {item.title}
        </CardTitle>
        <CardDescription className="m-0 mt-1 line-clamp-2 text-xs leading-relaxed sm:text-sm">
          {item.description}
        </CardDescription>
      </CardHeader>

      {/* Tag Badges */}
      <CardContent className="px-5 py-2">
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag, idx) => (
            <Badge
              key={idx}
              variant="outline"
              className="flex items-center font-normal"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      {/* Card Footer with Link */}
      <CardFooter className="flex items-center border-none bg-transparent px-5 pt-2 pb-5">
        <Button
          nativeButton={false}
          variant="secondary"
          render={
            <Link to={item.link} className="w-full no-underline">
              <span>Truy cập tài liệu</span>
              <ArrowUpRight className="size-4" />
            </Link>
          }
        />
      </CardFooter>
    </Card>
  );
}
