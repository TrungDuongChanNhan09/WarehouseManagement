import { Button, Img, Text } from "..";
import Link from "next/link";
import React from "react";

export default function Header({ className, ...restProps }) {
  return (
    <header
      {...restProps}
      className={`${className} flex justify-center items-center py-2.5 bg-[#ffffff] shadow-[0_5px_10px_5px_#0000003f]`}
    >
      <div className="container-xs flex justify-center lg:px-5 md:px-5">
        <div className="flex w-full items-center justify-between gap-5 md:flex-col">
          <Img
            src="img_header_logo.png"
            width={462}
            height={46}
            alt="Header Logo"
            className="h-[46px] w-[462px] object-contain"
          />
          <div className="flex items-center gap-5">
            <Text
              size="texts"
              as="p"
              className="mb-1.5 self-end font-['Maven_Pro'] text-[30px] font-normal text-[#000000] lg:text-[25px] md:text-[24px] sm:text-[22px]"
            >
              Hi, Admin
            </Text>
            <Link href="#">
              <Button size="md" shape="square" className="w-[60px] px-1">
                <Img src="img_user_square_blue_gray_900.svg" width={50} height={50} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}