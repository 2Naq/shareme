import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MathRendererBlock, { MathRenderInline } from "@/components/MathRenderer";

export default function FormulaCard({ calculations }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">
          Công thức tính toán
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-3 bg-background rounded-lg border flex justify-center items-center overflow-x-auto min-h-17.5 bg-grid">
          <MathRendererBlock formula={calculations.latexFormula} />
        </div>
        <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
          {MathRenderInline(
            String.raw`Trong đó:
            <br /> $\rho$ là điện trở suất dây dẫn ($\Omega \cdot mm^2/m$) 
            <br /> $L$ là chiều dài (m), 
            <br /> $S$ là tiết diện ($mm^2$), 
            <br /> $I$ là dòng tải (A), $\cos\varphi$ là hệ số công suất,
            <br /> $X_L$ là cảm kháng ($\Omega$).`,
          )}
        </p>
      </CardContent>
    </Card>
  );
}
