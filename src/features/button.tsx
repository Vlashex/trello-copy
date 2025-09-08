import { ReactElement } from "react";

export default function Button({
  children,
  fun,
  funOpts,
  disabled,
  className,
}: {
  children: ReactElement | string;
  fun: (Opts: any) => void;
  funOpts?: any;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      disabled={disabled != undefined ? disabled : false}
      className={className || "w-full h-full hover:bg-gray-400 p-1"}
      onClick={() => fun(funOpts)}
    >
      {children}
    </button>
  );
}
