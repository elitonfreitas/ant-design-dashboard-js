import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Menu } from "antd";
import menus from "../../../routes/menu";
import "./style.less";

export default function PMenu(props) {
  const { theme } = props;
  const history = useHistory();
  const menuKeys = [];
  const [openKey, setOpenKey] = useState(["menu-1"]);

  function getMenuHierarchy(item) {
    const itemName = item ? item.split("-") : [];
    if (!itemName.length) {
      return [];
    }
    const prefix = itemName.shift();

    let lastItem = prefix;
    return itemName.map(iName => {
      lastItem = `${lastItem}-${iName}`;
      return lastItem;
    });
  }

  const onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(key => !openKey.includes(key));
    if (!menuKeys.includes(latestOpenKey)) {
      setOpenKey(openKeys);
    } else {
      const opens = getMenuHierarchy(latestOpenKey);
      setOpenKey(opens);
    }
  };

  function handleClick(path) {
    history.push(path);
  }

  function mapMenu(item, i, routes = []) {
    const routesList = [
      ...routes,
      {
        path: item.path,
        breadcrumbName: item.title,
      },
    ];
    const path = routesList.map(p => p.path).join("");
    let Icon = null;
    if (item.icon) {
      Icon = item.icon;
    }

    const key = `menu-${i}`;

    if (item.component) {
      return (
        <Menu.Item key={key} icon={<Icon />} className={key} onClick={() => handleClick(path)}>
          {item.title}
        </Menu.Item>
      );
    }
    if (item.children) {
      menuKeys.push(key);
      return (
        <Menu.SubMenu key={key} icon={<Icon />} title={item.title}>
          {item.children.map((child, s) => mapMenu(child, `${i}-${s}`, routesList))}
        </Menu.SubMenu>
      );
    }
    return null;
  }

  return (
    <Menu
      theme={theme === "light" ? "light" : "dark"}
      mode="inline"
      defaultSelectedKeys={["menu-0"]}
      openKeys={openKey}
      onOpenChange={onOpenChange}
      style={{ borderRight: "none" }}
    >
      {menus.map((item, i) => mapMenu(item, i, []))}
    </Menu>
  );
}
