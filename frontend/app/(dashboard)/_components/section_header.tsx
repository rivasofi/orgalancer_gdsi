"use client";

import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}

export default function SectionHeader({ title, subtitle, children }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-violet-600">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" />
            <path d="M19 14L19.7 16.3L22 17L19.7 17.7L19 20L18.3 17.7L16 17L18.3 16.3L19 14Z" fill="currentColor" opacity="0.6" />
          </svg>
          {title}
        </h1>
        <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
      </div>
      {children && <div>{children}</div>}
    </div>
  );
}