import React from "react";
import Navbar from "@theme-original/Navbar";
import clsx from "clsx";
import { useLocation } from "@docusaurus/router";

// Danh sách các đường dẫn không hiển thị Header
const HIDE_NAVBAR_PATHS = ["/about", "/pwa"];

export default function NavbarWrapper(props) {
  const location = useLocation();

  const shouldHide = HIDE_NAVBAR_PATHS.some((path) =>
    location.pathname.includes(path),
  );

  if (shouldHide) {
    return null;
  }

  return (
    <>
      <Navbar {...props} className={clsx("navbar-glass", props.className)} />
    </>
  );
}
