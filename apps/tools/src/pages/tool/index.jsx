import React from 'react';
import ToolLayout from '../../components/ToolLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Zap } from "lucide-react";

export default function ToolPage() {
  return (
    <ToolLayout title="Công cụ tự động hóa" description="Tổng hợp các tiện ích tính toán và chuyển đổi hỗ trợ cho kỹ sư tự động hóa.">
      <div className="text-center mt-10">
        <h1 className="text-4xl font-bold mb-4 text-foreground">Chào mừng đến với hệ thống Tool</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Chọn một công cụ từ thanh Sidebar bên trái để bắt đầu. Các công cụ này được viết hoàn toàn bằng React để mang lại trải nghiệm tương tác nhanh và mượt mà nhất.
        </p>
        
        <Alert className="max-w-xl mx-auto text-left bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
          <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertTitle className="text-blue-900 dark:text-blue-300 font-semibold">Hướng dẫn sử dụng</AlertTitle>
          <AlertDescription className="text-blue-800 dark:text-blue-400 mt-2">
            <ul className="list-disc pl-5 m-0 space-y-1">
              <li>Chọn <strong>Analog Scaling 4-20mA</strong> để thử quy đổi tín hiệu cho PLC.</li>
              <li>Tool tính toán dành cho Biến tần và HMI sẽ được cập nhật thêm sau.</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    </ToolLayout>
  );
}
