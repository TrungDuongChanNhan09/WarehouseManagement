import React from "react";
import { Link } from "react-router-dom";
import { Button, CheckBox, Input, Heading, Img } from "../../Components";
import './Login.css';

export default function LoginPage() {
  return (
    <div className="login-page">
      {/* Phần hình nền */}
      <div className="login-image" id="login-image">
        <div className="login-image-overlay">
          <Heading size="headinglg" as="h1" className="heading-main">
            About us
          </Heading>
          <Heading size="headings" as="h2" className="heading-sub">
            Our warehouse management team excels in efficiency, precision, and reliability. We are committed to delivering top-tier management practices that ensure seamless operations, from inventory tracking to order fulfillment. With a focus on optimizing space, minimizing errors, and streamlining processes, we consistently achieve fast and accurate deliveries.
          </Heading>
        </div>
      </div>

      {/* Form đăng nhập */}
      <div className="login-form">
        <Img src="Logo.png" width={200} height={200} alt="Logo" className="logo" />
        <div className="input-group">
          <Link href="#" className="sign-in-heading">
            <Heading size="headinglg" as="h2">
              Sign In
            </Heading>
          </Link>

          {/* Username Input Group */}
          <div className="input-field-container">
            <Heading as="h3" className="input-label">
              Username
            </Heading>
            <Input shape="round" name="Username Input" className="input-field" />
          </div>

          {/* Password Input Group */}
          <div className="input-field-container">
            <Heading as="h4" className="input-label">
              Password
            </Heading>
            <Input shape="round" name="Password Input" className="input-field" />
          </div>

          {/* Show Password Checkbox */}
          <CheckBox
            name="Show Password"
            label="Show password"
            id="ShowPassword"
            className="checkbox-label"
          />

          {/* Login Button */}
          <Button color="orange_800" size="lg" className="login-button">
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}
