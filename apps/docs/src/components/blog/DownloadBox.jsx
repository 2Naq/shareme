import React from "react";

// Biểu tượng loại tệp tin
function FileTypeIcon({ type = "pdf" }) {
  if (type === "code") {
    return (
      <svg
        className="size-6 shrink-0 text-blue-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    );
  }

  if (type === "archive" || type === "zip" || type === "rar") {
    return (
      <svg
        className="size-6 shrink-0 text-amber-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
        />
      </svg>
    );
  }

  if (type === "excel" || type === "sheet") {
    return (
      <svg
        className="size-6 shrink-0 text-emerald-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    );
  }

  // Mặc định biểu tượng PDF
  return (
    <svg
      className="size-6 shrink-0 text-red-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-6 4h4" />
    </svg>
  );
}

// Biểu tượng nút tải
function DownloadActionIcon() {
  return (
    <svg
      className="size-4 shrink-0 transition-transform group-hover/btn:translate-y-0.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
      />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

/**
 * Component hiển thị danh sách tệp tải về (PDF, Code, Tài liệu đính kèm)
 * Hỗ trợ truyền mảng items để map hoặc truyền props ngắn cho 1 tệp duy nhất.
 */
export default function DownloadBox({
  headerTitle = "Tài Liệu & Tệp Tải Về",
  headerDescription,
  items = [],
  // Props dự phòng nếu chỉ truyền 1 file
  title,
  description,
  url,
  size,
  badge,
  type = "pdf",
  buttonText = "Tải về (Google Drive)",
  hideIcon = false,
}) {
  // Chuẩn hóa danh sách tệp cần hiển thị
  const downloadItems =
    items.length > 0
      ? items
      : url
        ? [
            {
              title: title || "Tải tài liệu PDF",
              description,
              url,
              size,
              badge,
              type,
              buttonText,
              hideIcon,
            },
          ]
        : [];

  if (downloadItems.length === 0) return null;

  return (
    <div className="not-prose border-border/80 from-primary/5 via-background to-primary/10 my-6 rounded-2xl border bg-linear-to-br p-4 sm:p-5">
      {/* Header khu vực tải file */}
      {(headerTitle || headerDescription) && (
        <div className="border-border/60 mb-3.5 border-b pb-3">
          <div className="text-foreground flex items-center gap-2 text-base font-bold sm:text-lg">
            <span className="text-xl">🗂️</span>
            <span>{headerTitle}</span>
          </div>
          {headerDescription && (
            <p className="text-muted-foreground mt-1 mb-0 text-xs sm:text-sm">
              {headerDescription}
            </p>
          )}
        </div>
      )}

      {/* Danh sách các tài liệu (Map) */}
      <div className="flex flex-col gap-3">
        {downloadItems.map((item, index) => {
          const itemType = item.type || "pdf";
          const itemBtnText = item.buttonText || buttonText;
          return (
            <div
              key={index}
              className="group border-border/60 bg-card hover:border-primary/50 flex flex-col justify-between gap-3 rounded-xl border p-3.5 transition-all hover:shadow-md sm:flex-row sm:items-center sm:gap-4 sm:p-4"
            >
              {/* Thông tin tài liệu */}
              <div className="flex min-w-0 items-start gap-3">
                <div className="bg-muted/70 ring-border/50 mt-0.5 rounded-lg p-2 ring-1">
                  <FileTypeIcon type={itemType} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-foreground group-hover:text-primary text-sm font-semibold transition-colors sm:text-base">
                      {item.title}
                    </span>
                    {(item.badge || item.size) && (
                      <span className="bg-primary/10 text-primary ring-primary/20 hidden items-center rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset sm:inline-flex">
                        {item.badge || item.size}
                      </span>
                    )}
                  </div>
                  {item.description ? (
                    <p className="text-muted-foreground mt-1 mb-0 line-clamp-2 text-xs">
                      {item.description}
                    </p>
                  ) : (
                    <p className="text-muted-foreground mt-1 mb-0 line-clamp-2 text-xs">
                      {item.title}
                    </p>
                  )}
                </div>
              </div>

              {/* Nút bấm tải về */}
              <div className="shrink-0 self-end sm:self-center">
                <a
                  href={item.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold no-underline shadow transition-all hover:scale-[1.02] active:scale-[0.98] sm:text-sm"
                >
                  {!item.hideIcon && <DownloadActionIcon />}
                  <span>{itemBtnText}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
