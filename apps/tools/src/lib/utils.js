import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import classNames from "classnames/bind";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * @const cx = _UseCx(styles);
 * @ClassName=cx("class1, class2...")
 * @returns {Function} sử dụng với css module
 */
export function _UseCx(styles) {
  return classNames.bind(styles);
}
