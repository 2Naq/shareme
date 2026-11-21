import React, { useState, useMemo } from "react";
import { analyzeAddressInput } from "./utils/weconAddressMapper";
import { ConverterPanel } from "./components/ConverterPanel";
import { ConversionResultCard } from "./components/ConversionResultCard";
import { BatchGeneratorPanel } from "./components/BatchGeneratorPanel";
import { AddressReferenceTable } from "./components/AddressReferenceTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeftRight, Table as TableIcon, ListOrdered, Info } from "lucide-react";

export default function WeconModbusMap() {
  const [query, setQuery] = useState("M0");
  const [offsetPreference, setOffsetPreference] = useState("both");

  const analysis = useMemo(() => {
    return analyzeAddressInput(query);
  }, [query]);

  return (
    <div className="mx-auto space-y-6">
      {/* Tiêu đề trang */}
      <div className="space-y-1.5">
        <h1 className="text-foreground flex items-center gap-2.5 text-2xl font-bold tracking-tight sm:text-3xl">
          <ArrowLeftRight className="text-primary h-7 w-7 shrink-0" />
          Chuyển Đổi & Tra Cứu Địa Chỉ Modbus PLC WECON (LX6V / LX6A / LX5V)
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Công cụ ánh xạ 2 chiều giữa địa chỉ vùng nhớ thiết bị PLC WECON (
          <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">M, D, X, Y, S, SM, SD, R, T, C, LC, HSC</code>
          ) và địa chỉ trạm tớ Modbus RTU/TCP — hỗ trợ đồng thời chuẩn{" "}
          <strong>0-Based (PLC gốc / Khung Hex)</strong> và{" "}
          <strong>1-Based (+1 Offset cho màn hình HMI Weintek / EasyBuilder Pro)</strong>.
        </p>
      </div>

      {/* Khối nhập liệu & Chuyển đổi 2 chiều */}
      <ConverterPanel
        query={query}
        setQuery={setQuery}
        offsetPreference={offsetPreference}
        setOffsetPreference={setOffsetPreference}
        analysis={analysis}
      />

      {/* Kết quả chuyển đổi xuôi / ngược */}
      <ConversionResultCard
        analysis={analysis}
        offsetPreference={offsetPreference}
        onSelectDevice={(dev) => setQuery(dev)}
      />

      {/* Tabs: Bảng quy chiếu chuẩn WECON & Tạo danh sách Tag hàng loạt */}
      <Tabs defaultValue="reference" className="space-y-4">
        <TabsList className="h-auto gap-1 p-1">
          <TabsTrigger value="reference" className="gap-1.5 text-xs sm:text-sm">
            <TableIcon className="h-4 w-4" />
            Bảng Quy Chiếu Địa Chỉ Trạm Tớ
          </TabsTrigger>
          <TabsTrigger value="batch" className="gap-1.5 text-xs sm:text-sm">
            <ListOrdered className="h-4 w-4" />
            Tạo Bảng Tag Hàng Loạt (Excel)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reference">
          <AddressReferenceTable onSelectExample={(dev) => setQuery(dev)} />
        </TabsContent>

        <TabsContent value="batch">
          <BatchGeneratorPanel onSelectDevice={(dev) => setQuery(dev)} />
        </TabsContent>
      </Tabs>

      {/* Ghi chú kỹ thuật quan trọng */}
      <div className="border-border/60 bg-muted/30 space-y-2 rounded-2xl border p-4 text-xs">
        <div className="text-foreground flex items-center gap-2 font-semibold">
          <Info className="text-primary h-4 w-4" />
          Lưu ý kỹ thuật khi kết nối Modbus PLC WECON với HMI Weintek / SCADA:
        </div>
        <ul className="text-muted-foreground list-disc space-y-1 pl-5 leading-relaxed">
          <li>
            <strong>Độ lệch +1 (1-Based Addressing):</strong> Khi chọn driver{" "}
            <em>Modbus RTU / Modbus TCP (Zero-based hay 1-based)</em> trên phần mềm{" "}
            <strong>EasyBuilder Pro (HMI Weintek)</strong>, vùng nhớ{" "}
            <code className="font-mono">0x</code> (Bit) và{" "}
            <code className="font-mono">4x</code> (Word) bắt đầu từ{" "}
            <strong>1</strong> nên cần cộng thêm <strong>+1</strong> vào địa chỉ thập phân gốc của PLC (ví dụ:{" "}
            <code className="font-mono font-bold">M0</code> có địa chỉ PLC gốc là{" "}
            <code className="font-mono">0x1000 = 4096</code> → nhập trên HMI Weintek là{" "}
            <code className="font-mono font-bold">0x 4097</code>).
          </li>
          <li>
            <strong>Ngõ vào/ra vật lý X và Y dùng hệ Bát phân (Octal):</strong>{" "}
            Từ <code className="font-mono">X0~X7</code> là 8 bit đầu tiên, bit thứ 9 là{" "}
            <code className="font-mono font-bold">X10</code> (tương đương chỉ số thập phân = 8 → địa chỉ 0-based ={" "}
            <code className="font-mono">57344 + 8 = 57352</code>, địa chỉ Weintek +1 ={" "}
            <code className="font-mono font-bold">57353</code>).
          </li>
          <li>
            <strong>Bộ đếm 32-bit (LC và HSC):</strong> Trong bảng{" "}
            <strong>Bit (Coil)</strong> mỗi phần tử chiếm <strong>1 bit</strong>, nhưng trong bảng{" "}
            <strong>Word (Register)</strong> mỗi phần tử là thanh ghi 32-bit nên chiếm{" "}
            <strong>2 Word liên tiếp</strong> (bước nhảy = 2: ví dụ{" "}
            <code className="font-mono">LC0 = 2560</code>,{" "}
            <code className="font-mono">LC1 = 2562</code>).
          </li>
        </ul>
      </div>
    </div>
  );
}
