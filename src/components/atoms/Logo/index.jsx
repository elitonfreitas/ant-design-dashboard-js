import React from "react";

import logo from "../../../assets/logo.svg";
import "./style.less";

export default function Logo() {
  return (
    <div className="logo-container">
      <img src={logo} alt="My Admin" />
      <span>My Admin</span>
    </div>
  );
}
