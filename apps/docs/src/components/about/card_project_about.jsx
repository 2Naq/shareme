import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { ArrowUpRight, Calendar, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Danh sách projects. Chỉ cần thêm object mới vào mảng này để hiển thị thêm project.
 *
 * @example
 * {
 *   title: "Tên project",
 *   description: "Mô tả ngắn gọn...",
 *   image: "/img/project-xxx.svg",      // ảnh nằm trong static/img/
 *   link: "/docs",                       // đường dẫn nội bộ hoặc URL
 *   date: "2025",                        // năm hoặc ngày tháng
 *   tags: ["Tag1", "Tag2"],
 *   status: "Active",                    // Active | WIP | Archived
 * }
 */
const projects = [
  {
    title: "Share Me",
    description:
      "Tổng hợp tài liệu kỹ thuật PLC, Biến tần, HMI, Servo... từ kinh nghiệm làm việc, lập trình và vận hành thiết bị tự động hoá công nghiệp.",
    image: "/img/project-docs.svg",
    link: "/docs",
    date: "2025",
    tags: ["PLC", "Inverter", "HMI", "Servo"],
    status: "Active",
  },
  {
    title: "Share Tools",
    description:
      "Bộ công cụ tiện ích hỗ trợ tính toán tần số, tra cứu mã lỗi biến tần, chuyển đổi, sacle đơn vị...",
    image: "/img/project-tools.svg",
    link: "/tools/",
    date: "2025",
    tags: ["Calculator", "Converter"],
    status: "WIP",
  },
];

const statusColors = {
  Active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  WIP: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Archived: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
};

function ProjectCard({ project }) {
  const imageUrl = useBaseUrl(project.image);

  const isExternal = /^https?:\/\//.test(project.link);
  const isDocs = project.link.startsWith("/docs");

  let toUrl;
  if (isExternal || isDocs) {
    toUrl = project.link;
  } else {
    // Docusaurus bypass router SPA
    const normalizedPath = project.link.startsWith("/")
      ? project.link
      : `/${project.link}`;
    toUrl = useBaseUrl(`pathname://${normalizedPath}`);
  }

  return (
    <Link
      to={toUrl}
      className={cn(
        "group flex flex-col gap-0 sm:flex-row sm:gap-5",
        "border-edge overflow-hidden rounded-xl border",
        "bg-card/30 hover:bg-muted/40 transition-all duration-300",
        "text-inherit no-underline",
        "hover:shadow-primary/5 hover:shadow-lg",
        "hover:border-primary/30",
      )}
    >
      {/* Image */}
      <div className="bg-muted/20 relative h-44 w-full shrink-0 overflow-hidden sm:h-auto sm:w-52">
        <img
          src={imageUrl}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {/* Status badge on image */}
        <span
          className={cn(
            "absolute top-2.5 right-2.5 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase",
            statusColors[project.status] || statusColors.Active,
          )}
        >
          {project.status}
        </span>
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col p-4 sm:py-4 sm:pr-4 sm:pl-0">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-foreground group-hover:text-primary m-0 line-clamp-1 text-base font-bold transition-colors sm:text-lg">
            {project.title}
          </h3>
          <ArrowUpRight className="text-muted-foreground size-4 shrink-0 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
        </div>

        {/* Meta info */}
        <div className="text-muted-foreground mt-1.5 flex items-center gap-3 text-[11px]">
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3" />
            {project.date}
          </span>
          <span className="inline-flex items-center gap-1">
            <Layers className="size-3" />
            {project.tags.length} stacks
          </span>
        </div>

        {/* Description */}
        <p className="text-muted-foreground m-0 mt-2 line-clamp-2 text-xs leading-relaxed sm:line-clamp-3 sm:text-sm">
          {project.description}
        </p>

        {/* Tags */}
        <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="bg-muted/60 text-muted-foreground border-input/30 rounded-md border px-2 py-0.5 text-[10px] font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

function CardProjectAbout() {
  return (
    <div className="flex flex-col gap-4">
      {projects.map((project) => (
        <ProjectCard key={project.title} project={project} />
      ))}
    </div>
  );
}

export default CardProjectAbout;
