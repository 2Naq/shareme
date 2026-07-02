import React from 'react';
import ToolLayout from '../../components/ToolLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function InverterIntroPage() {
  return (
    <ToolLayout title="Inverter Tools" description="Công cụ cho biến tần">
      <Card className="max-w-2xl bg-card">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Inverter Tools</CardTitle>
          <CardDescription className="text-lg">Công cụ dành cho Biến tần</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Chào mừng đến với danh mục công cụ cho biến tần (Inverter).
            <br/><br/>
            Nội dung đang được cập nhật...
          </p>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
