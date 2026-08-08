import React from "react";
import ToolLayout from "../../components/ToolLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function HmiIntroPage() {
  return (
    <ToolLayout title="HMI Tools" description="Công cụ cho HMI">
      <Card className="bg-card max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">HMI Tools</CardTitle>
          <CardDescription className="text-lg">
            Công cụ dành cho màn hình HMI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Chào mừng đến với danh mục công cụ cho màn hình HMI.
            <br />
            <br />
            Nội dung đang được cập nhật...
          </p>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
