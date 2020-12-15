import React from "react";
import { Badge } from "antd";
import "./style.less";

export default function StatusBadge(props) {
  const { size, status } = props;
  const { id, error } = status;
  const { name } = id;
  return (
    <div className="order-status">
      <span>{name}</span>
      {error ? <Badge size={size} count="E" /> : ""}
    </div>
  );
}
