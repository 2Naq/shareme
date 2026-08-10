import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import FX3UTab from "./components/FX3UTab";
import LE3UTab from "./components/LE3UTab";

export default function Rs485HexCalculator() {
  return (
    <div className="mx-auto space-y-6">
      <div>
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          Tính Mã Hex Cấu Hình RS485
        </h1>
        <p className="text-muted-foreground">
          Công cụ tính toán mã Hex cho thanh ghi <Badge>D8120</Badge>{" "}
          <Badge>D8400</Badge> <Badge>D8420</Badge> — PLC Mitsubishi dòng FX.
        </p>
      </div>

      <Tabs defaultValue="fx3u" className="w-full">
        <TabsList>
          <TabsTrigger value="fx3u">FX3U</TabsTrigger>
          <TabsTrigger value="le3u">LE3U</TabsTrigger>
        </TabsList>
        <TabsContent value="fx3u" className="mt-6">
          <FX3UTab />
        </TabsContent>
        <TabsContent value="le3u" className="mt-6">
          <LE3UTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
