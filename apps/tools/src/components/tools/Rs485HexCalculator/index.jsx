import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import RSTab from "./components/RSTab";
import RS2Tab from "./components/RS2Tab";
import LE3UTab from "./components/LE3UTab";
const tabs = [
  {
    name: "RS",
    value: "rs",
    content: <RSTab />,
  },
  {
    name: "RS2",
    value: "rs2",
    content: <RS2Tab />,
  },
  {
    name: "LE3U",
    value: "le3u",
    content: <LE3UTab />,
  },
];
export default function Rs485HexCalculator() {
  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          Tính Mã Hex Cấu Hình RS485
        </h1>
        <p className="text-muted-foreground">
          Công cụ tính toán mã Hex cho thanh ghi <Badge>D8120</Badge>{" "}
          <Badge>D8370</Badge> <Badge>D8400</Badge> <Badge>D8420</Badge> — PLC
          Mitsubishi dòng FX.
        </p>
      </div>

      <Tabs defaultValue="rs" className="w-full sm:hidden">
        <TabsList>
          <TabsTrigger value="rs">RS</TabsTrigger>
          <TabsTrigger value="rs2">RS2</TabsTrigger>
          <TabsTrigger value="le3u">LE3U</TabsTrigger>
        </TabsList>
        <TabsContent value="rs" className="mt-6">
          <RSTab />
        </TabsContent>
        <TabsContent value="rs2" className="mt-6">
          <RS2Tab />
        </TabsContent>
        <TabsContent value="le3u" className="mt-6">
          <LE3UTab />
        </TabsContent>
      </Tabs>
      <Tabs
        defaultValue="rs"
        orientation="vertical"
        className="relative hidden sm:flex"
      >
        <TabsList
          variant="line"
          className="sticky top-0 mr-3 rounded-none border-r p-0"
        >
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="border-0 border-r group-data-vertical/tabs:after:-right-px"
            >
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
