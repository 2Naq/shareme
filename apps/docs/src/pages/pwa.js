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
      className={`flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-bold shadow-lg shadow-blue-500/20 transition-all duration-200 ${
        canInstall
          ? "cursor-pointer border-none bg-blue-600 text-white hover:bg-blue-500 active:scale-95"
          : "cursor-not-allowed border border-slate-700/50 bg-slate-800 text-slate-500"
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

      <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-16 font-sans text-slate-100">
        {/* Glow Effects */}
        <div className="pointer-events-none absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-blue-500/10 blur-[150px]" />
        <div className="pointer-events-none absolute right-[-10%] bottom-[-10%] h-[50%] w-[50%] rounded-full bg-emerald-500/10 blur-[150px]" />

        <div className="relative z-10 mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold tracking-wider text-blue-400 uppercase">
              <Sparkles className="size-3.5" />
              Progressive Web App
            </div>
            <h1 className="mb-4 bg-linear-to-r from-blue-400 via-indigo-200 to-emerald-400 bg-clip-text pb-4 text-4xl font-extrabold tracking-tight text-transparent md:text-6xl">
              Cài Đặt Ứng Dụng ShareMe PWA
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-400">
              Cài đặt ShareMe trực tiếp lên màn hình điện thoại hoặc máy tính
              của bạn. Dễ dàng truy cập ngoại tuyến, tốc độ mượt mà và khởi chạy
              nhanh chóng chỉ với 1 chạm.
            </p>
          </div>

          {/* Current Manifest Indicator Alert */}
          <div className="mx-auto mb-10 flex max-w-3xl items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Info className="size-5" />
              </div>
              <div>
                <div className="text-sm font-medium text-slate-200">
                  Trình duyệt đang cấu hình manifest cho:{" "}
                  <span className="font-semibold text-blue-400 uppercase">
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
          <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Card 1: PWA Chung */}
            <div
              className={`relative flex h-full flex-col rounded-3xl border bg-slate-900/40 p-6 backdrop-blur-md transition-all duration-300 ${
                currentMode === "all"
                  ? "scale-[1.02] border-indigo-500 shadow-[0_0_50px_-12px_rgba(99,102,241,0.3)] ring-2 ring-indigo-500/20"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              {currentMode === "all" && (
                <div className="absolute top-0 right-6 -translate-y-1/2 rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow-lg">
                  Kích Hoạt Sẵn Sàng
                </div>
              )}
              <div className="mb-6 flex size-14 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 shadow-inner">
                <Package className="size-7" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-white">
                ShareMe (Chung)
              </h3>
              <p className="mb-6 grow text-sm text-slate-400">
                Giải pháp tổng hợp đầy đủ nhất. Bao gồm toàn bộ tài liệu kỹ
                thuật số tự động hóa (PLC, Inverter) và tất cả công cụ (Vite
                tools) tính toán kỹ thuật trong một ứng dụng duy nhất.
              </p>
              <div className="mb-8 space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Check className="size-4 shrink-0 text-emerald-400" />
                  <span>Tra cứu tài liệu PLC, Biến tần...</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Check className="size-4 shrink-0 text-emerald-400" />
                  <span>Đầy đủ công cụ tính toán điện, analog...</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Check className="size-4 shrink-0 text-emerald-400" />
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
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-indigo-500/30 px-6 py-3.5 font-semibold text-indigo-400 transition-all duration-200 hover:border-indigo-500 hover:bg-indigo-500/10"
                >
                  Kích hoạt cài đặt
                  <ArrowRight className="size-4" />
                </button>
              )}
            </div>

            {/* Card 2: PWA Docs */}
            <div
              className={`relative flex h-full flex-col rounded-3xl border bg-slate-900/40 p-6 backdrop-blur-md transition-all duration-300 ${
                currentMode === "docs"
                  ? "scale-[1.02] border-blue-500 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] ring-2 ring-blue-500/20"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              {currentMode === "docs" && (
                <div className="absolute top-0 right-6 -translate-y-1/2 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow-lg">
                  Kích Hoạt Sẵn Sàng
                </div>
              )}
              <div className="mb-6 flex size-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-400 shadow-inner">
                <BookOpen className="size-7" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-white">
                ShareMe Docs
              </h3>
              <p className="mb-6 grow text-sm text-slate-400">
                Phiên bản tối ưu chuyên đọc tài liệu kỹ thuật. Phù hợp cho ní
                muốn tập trung tra cứu tài liệu, bảng mã lỗi và chia sẻ kinh
                nghiệm kỹ thuật.
              </p>
              <div className="mb-8 space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Check className="size-4 shrink-0 text-emerald-400" />
                  <span>Tra cứu tài liệu PLC Omron, Mitsubishi...</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Check className="size-4 shrink-0 text-emerald-400" />
                  <span>Xem tài liệu mã lỗi biến tần</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Check className="size-4 shrink-0 text-emerald-400" />
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
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-blue-500/30 px-6 py-3.5 font-semibold text-blue-400 transition-all duration-200 hover:border-blue-500 hover:bg-blue-500/10"
                >
                  Kích hoạt cài đặt
                  <ArrowRight className="size-4" />
                </button>
              )}
            </div>

            {/* Card 3: PWA Tools */}
            <div className="relative flex h-full flex-col rounded-3xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md transition-all duration-300 hover:border-slate-700">
              <div className="mb-6 flex size-14 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 shadow-inner">
                <Cpu className="size-7" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-white">
                ShareMe Tools
              </h3>
              <p className="mb-6 grow text-sm text-slate-400">
                Ứng dụng công cụ tính toán kỹ thuật tự động hóa chuyên biệt.
                Siêu nhẹ và siêu nhanh, phù hợp cài đặt độc lập để lập trình
                viên sử dụng nhanh trên tủ điện hoặc hiện trường.
              </p>
              <div className="mb-8 space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Check className="size-4 shrink-0 text-emerald-400" />
                  <span>Tính toán chuyển đổi Analog Scaling cực nhanh</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Check className="size-4 shrink-0 text-emerald-400" />
                  <span>Phân tích mã HEX Modbus RTU RS485</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Check className="size-4 shrink-0 text-emerald-400" />
                  <span>Tạo và Quét mã QR, tính thông số điện</span>
                </div>
              </div>

              <a
                href="/shareme/tool/"
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-center font-semibold text-white no-underline shadow-lg shadow-emerald-500/10 transition-all duration-200 hover:bg-emerald-500 hover:shadow-emerald-500/20 active:scale-95"
              >
                Mở Tools và Cài đặt
                <ExternalLink className="size-4" />
              </a>
            </div>
          </div>

          {/* Installation steps for different devices */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 backdrop-blur-md">
            <h2 className="mb-8 flex items-center gap-3 text-2xl font-bold text-white">
              <Smartphone className="size-6 text-emerald-400" />
              Hướng dẫn cài đặt trên các thiết bị
            </h2>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-200">
                  <Monitor className="size-4.5 text-blue-400" />
                  Máy tính (Chrome, Edge, Brave...)
                </h4>
                <ol className="list-inside list-decimal space-y-2.5 text-sm text-slate-400">
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
                    <span className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-xs font-bold text-slate-200">
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
                <h4 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-200">
                  <Smartphone className="size-4.5 text-blue-400" />
                  Điện thoại (iOS / Safari & Android / Chrome)
                </h4>
                <ul className="space-y-2.5 text-sm text-slate-400">
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
