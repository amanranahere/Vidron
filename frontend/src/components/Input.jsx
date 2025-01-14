import React, { useId } from "react";

const Input = React.forwardRef(function Input(
  { label, type = "text", className = "", className2 = "", ...props },
  ref
) {
  const id = useId();

  return (
    <div className={`w-full ${className2}`}>
      {label && (
        <label className="inline-block mb-1 pl-1 text-[#00bfff]" htmlFor={id}>
          {label}
        </label>
      )}

      <input
        type={type}
        className={`py-2 bg-[#2a2a2a] text-white outline-none duration-200 focus:bg-[#3a3a3a] w-full ${className}`}
        ref={ref}
        {...props}
        id={id}
      />
    </div>
  );
});

export default Input;
