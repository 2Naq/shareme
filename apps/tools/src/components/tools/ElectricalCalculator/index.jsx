import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cog, Home as HomeIcon, Factory, Layers } from "lucide-react";

import MotorCalculator from "./components/MotorCalculator";
import ResidentialCalculator from "./components/ResidentialCalculator";
import IndustrialCalculator from "./components/IndustrialCalculator";
import SystemOverview from "./components/SystemOverview";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const TABS = [
  {
    id: "motor",
    label: "Motor & Biến tần",
    icon: Cog,
    component: MotorCalculator,
  },
  {
    id: "residential",
    label: "Điện Dân Dụng",
    icon: HomeIcon,
    component: ResidentialCalculator,
  },
  {
    id: "industrial",
    label: "Điện Công Nghiệp",
    icon: Factory,
    component: IndustrialCalculator,
  },
  {
    id: "system",
    label: "Tổng Hợp Hệ Thống",
    icon: Layers,
    component: SystemOverview,
  },
];

export default function ElectricalCalculator() {
  const [activeTab, setActiveTab] = useState("motor");

  return (
    <div className="mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Tính Toán Thông Số Điện
        </h1>
        <p className="text-muted-foreground">
          Tính toán nhanh các thông số điện cơ bản
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <ScrollArea>
          <TabsList className="flex h-10! gap-1 bg-muted/50 p-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="h-full p-1.5"
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="inline">{tab.label}</span>
                  {/* <span className="sm:hidden">{tab.label.split(" ")[0]}</span> */}
                </TabsTrigger>
              );
            })}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {TABS.map((tab) => {
          const TabComponent = tab.component;
          return (
            <TabsContent key={tab.id} value={tab.id} className="mt-6">
              <TabComponent />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
