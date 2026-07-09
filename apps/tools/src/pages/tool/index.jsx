import React from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { routeConfig } from '@/routes/routesConfig';
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import AboutHighlight from '@/components/AboutHighlight';

export default function ToolPage() {
  // Bỏ qua trang Home và các trang test/ẩn
  const tools = routeConfig.filter(route =>
    route.path !== '/tool' &&
    route.path !== '/tool/test' &&
    route.showInSidebar
  );

  return (
    <ToolLayout title="Công cụ tự động hóa" description="Tổng hợp các tiện ích tính toán và chuyển đổi hỗ trợ cho kỹ sư tự động hóa.">
      <div className="flex flex-col gap-8 py-6 max-w-6xl mx-auto">
        <div className="text-left mb-2 space-y-4">
          <h1 className="text-4xl tracking-tight lg:text-5xl text-foreground">
            Tổng hợp số tool{" "}
            <AboutHighlight text="Tự động hóa" className="italic font-semibold" />
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
            Bộ tiện ích tính toán, chuyển đổi và phân tích dành cho dành cho anh em kỹ thuật. Được thiết kế tối giản, với giao diện hiện đại giúp anh em xử lý công việc nhanh chóng.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 auto-rows-[220px] gap-4">
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
                  "group relative overflow-hidden rounded-3xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 block border bg-card text-card-foreground",
                  isFeatured ? "md:col-span-2 md:row-span-2 bg-primary/5 border-primary/20" : "",
                  isWide ? "md:col-span-2 lg:col-span-2 bg-secondary/30" : "lg:col-span-1"
                )}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-linear-to-t from-foreground/5 to-transparent pointer-events-none" />

                <Card className={cn("h-full border-0 bg-transparent shadow-none flex flex-col p-6 sm:p-8", !isFeatured && "justify-between")}>
                  <div className="flex justify-between items-start">
                    <div className={cn(
                      "rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                      isFeatured ? "w-16 h-16 bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "w-12 h-12 bg-muted text-muted-foreground"
                    )}>
                      {Icon && <Icon className={isFeatured ? "w-8 h-8" : "w-6 h-6"} />}
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 -translate-x-4 transition-all group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary" />
                  </div>

                  <div className="mt-4">
                    <CardTitle className={cn("mb-2 tracking-tight", isFeatured ? "text-3xl font-bold" : "text-xl font-semibold")}>
                      {tool.label}
                    </CardTitle>
                    <CardDescription className={cn("line-clamp-2", isFeatured ? "text-base mt-2 line-clamp-8" : "text-sm")}>
                      {tool.path === '/tool/analog-scaling' ? 'Tính toán nhanh chóng và chính xác việc quy đổi tín hiệu Analog 4-20mA về dải giá trị thực tế (Engineering Value) cho PLC.' :
                        tool.path === '/tool/rs485-hex' ? 'Tiện ích tra cứu nhanh và phân tích mã HEX, cấu trúc bit mapping truyền thông chuẩn RS485.' :
                          'Công cụ tiện ích hỗ trợ nhanh chóng cho các dự án tự động hóa của ní.'}
                    </CardDescription>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </ToolLayout>
  );
}
