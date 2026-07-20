import React, { useEffect, useRef } from "react";
import "katex/dist/katex.min.css";
import katex from "katex";

/**
 * Component hiển thị công thức toán học sử dụng KaTeX.
 *
 * ### Cách sử dụng
 * ```jsx
 * // Khuyên dùng template literal (String.raw) để tránh lỗi escape ký tự '\'
 * <MathRendererBlock formula={String.raw`R_{tổng} = R_1 + R_2`} />
 * ```
 *
 * ### Cú pháp Toán học (KaTeX/LaTeX) cơ bản:
 *
 * **1. Phân số & Căn bậc**
 * - Phân số: `\frac{a}{b}` ➔ a/b
 * - Căn bậc 2: `\sqrt{x}` ➔ √x
 * - Căn bậc n: `\sqrt[3]{x}` ➔ ³√x
 *
 * **2. Số mũ & Chỉ số dưới**
 * - Số mũ: `x^2` hoặc `e^{2x}`
 * - Chỉ số dưới: `R_1` hoặc `R_{tổng}`
 *
 * **3. Phép toán & Ký hiệu**
 * - Nhân: `A \times B` (dấu x) hoặc `A \cdot B` (dấu chấm)
 * - Chia: `A \div B`
 * - Cộng trừ: `\pm` (±)
 * - Khác: `\neq` (≠), Gần bằng: `\approx` (≈)
 * - Ohm (Ω): `\Omega`, Micro (μ): `\mu`, Pi (π): `\pi`, Delta (Δ): `\Delta`
 *
 * **4. Dấu ngoặc (Tự co giãn)**
 * - `\left( \frac{a}{b} \right)` ➔ Ngoặc tròn to
 * - `\left[ \frac{a}{b} \right]` ➔ Ngoặc vuông to
 *
 * **5. Hàm số & Chữ bình thường**
 * - Hàm số: `\sin(x)`, `\cos(x)`, `\log(x)`
 * - Chữ không in nghiêng: `\text{chữ}` (VD: `R_{\text{tổng}}`)
 *
 * @param {Object} props
 * @param {string} props.formula - Chuỗi công thức toán học (bắt buộc). Dùng String.raw để không bị lỗi dấu \
 * @param {boolean} [props.displayMode=true] - `true`: Hiển thị dạng Block (to, giữa). `false`: Dạng Inline (nhỏ, cùng dòng).
 * @param {string} [props.className=""] - CSS class (Tailwind) để custom style (màu chữ, margin...).
 */
export default function MathRendererBlock({
  formula,
  displayMode = true,
  className = "",
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && formula) {
      katex.render(formula, containerRef.current, {
        displayMode,
        throwOnError: false, // Không crash ứng dụng nếu nhập ngu
      });
    }
  }, [formula, displayMode]);

  return <div ref={containerRef} className={className} />;
}

/**
 * - Sử dụng $...$ để render công thức toán trong chuỗi text
 * - Ví dụ: "Công thức tính điện trở là $R = \frac{V}{I}$"
 *
 */
export function MathRenderInline(propsOrText) {
  let content = "";
  let className = "";
  if (typeof propsOrText === "string") {
    content = propsOrText;
  } else if (propsOrText && typeof propsOrText === "object") {
    content = propsOrText.formula || propsOrText.text || propsOrText.children || "";
    className = propsOrText.className || "";
  }

  if (typeof content !== "string") {
    return <span className={className}>{content}</span>;
  }

  const html = content.replace(/\$([^$]+)\$/g, (_, formula) =>
    katex.renderToString(formula, { throwOnError: false, displayMode: false }),
  );
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
