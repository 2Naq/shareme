import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Offset1Tab from './tabs/Offset1Tab';
import Offset2Tab from './tabs/Offset2Tab';
import ElbowTab from './tabs/ElbowTab';
import TeeTab from './tabs/TeeTab';
import CrossTab from './tabs/CrossTab';

export default function DuctCalculator() {
  return (
    <div className="mx-auto flex flex-col gap-6">
      <div>
        <p className="font-mono text-[11px] tracking-widest text-amber-400 uppercase mb-1">
          Industrial Duct Fabrication
        </p>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Tính Toán & Mô Phỏng Cắt Máng Điện
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Nhập thông số bên trái — bản vẽ và số liệu cập nhật trực tiếp. Thay đổi bề rộng máng hoặc góc cắt để xem hình mô phỏng biến đổi theo đúng tỉ lệ.
        </p>
      </div>

      <Tabs defaultValue="offset1">
        <TabsList className="w-full group-data-horizontal/tabs:h-12 sm:w-auto flex-wrap">
          <TabsTrigger value="offset1">Lệch tầng 1 khúc</TabsTrigger>
          <TabsTrigger value="offset2">Lệch tầng 2 khúc</TabsTrigger>
          <TabsTrigger value="elbow">Co ngang</TabsTrigger>
          <TabsTrigger value="tee">Tê nhánh (T)</TabsTrigger>
          <TabsTrigger value="cross">Chữ thập (X)</TabsTrigger>
        </TabsList>

        <TabsContent value="offset1">
          <Offset1Tab />
        </TabsContent>
        <TabsContent value="offset2">
          <Offset2Tab />
        </TabsContent>
        <TabsContent value="elbow">
          <ElbowTab />
        </TabsContent>
        <TabsContent value="tee">
          <TeeTab />
        </TabsContent>
        <TabsContent value="cross">
          <CrossTab />
        </TabsContent>
      </Tabs>

      <footer className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
        Công cụ tham khảo kỹ thuật — luôn kiểm tra lại số đo trên vật liệu thực tế trước khi cắt hàng loạt.
      </footer>
    </div>
  );
}
