import React from "react";
import { Metadata } from "next";
import Page from ".";

export const metadata: Metadata = {
  title: "User Login - Efficient Warehouse Management",
  description:
    "Sign in to access our warehouse management system. Ensure efficiency, precision, and reliability in inventory tracking and order fulfillment.",
  //ogTitle:'...'
};

export default function LoginPage() {
  return <Page />;
}

