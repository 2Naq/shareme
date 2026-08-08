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
        "group flex flex-col sm:flex-row gap-0 sm:gap-5",
        "rounded-xl border border-edge overflow-hidden",
        "bg-card/30 hover:bg-muted/40 transition-all duration-300",
        "no-underline text-inherit",
        "hover:shadow-lg hover:shadow-primary/5",
        "hover:border-primary/30"
      )}
    >
      {/* Image */}
      <div className="relative w-full sm:w-52 h-44 sm:h-auto shrink-0 overflow-hidden bg-muted/20">
        <img
          src={imageUrl}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {/* Status badge on image */}
        <span
          className={cn(
            "absolute top-2.5 right-2.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
            statusColors[project.status] || statusColors.Active
          )}
        >
          {project.status}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 sm:py-4 sm:pr-4 sm:pl-0 min-w-0">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base sm:text-lg font-bold text-foreground m-0 line-clamp-1 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <ArrowUpRight className="size-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
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
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-2 m-0 line-clamp-2 sm:line-clamp-3">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-3">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground border border-input/30"
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
