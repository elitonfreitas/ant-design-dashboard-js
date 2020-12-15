import React from "react";
import { Switch, Route } from "react-router-dom";
import { Layout } from "antd";
import menus from "./menu";
import PageHeader from "../components/atoms/PageHeader";

const { Content } = Layout;

export default function Routes(props) {
  function mapMenu(item, i, routes = []) {
    const routesList = [
      ...routes,
      {
        path: item.path,
        breadcrumbName: item.title,
      },
    ];
    const path = routesList.map(it => it.path).join("");

    if (item.component) {
      const Component = item.component;
      return (
        <Route
          key={i}
          path={path}
          exact={!!item.exact}
          component={() => (
            <Content {...props} className="layout-content">
              {!item.noHeader && <PageHeader title={item.title} subTitle={item.subTitle} />}
              <Component {...props} />
            </Content>
          )}
        />
      );
    }
    if (item.children) {
      return item.children.map((child, s) => mapMenu(child, `${i}-${s}`, routesList));
    }
    return null;
  }

  return <Switch>{menus.map((item, i) => mapMenu(item, i, []))}</Switch>;
}
