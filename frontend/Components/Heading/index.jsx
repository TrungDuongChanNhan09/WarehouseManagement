import React from "react";

const sizes = {
  headingxs: "text-[25px] font-bold lg:text-[21px] md:text-[23px] sm:text-[21px]",
  headings: "text-[30px] font-bold lg:text-[25px] md:text-[28px] sm:text-[26px]",
  headingmd: "text-[40px] font-bold lg:text-[34px] md:text-[38px] sm:text-[36px]",
  headinglg: "text-[50px] font-bold lg:text-[42px] md:text-[46px] sm:text-[40px]",
};

const Heading = ({ children, className = "", size = "headingxs", as, ...restProps }) => {
  const Component = as || "h6";

  return (
    <Component
      className={`text-[#000000] font-['Maven_Pro'] ${className} ${sizes[size]}`}
      {...restProps}
    >
      {children}
    </Component>
  );
};

export { Heading };
