import React from 'react';
import ToolLayout from '../../components/ToolLayout';
import AnalogScaling from '../../components/tools/AnalogScaling';

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
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-x-auto font-mono text-sm border border-gray-200 dark:border-gray-700">
          Result = ((Input - Raw_Min) * (Eng_Max - Eng_Min)) / (Raw_Max - Raw_Min) + Eng_Min
        </div>
      </div>
    </ToolLayout>
  );
}
