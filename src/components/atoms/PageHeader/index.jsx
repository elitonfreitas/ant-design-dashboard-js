import React from "react";
import { PageHeader } from "antd";
import "./style.less";

export default function PPageHeader(props) {
  return <PageHeader className="site-page-header" {...props} />;
}
