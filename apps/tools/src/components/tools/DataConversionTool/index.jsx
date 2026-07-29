import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Binary,
  Hash,
  ArrowLeftRight,
  Calculator,
  Layers,
  Code2,
} from "lucide-react";
import {
  NumberBaseConverter,
  ModbusFrameBuilder,
  FloatRegisterConverter,
  DataConverter,
  Crc16Calculator,
  AsciiHexConverter,
} from "./tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const TABS = [
  { value: "base", label: "Hệ cơ số", icon: Binary, comp: NumberBaseConverter },
  { value: "crc", label: "CRC16", icon: Calculator, comp: Crc16Calculator },
  {
    value: "data",
    label: "Dec/Hex/Swap",
    icon: ArrowLeftRight,
    comp: DataConverter,
  },
  {
    value: "float",
    label: "Float↔Reg",
    icon: Layers,
    comp: FloatRegisterConverter,
  },
  {
    value: "modbus",
    label: "Modbus Frame",
    icon: Hash,
    comp: ModbusFrameBuilder,
  },
  { value: "ascii", label: "ASCII↔HEX", icon: Code2, comp: AsciiHexConverter },
];

export default function DataConversionTool() {
  return (
    <div className="mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Binary className="text-primary w-8 h-8" />
          Công Cụ Chuyển Đổi Dữ Liệu
        </h1>
        <p className="text-muted-foreground">
          Bộ công cụ chuyển đổi hệ cơ số, CRC16, Float/Register, Modbus Frame và
          ASCII.
        </p>
      </div>

      <Tabs defaultValue="base">
        <ScrollArea>
          <TabsList className="flex h-auto gap-1 mb-2">
            {TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value} className="gap-1.5">
                <Icon className="w-3.5 h-3.5" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {TABS.map(({ value, comp: Comp }) => (
          <TabsContent key={value} value={value}>
            <Comp />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
