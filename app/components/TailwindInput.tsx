import { InputHTMLAttributes } from "react";

export default function TailwindInput(
  props: InputHTMLAttributes<HTMLInputElement>,
) {
  return (
    <input
      className="inline-flex w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
      {...props}
    />
  );
}
