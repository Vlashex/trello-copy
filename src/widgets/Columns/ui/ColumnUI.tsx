
import React from "react";

type ColumnUIProps = {
  style: React.CSSProperties;
  setNodeRef: (node: HTMLElement | null) => void;
  attributes: any;
  children: React.ReactNode;
};

export const ColumnUI = ({ style, setNodeRef, attributes, children }: ColumnUIProps) => {
  return (
    <div
      style={style}
      ref={setNodeRef}
      {...attributes}
      className="flex flex-col gap-4 min-h-[400px] px-3 min-w-[250px] w-[250px] bg-gray-800 text-white overflow-hidden rounded-sm"
    >
      {children}
    </div>
  );
};
