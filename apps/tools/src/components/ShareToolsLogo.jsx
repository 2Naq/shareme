import React from 'react';
import SvgTool from './svg_Tool';

/**
 * ShareTools Logo Component
 * Reusable brand logo with icon + wordmark
 * @param {object} props
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Logo size variant
 * @param {boolean} [props.showText=true] - Show text beside icon
 * @param {string} [props.className] - Additional CSS classes
 */
export function ShareToolsLogo({ size = 'md', showText = true, className = '' }) {
  const sizes = {
    sm: { icon: 'size-8', iconInner: 'size-4', text: 'text-base', tagline: 'text-[9px]' },
    md: { icon: 'size-10', iconInner: 'size-5', text: 'text-xl', tagline: 'text-[10px]' },
    lg: { icon: 'size-14', iconInner: 'size-7', text: 'text-2xl', tagline: 'text-xs' },
  };

  const s = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Icon Mark */}
      <div className={`${s.icon} shrink-0 relative flex items-center justify-center`}>
        <SvgTool className="text-blue-600 dark:text-blue-400 size-full drop-shadow-sm" />
      </div>

      {/* Wordmark */}
      {showText && (
        <div className="flex flex-col truncate leading-none">
          <span className={`${s.text} font-extrabold tracking-tight leading-tight`}>
            <span className="bg-linear-to-r from-blue-700 via-blue-500 to-blue-400 bg-clip-text text-transparent dark:from-blue-400 dark:via-blue-300 dark:to-sky-300">
              Share
            </span>
            <span className="text-foreground/80 font-semibold ml-0.5">Tools</span>
          </span>
          <span className={`${s.tagline} text-muted-foreground font-medium tracking-wider uppercase mt-0.5`}>
            Bộ công cụ kỹ thuật
          </span>
        </div>
      )}
    </div>
  );
}
