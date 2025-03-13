import { ReactElement } from "react";

export default function Button({children, fun, funOpts} : {children : ReactElement | string, fun: (Opts:any)=>void, funOpts?: any}) {
  return (
    <button
      className="w-full h-full hover:bg-gray-400 p-1"
      onClick={() => fun(funOpts)}
    >
      {children}
    </button>
  );
}
