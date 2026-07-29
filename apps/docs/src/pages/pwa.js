import React, { useState, useEffect } from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import {
  BookOpen,
  Cpu,
  Download,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Smartphone,
  Monitor,
  Info,
  Check,
  Package,
} from "lucide-react";

const BtnInstall = ({
  children,
  disabled: handleInstallClick,
  onClick: canInstall,
}) => {
  return (
    <button
      onClick={handleInstallClick}
      disabled={canInstall}
      className={`w-full py-3.5 px-6 rounded-2xl font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 ${
        canInstall
          ? "bg-blue-600 hover:bg-blue-500 text-white cursor-pointer active:scale-95 border-none"
          : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50"
      }`}
    >
      {children}
    </button>
  );
};

export default function PwaHub() {
  const { siteConfig } = useDocusaurusContext();
  const [currentMode, setCurrentMode] = useState("all");
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect current PWA manifest mode from URL or localStorage
    const params = new URLSearchParams(window.location.search);
    const mode =
      params.get("pwa") || localStorage.getItem("pwa-preference") || "all";
    setCurrentMode(mode);

    // Check if install prompt is ready
    const checkPrompt = () => {
      setCanInstall(!!window.deferredPrompt);
    };

    window.addEventListener("pwa-install-prompt-ready", checkPrompt);
    // Also listen to beforeinstallprompt just in case
    window.addEventListener("beforeinstallprompt", checkPrompt);

    checkPrompt();

    return () => {
      window.removeEventListener("pwa-install-prompt-ready", checkPrompt);
      window.removeEventListener("beforeinstallprompt", checkPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (typeof window === "undefined") return;
    const promptEvent = window.deferredPrompt;
    if (!promptEvent) {
      alert(
        "Trình duyệt chưa sẵn sàng cài đặt PWA hoặc ứng dụng đã được cài đặt. Vui lòng thử lại sau vài giây hoặc sử dụng nút cài đặt trên thanh địa chỉ của trình duyệt.",
      );
      return;
    }

    promptEvent.prompt();
    await promptEvent.userChoice;
    window.deferredPrompt = null;
    setCanInstall(false);
  };

  const handleSwitchMode = (mode) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("pwa-preference", mode);
    window.location.href = `/shareme/pwa?pwa=${mode}`;
  };

  return (
    <Layout
      noFooter
      title={`Cài đặt ứng dụng PWA - ${siteConfig.title}`}
      description="Trung tâm cài đặt Progressive Web App (PWA) cho ShareMe. Cài đặt các phiên bản độc lập PWA Chung, PWA Tài liệu (Docs), PWA Công cụ (Tools)."
    >
      <Head>
        <title>Cài đặt ứng dụng PWA | ShareMe</title>
      </Head>

      <main className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 relative overflow-hidden font-sans">
        {/* Glow Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="size-3.5" />
              Progressive Web App
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 pb-4 bg-linear-to-r from-blue-400 via-indigo-200 to-emerald-400 bg-clip-text text-transparent">
              Cài Đặt Ứng Dụng ShareMe PWA
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Cài đặt ShareMe trực tiếp lên màn hình điện thoại hoặc máy tính
              của bạn. Dễ dàng truy cập ngoại tuyến, tốc độ mượt mà và khởi chạy
              nhanh chóng chỉ với 1 chạm.
            </p>
          </div>

          {/* Current Manifest Indicator Alert */}
          <div className="mb-10 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md flex items-center justify-between gap-4 max-w-3xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                <Info className="size-5" />
              </div>
              <div>
                <div className="text-sm font-medium text-slate-200">
                  Trình duyệt đang cấu hình manifest cho:{" "}
                  <span className="text-blue-400 font-semibold uppercase">
                    {currentMode === "all"
                      ? "Bản Chung (Docs & Tools)"
                      : "Bản Docs (Tài liệu)"}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Nếu muốn cài đặt phiên bản khác, hãy nhấn nút "Kích hoạt cài
                  đặt" ở thẻ tương ứng bên dưới.
                </div>
              </div>
            </div>
          </div>

          {/* 3 cards grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Card 1: PWA Chung */}
            <div
              className={`relative rounded-3xl p-6 transition-all duration-300 flex flex-col h-full bg-slate-900/40 border backdrop-blur-md ${
                currentMode === "all"
                  ? "border-indigo-500 ring-2 ring-indigo-500/20 shadow-[0_0_50px_-12px_rgba(99,102,241,0.3)] scale-[1.02]"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              {currentMode === "all" && (
                <div className="absolute top-0 right-6 -translate-y-1/2 px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg">
                  Kích Hoạt Sẵn Sàng
                </div>
              )}
              <div className="size-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 shadow-inner">
                <Package className="size-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                ShareMe (Chung)
              </h3>
              <p className="text-sm text-slate-400 mb-6 grow">
                Giải pháp tổng hợp đầy đủ nhất. Bao gồm toàn bộ tài liệu kỹ
                thuật số tự động hóa (PLC, Inverter) và tất cả công cụ (Vite
                tools) tính toán kỹ thuật trong một ứng dụng duy nhất.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Check className="size-4 text-emerald-400 shrink-0" />
                  <span>Tra cứu tài liệu PLC, Biến tần...</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Check className="size-4 text-emerald-400 shrink-0" />
                  <span>Đầy đủ công cụ tính toán điện, analog...</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Check className="size-4 text-emerald-400 shrink-0" />
                  <span>Tốc độ tải nhanh, hỗ trợ lưu offline</span>
                </div>
              </div>

              {currentMode === "all" ? (
                <BtnInstall onClick={handleInstallClick} disabled={!canInstall}>
                  <Download className="size-4" />
                  {canInstall
                    ? "Cài đặt ShareMe Chung"
                    : "Đã cài đặt hoặc chưa sẵn sàng"}
                </BtnInstall>
              ) : (
                <button
                  onClick={() => handleSwitchMode("all")}
                  className="w-full py-3.5 px-6 rounded-2xl font-semibold border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Kích hoạt cài đặt
                  <ArrowRight className="size-4" />
                </button>
              )}
            </div>

            {/* Card 2: PWA Docs */}
            <div
              className={`relative rounded-3xl p-6 transition-all duration-300 flex flex-col h-full bg-slate-900/40 border backdrop-blur-md ${
                currentMode === "docs"
                  ? "border-blue-500 ring-2 ring-blue-500/20 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] scale-[1.02]"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              {currentMode === "docs" && (
                <div className="absolute top-0 right-6 -translate-y-1/2 px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg">
                  Kích Hoạt Sẵn Sàng
                </div>
              )}
              <div className="size-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 shadow-inner">
                <BookOpen className="size-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                ShareMe Docs
              </h3>
              <p className="text-sm text-slate-400 mb-6 grow">
                Phiên bản tối ưu chuyên đọc tài liệu kỹ thuật. Phù hợp cho ní
                muốn tập trung tra cứu tài liệu, bảng mã lỗi và chia sẻ kinh
                nghiệm kỹ thuật.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Check className="size-4 text-emerald-400 shrink-0" />
                  <span>Tra cứu tài liệu PLC Omron, Mitsubishi...</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Check className="size-4 text-emerald-400 shrink-0" />
                  <span>Xem tài liệu mã lỗi biến tần</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Check className="size-4 text-emerald-400 shrink-0" />
                  <span>Giao diện đọc sách, blog</span>
                </div>
              </div>

              {currentMode === "docs" ? (
                <BtnInstall onClick={handleInstallClick} disabled={!canInstall}>
                  <Download className="size-4" />
                  {canInstall
                    ? "Cài đặt ShareMe Docs"
                    : "Đã cài đặt hoặc chưa sẵn sàng"}
                </BtnInstall>
              ) : (
                <button
                  onClick={() => handleSwitchMode("docs")}
                  className="w-full py-3.5 px-6 rounded-2xl font-semibold border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Kích hoạt cài đặt
                  <ArrowRight className="size-4" />
                </button>
              )}
            </div>

            {/* Card 3: PWA Tools */}
            <div className="relative rounded-3xl p-6 transition-all duration-300 flex flex-col h-full bg-slate-900/40 border border-slate-800 hover:border-slate-700 backdrop-blur-md">
              <div className="size-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 shadow-inner">
                <Cpu className="size-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                ShareMe Tools
              </h3>
              <p className="text-sm text-slate-400 mb-6 grow">
                Ứng dụng công cụ tính toán kỹ thuật tự động hóa chuyên biệt.
                Siêu nhẹ và siêu nhanh, phù hợp cài đặt độc lập để lập trình
                viên sử dụng nhanh trên tủ điện hoặc hiện trường.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Check className="size-4 text-emerald-400 shrink-0" />
                  <span>Tính toán chuyển đổi Analog Scaling cực nhanh</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Check className="size-4 text-emerald-400 shrink-0" />
                  <span>Phân tích mã HEX Modbus RTU RS485</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Check className="size-4 text-emerald-400 shrink-0" />
                  <span>Tạo và Quét mã QR, tính thông số điện</span>
                </div>
              </div>

              <a
                href="/shareme/tool/"
                className="w-full py-3.5 px-6 rounded-2xl font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-95 text-center no-underline"
              >
                Mở Tools và Cài đặt
                <ExternalLink className="size-4" />
              </a>
            </div>
          </div>

          {/* Installation steps for different devices */}
          <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <Smartphone className="size-6 text-emerald-400" />
              Hướng dẫn cài đặt trên các thiết bị
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-slate-200 text-base mb-3 flex items-center gap-2">
                  <Monitor className="size-4.5 text-blue-400" />
                  Máy tính (Chrome, Edge, Brave...)
                </h4>
                <ol className="list-decimal list-inside text-slate-400 text-sm space-y-2.5">
                  <li>
                    Nhấn nút{" "}
                    <strong className="text-slate-200">
                      "Kích hoạt cài đặt"
                    </strong>{" "}
                    ở phiên bản bạn mong muốn phía trên.
                  </li>
                  <li>
                    Nếu nút{" "}
                    <strong className="text-slate-200">"Cài đặt..."</strong>{" "}
                    sáng lên, hãy nhấn trực tiếp vào nút đó.
                  </li>
                  <li>
                    Nếu không, hãy tìm biểu tượng cài đặt{" "}
                    <span className="text-slate-200 font-bold border border-slate-700 px-1.5 py-0.5 rounded bg-slate-800 text-xs">
                      ⊕
                    </span>{" "}
                    hoặc dấu 3 chấm dọc ở góc trên bên phải trình duyệt, chọn{" "}
                    <strong className="text-slate-200">
                      "Cài đặt ShareMe"
                    </strong>
                    .
                  </li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold text-slate-200 text-base mb-3 flex items-center gap-2">
                  <Smartphone className="size-4.5 text-blue-400" />
                  Điện thoại (iOS / Safari & Android / Chrome)
                </h4>
                <ul className="text-slate-400 text-sm space-y-2.5">
                  <li>
                    <strong className="text-slate-200">Android:</strong> Nhấp
                    vào nút{" "}
                    <strong className="text-slate-200">"Cài đặt"</strong> trên
                    màn hình, hoặc nhấn dấu 3 chấm góc phải trình duyệt và chọn{" "}
                    <strong className="text-slate-200">
                      "Thêm vào Màn hình chính"
                    </strong>
                    .
                  </li>
                  <li>
                    <strong className="text-slate-200">iOS (Safari):</strong>{" "}
                    Nhấn nút{" "}
                    <strong className="text-slate-200">Share (Chia sẻ)</strong>{" "}
                    trên Safari (biểu tượng mũi tên hướng lên từ hình vuông),
                    cuộn xuống và chọn{" "}
                    <strong className="text-slate-200">
                      "Thêm vào MH chính" (Add to Home Screen)
                    </strong>
                    .
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
