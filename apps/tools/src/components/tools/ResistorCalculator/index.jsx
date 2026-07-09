import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SmdTab from './smdTab';
import ResistorCaculator from './resistorCaculator';




export default function ResistorCalculator() {
    return (
        <div className="mx-auto flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                    Tính Toán Điện Trở
                </h1>
                <p className="text-muted-foreground">
                    Công cụ đọc giá trị điện trở thang màu (through-hole) và điện trở dán SMD.
                </p>
            </div>

            <Tabs defaultValue="color-band ">
                <TabsList className="w-full group-data-horizontal/tabs:h-12 sm:w-auto">
                    <TabsTrigger value="color-band">
                        Thang Màu (4-5 vòng)
                    </TabsTrigger>
                    <TabsTrigger value="smd">
                        Điện Trở dán SMD
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="color-band">
                    <ResistorCaculator />
                </TabsContent>

                <TabsContent value="smd">
                    <SmdTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}