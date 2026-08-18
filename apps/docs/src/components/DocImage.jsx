import React from "react";

/**
 * import và dùng
 */
export default function DocImage({
  src,
  alt = "",
  width = "100%",
  maxWidth = "100%",
  height = "auto",
  caption,
  align = "center",
  className = "",
  style = {},
  ...props
}) {
  // Extract string src if require() object is passed
  const imageSrc =
    typeof src === "object" && src !== null ? src.default || src : src;

  const formattedWidth = typeof width === "number" ? `${width}px` : width;
  const formattedMaxWidth =
    typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth;
  const formattedHeight = typeof height === "number" ? `${height}px` : height;

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems:
      align === "left"
        ? "flex-start"
        : align === "right"
          ? "flex-end"
          : "center",
    margin: "1.25rem 0",
  };

  const imgStyle = {
    width: formattedWidth,
    maxWidth: formattedMaxWidth,
    height: formattedHeight,
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    objectFit: "contain",
    ...style,
  };

  return (
    <figure style={containerStyle} className={`doc-image-wrapper ${className}`}>
      <img
        src={imageSrc}
        alt={alt || caption || "Hình ảnh tài liệu"}
        style={imgStyle}
        loading="lazy"
        {...props}
      />
      {caption && (
        <figcaption
          style={{
            marginTop: "0.4rem",
            fontSize: "0.85rem",
            color: "var(--ifm-color-content-secondary, #6b7280)",
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
