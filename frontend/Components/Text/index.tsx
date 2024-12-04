import React from "react";

const sizes = {
  textxs: "text-[20px] font-normal lg:text-[17px]",
  texts: "text-[30px] font-normal lg:text-[25px] md:text-[28px] sm:text-[26px]",
};

export type TextProps = Partial<{
  className: string;
  as: any;
  size: keyof typeof sizes;
}> &
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;

const Text: React.FC<React.PropsWithChildren<TextProps>> = ({
  children,
  className = "",
  as,
  size = "textxs",
  ...restProps
}) => {
  const Component = as || "p";

  return (
    <Component className={`text-[#000000] font-['Martel_Sans'] ${className} ${sizes[size]} `} {...restProps}>
      {children}
    </Component>
  );
};

export { Text };

