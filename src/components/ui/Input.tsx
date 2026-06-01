import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className = "",
  id,
  ...props
}: InputProps) {
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs tracking-[0.15em] uppercase text-gallery-gray mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full border-b border-gallery-border bg-transparent py-2.5 text-gallery-black placeholder:text-gallery-gray/50 focus:outline-none focus:border-gallery-black transition-colors duration-300 ${
          error ? "border-red-400" : ""
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
