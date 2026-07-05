import React from 'react';
import ToolLayout from '@/components/ToolLayout';
import AnalogScaling from '@/components/tools/AnalogScaling';
import MathRenderer from '@/components/MathRenderer';

export default function AnalogScalingPage() {
  return (
    <ToolLayout
      title="Analog Scaling 4-20mA"
      description="Công cụ tính toán quy đổi tín hiệu Analog 4-20mA về dải giá trị thực tế (Engineering Value)."
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tính toán Scaling Analog 4-20mA</h1>
        <p className="text-gray-500">
          Đây là công cụ hỗ trợ quy đổi tín hiệu Analog 4-20mA về dải giá trị thực tế (Engineering Value) dùng cho lập trình PLC.
        </p>
      </div>

      <div className="mb-10">
        <AnalogScaling />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Công thức sử dụng:</h2>
        <div className="p-4 rounded-lg overflow-x-auto border bg-card bg-separator">
          <MathRenderer formula="\text{Result} = \frac{(\text{Input} - \text{Raw\_Min}) \times (\text{Eng\_Max} - \text{Eng\_Min})}{\text{Raw\_Max} - \text{Raw\_Min}} + \text{Eng\_Min}" />
        </div>
      </div>
    </ToolLayout>
  );
}
