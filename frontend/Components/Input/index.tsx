"use client";
import React from "react";

const shapes = {
  round: "rounded-[10px]",
} as const;

const variants = {
  outline: {
    black_900: "border-[#000000] border-2 border-solid",
  },
  fill: {
    white_A700: "bg-[#ffffff]",
  },
} as const;

const sizes = {
  sm: "h-[60px] px-3",
  xs: "h-[50px] pl-3.5 pr-2 text-[20px]",
} as const;

type InputProps = Omit<React.ComponentPropsWithoutRef<"input">, "prefix" | "size"> &
  Partial<{
    label: string;
    prefix: React.ReactNode;
    suffix: React.ReactNode;
    shape: keyof typeof shapes;
    variant: keyof typeof variants | null;
    size: keyof typeof sizes;
    color: string;
  }>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
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
        className={`${className} flex items-center justify-center cursor-text border-solid  ${shape && shapes[shape]} ${variant && (variants[variant]?.[color as keyof (typeof variants)[typeof variant]] || variants[variant])} ${size && sizes[size]}`}
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

