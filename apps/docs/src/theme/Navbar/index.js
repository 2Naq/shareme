import React from "react";
import Navbar from "@theme-original/Navbar";
import clsx from "clsx";
import { useLocation } from "@docusaurus/router";

// Danh sách các đường dẫn không hiển thị Header
const HIDE_NAVBAR_PATHS = ["/about", "/pwa"];

export default function NavbarWrapper(props) {
  const location = useLocation();

  // Kiểm tra khớp đường dẫn chính xác, tránh khớp nhầm các bài viết tài liệu có chứa từ khóa (như /other/pwa-update-mechanism)
  const shouldHide = HIDE_NAVBAR_PATHS.some((path) => {
    const currentPath = location.pathname.replace(/\/$/, "");
    return currentPath === path || currentPath.endsWith(path);
  });

  if (shouldHide) {
    // Trả về thẻ div.navbar ẩn thay vì null để Docusaurus useTOCHighlight không bị lỗi clientHeight
    return <div className="navbar hidden" style={{ display: "none" }} />;
  }

  return (
    <>
      <Navbar {...props} className={clsx("navbar-glass", props.className)} />
    </>
  );
}
