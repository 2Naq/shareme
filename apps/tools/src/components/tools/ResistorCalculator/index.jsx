import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SmdTab from "./component/smdTab";
import ResistorCaculator from "./component/resistorCaculator";
import BrakingResistorTab from "./component/brakingResistorTab";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ResistorCalculator() {
  return (
    <div className="mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Tính Toán Điện Trở
        </h1>
        <p className="text-muted-foreground">
          Công cụ đọc giá trị điện trở thang màu (through-hole), điện trở dán
          SMD và tính chọn điện trở xả cho biến tần.
        </p>
      </div>

      <Tabs defaultValue="braking">
        <ScrollArea>
          <TabsList className="flex overflow-y-hidden no-scrollbar group-data-horizontal/tabs:h-12 sm:w-auto">
            <TabsTrigger value="braking">Điện Trở Xả (Biến tần)</TabsTrigger>
            <TabsTrigger value="color-band">Thang Màu (4-5 vòng)</TabsTrigger>
            <TabsTrigger value="smd">Điện Trở dán SMD</TabsTrigger>
          </TabsList>
        </ScrollArea>

        <TabsContent value="color-band">
          <ResistorCaculator />
        </TabsContent>

        <TabsContent value="smd">
          <SmdTab />
        </TabsContent>

        <TabsContent value="braking">
          <BrakingResistorTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
