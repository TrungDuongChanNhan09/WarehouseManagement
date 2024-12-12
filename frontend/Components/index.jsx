import React from "react";

const sizes = {
  textxs: "text-[20px] font-normal lg:text-[17px]",
  texts: "text-[30px] font-normal lg:text-[25px] md:text-[28px] sm:text-[26px]",
};

const Text = ({
  children,
  className = "",
  as: Component = "p",
  size = "textxs",
  ...restProps
}) => {
  return (
    <Component className={`text-[#000000] font-['Martel_Sans'] ${className} ${sizes[size]}`} {...restProps}>
      {children}
    </Component>
  );
};

export { Text };