import React from "react";
import ToolLayout from "@/components/ToolLayout";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { routeConfig } from "@/routes/routesConfig";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import AboutHighlight from "@/components/AboutHighlight";

export default function ToolPage() {
  // Bỏ qua trang Home và các trang test/ẩn
  const tools = routeConfig.filter(
    (route) =>
      route.path !== "/tools" &&
      route.path !== "/tools/test" &&
      route.showInSidebar,
  );

  return (
    <ToolLayout
      title="Công cụ tự động hóa"
      description="Tổng hợp các tiện ích tính toán và chuyển đổi hỗ trợ một vài tác vụ."
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 py-6">
        <div className="mb-2 space-y-4 text-left">
          <h1 className="text-foreground text-4xl font-bold tracking-tight lg:text-5xl">
            Tổng hợp 1 số công cụ{" "}
            <AboutHighlight
              text="Tự động héo"
              className="font-semibold italic"
            />
          </h1>
          <p className="text-muted-foreground max-w-3xl text-xl leading-relaxed">
            Bộ công cụ, tiện ích. Được thiết kế tối giản, với giao diện trực
            quan giúp xử lý & tính toán nhanh 1 vài tác vụ.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid auto-rows-55 grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {tools.map((tool, index) => {
            const Icon = tool.icon;

            // Setup logic Bento layout: item đầu tiên bự nhất, item thứ 2 rộng
            const isFeatured = index === 0;
            const isWide = index === 1;

            return (
              <Link
                key={tool.path}
                to={tool.path}
                className={cn(
                  "group bg-card text-card-foreground relative block overflow-hidden rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                  isFeatured
                    ? "bg-primary/5 border-primary/20 md:col-span-2 md:row-span-2"
                    : "",
                  isWide
                    ? "bg-secondary/30 md:col-span-2 lg:col-span-2"
                    : "lg:col-span-1",
                )}
              >
                <div className="from-foreground/5 pointer-events-none absolute inset-0 bg-linear-to-t to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                <Card
                  className={cn(
                    "flex h-full flex-col border-0 bg-transparent p-6 shadow-none sm:p-8",
                    !isFeatured && "justify-between",
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={cn(
                        "flex items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                        isFeatured
                          ? "bg-primary text-primary-foreground shadow-primary/20 h-16 w-16 shadow-lg"
                          : "bg-muted text-muted-foreground h-12 w-12",
                      )}
                    >
                      {Icon && (
                        <Icon className={isFeatured ? "h-8 w-8" : "h-6 w-6"} />
                      )}
                    </div>
                    <ArrowRight className="text-muted-foreground group-hover:text-primary h-5 w-5 -translate-x-4 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  </div>

                  <div className="mt-4">
                    <CardTitle
                      className={cn(
                        "mb-2 text-xl tracking-tight",
                        isFeatured
                          ? "sm:text-3xl sm:font-bold"
                          : "font-semibold",
                      )}
                    >
                      {tool.label}
                    </CardTitle>
                    <CardDescription
                      className={cn(
                        "line-clamp-2",
                        isFeatured
                          ? "mt-2 sm:line-clamp-8 sm:text-base"
                          : "text-sm",
                      )}
                    >
                      {tool.path === "/tools/analog-scaling"
                        ? "Tính toán nhanh chóng và chính xác việc quy đổi tín hiệu Analog 4-20mA về dải giá trị thực tế (Engineering Value) cho PLC."
                        : tool.path === "/tools/rs485-hex"
                          ? "Tiện ích tra cứu nhanh và phân tích mã HEX, cấu trúc bit mapping truyền thông chuẩn RS485."
                          : "Công cụ tiện ích hỗ trợ nhanh chóng cho các dự án tự động hóa của ní."}
                    </CardDescription>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </ToolLayout>
  );
}
