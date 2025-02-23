import { ButtonHTMLAttributes } from "react";

export default function TailwindButton(
  props: ButtonHTMLAttributes<HTMLButtonElement>,
) {
  return (
    <button
      {...props}
      className={
        "rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all duration-150 shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2" +
        " " +
        props.className
      }
    />
  );
}
