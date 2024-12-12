"use client";
import React from "react";

const shapes = {
  round: "rounded-[10px]",
};

const variants = {
  outline: {
    black_900: "border-[#000000] border-2 border-solid",
  },
  fill: {
    white_A700: "bg-[#ffffff]",
  },
};

const sizes = {
  sm: "h-[60px] px-3",
  xs: "h-[50px] pl-3.5 pr-2 text-[20px]",
};

const Input = React.forwardRef(
  (
    {
      className = "",
      name = "",
      placeholder = "",
      type = "text",
      label = "",
      prefix,
      suffix,
      onChange,
      shape,
      variant = "outline",
      size = "sm",
      color = "black_900",
      ...restProps
    },
    ref,
  ) => {
    return (
      <label
        className={`${className} flex items-center justify-center cursor-text border-solid  ${shape && shapes[shape]} ${variant && (variants[variant]?.[color] || variants[variant])} ${size && sizes[size]}`}
      >
        {!!label && label}
        {!!prefix && prefix}
        <input ref={ref} type={type} name={name} placeholder={placeholder} onChange={onChange} {...restProps} />
        {!!suffix && suffix}
      </label>
    );
  },
);

export { Input };