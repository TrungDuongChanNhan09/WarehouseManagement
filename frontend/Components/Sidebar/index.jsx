"use client";

import Link from "next/link";
import React, { useState } from "react";
import { MenuItem, Menu, Sidebar } from "react-pro-sidebar";

export default function SideBar(props) {
  const [collapsed, setCollapsed] = useState(false);

  // Toggle sidebar collapse
  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <Sidebar
      {...props}
      collapsed={collapsed}
      className={`flex flex-col h-screen pt-[50px] top-0 px-2.5 md:pt-5 sm:pt-4 !border-[#f25d07] !border-r-[10px] !border-solid bg-[#ffffff] !sticky overflow-auto`}
    >
      <Menu
        menuItemStyles={{
          button: {
            padding: "10px 10px 10px 20px",
            color: "#000000",
            fontWeight: 700,
            fontSize: "25px",
            gap: "10px",
            borderRadius: "35px",
            [`&:hover, &.ps-active`]: {
              color: "#ffffff",
              backgroundColor: "#f25d07",
            },
          },
        }}
        rootStyles={{ ["&>ul"]: { gap: "30px" } }}
        className="flex w-full flex-col self-stretch"
      >
        <MenuItem
          icon={<img src="dashboard 1.svg" alt="Dashboard Icon" className="h-[40px] w-[40px]" />}
          component={<Link href="/dashboard" passHref />}
        >
          Dashboard
        </MenuItem>
        <MenuItem
          icon={<img src="delivery 1.svg" alt="Orders Icon" className="h-[50px] w-[50px]" />}
          component={<Link href="/ordermanagement" passHref />}
        >
          Order
        </MenuItem>
        <MenuItem
          icon={<img src="briefcase 1.svg" alt="Employees Icon" className="h-[40px] w-[40px]" />}
          component={<Link href="/employee" passHref />}
        >
          Employee
        </MenuItem>
        <MenuItem
          icon={<img src="package-box 1.svg" alt="Inventory Icon" className="h-[50px] w-[50px]" />}
          component={<Link href="/inventory" passHref />}
        >
          Inventory
        </MenuItem>
        <MenuItem
          icon={<img src="package-box 1.svg" alt="Products Icon" className="h-[50px] w-[50px]" />}
        >
          Product
        </MenuItem>
        <MenuItem
          icon={<img src="package-box 1.svg" alt="Categories Icon" className="h-[50px] w-[50px]" />}
        >
          Category
        </MenuItem>
        <MenuItem
          icon={<img src="package-box 1.svg" alt="Import Icon" className="h-[50px] w-[50px]" />}
        >
          Import
        </MenuItem>
        <MenuItem
          icon={<img src="package-box 1.svg" alt="Export Icon" className="h-[50px] w-[50px]" />}
        >
          Export
        </MenuItem>
        <MenuItem
          icon={<img src="settings 1.svg" alt="Settings Icon" className="h-[40px] w-[40px]" />}
        >
          Setting
        </MenuItem>
      </Menu>
    </Sidebar>
  );
}
