// src/LoginPage.jsx
import React from 'react';
import { Button, CheckBox, Input, Heading} from "../../Components";  

const LoginPage = () => {
  return (
    <div className="flex w-full items-center bg-[#ffffff] md:flex-col">
      <div className="h-screen flex flex-col justify-end flex-1 bg-[url(/images/login.png)] bg-cover bg-no-repeat lg:h-auto md:h-auto md:self-stretch md:px-5">
        <div className="flex flex-col items-start justify-center gap-4 bg-gradient-to-r from-[#000000] to-[#00000000] px-[50px] py-[54px] md:p-5 sm:p-4">
          <Heading
            size="headinglg"
            as="h1"
            className="font-['Maven_Pro'] text-[50px] font-semibold text-[#ffffff] lg:text-[42px] md:text-[34px] sm:text-[28px]"
          >
            About us
          </Heading>
          <Heading
            size="headings"
            as="h2"
            className="w-full font-['Maven_Pro'] text-[30px] font-semibold leading-[35px] text-[#ffffff] lg:text-[25px] md:text-[24px] sm:text-[22px]"
          >
            Our warehouse management team excels in efficiency, precision, and reliability. We are committed to delivering top-tier management practices that ensure seamless operations, from inventory tracking to order fulfillment. With a focus on optimizing space, minimizing errors, and streamlining processes, we consistently achieve fast and accurate deliveries.
          </Heading>
        </div>
      </div>
      <div className="flex w-[30%] flex-col items-center justify-center gap-[30px] px-14 lg:py-8 md:w-full md:p-5 sm:px-5 sm:py-4">
        <div className="mb-[30px] flex flex-col items-center gap-[18px] self-stretch">
          <Heading
            size="headinglg"
            as="h2"
            className="font-['Maven_Pro'] text-[50px] font-extrabold text-[#f25d07]"
          >
            Sign In
          </Heading>
          <div className="flex flex-col items-center gap-[18px] self-stretch">
            <div className="flex flex-col items-start gap-4 self-stretch">
              <Heading as="h3" className="font-['Maven_Pro'] text-[25px] font-semibold text-[#000000] lg:text-[21px]">
                Username
              </Heading>
              <Input shape="round" name="Username Input" className="self-stretch rounded-[10px] !border-2 px-3" />
            </div>
            <div className="flex flex-col items-start gap-4 self-stretch">
              <Heading as="h4" className="font-['Maven_Pro'] text-[25px] font-semibold text-[#000000] lg:text-[21px]">
                Password
              </Heading>
              <Input shape="round" name="Password Input" className="self-stretch rounded-[10px] !border-2 px-3" />
            </div>
            <CheckBox
              name="Show Password"
              label="Show password"
              id="ShowPassword"
              className="mr-2.5 gap-1 self-end py-1 font-['Maven_Pro'] text-[20px] font-semibold text-[#000000] md:mr-0"
            />
            <Button
              color="orange_800"
              size="lg"
              className="mx-[104px] self-stretch rounded-[20px] px-[34px] font-['Maven_Pro'] font-bold md:mx-0 sm:px-4"
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
