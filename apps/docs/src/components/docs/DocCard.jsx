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
    <Card className="group flex flex-col justify-between overflow-hidden pt-0">
      <div className="relative h-44 w-full overflow-hidden bg-muted/30 flex items-center justify-center">
        {item.image ? (
          <>
            <img
              src={item.image}
              alt={item.title}
              className={cn(
                "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out dark:bg-white",
                item.folderName === "wecon" &&
                  "dark:bg-black/60 bg-black/60 object-contain px-3",
                item.folderName === "mitsubishi" && " object-contain px-3 pt-2",
                item.folderName === "omron" && " object-contain px-3",
              )}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-80" />
          </>
        ) : (
          <div className="flex items-center justify-center w-full h-full p-4">
            <NotFileIcon className="opacity-80" />
          </div>
        )}

        {/* Top Badge */}
        {item.badge && (
          <Badge
            variant={item.image ? "secondary" : "outline"}
            className="absolute top-3 right-3 border border-input/30"
          >
            {item.badge}
          </Badge>
        )}

        {/* Folder Name Badge */}
        <Badge
          variant={item.image ? "secondary" : "outline"}
          className="absolute bottom-3 left-3 gap-1 px-2.5 py-1 text-xs"
        >
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>{item.folderName}</span>
        </Badge>
      </div>

      {/* Card Header & Description */}
      <CardHeader className="p-5 pb-3">
        <CardTitle className="text-lg font-bold transition-colors line-clamp-1 m-0">
          {item.title}
        </CardTitle>
        <CardDescription className="line-clamp-3 text-xs sm:text-sm leading-relaxed m-0 mt-1">
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
              className=" font-normal flex items-center"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      {/* Card Footer with Link */}
      <CardFooter className="flex items-center px-5 pb-5 pt-2 border-none bg-transparent">
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
