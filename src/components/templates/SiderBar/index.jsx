import { useState } from "react";
import { Layout } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";

import BoxAvatar from "../../atoms/BoxAvatar";
import Routes from "../../../routes";
import Logo from "../../atoms/Logo";
import Menu from "../../atoms/Menu";
import Button from "../../atoms/Button";
import "./style.less";

const { Header, Sider, Footer } = Layout;

export default function SiderBar() {
  const [collapsed, setCollapsed] = useState(false);
  const [theme] = useState("light");
  const [collapsedRight, setCollapsedRight] = useState(true);

  function toggle() {
    setCollapsed(!collapsed);
  }

  return (
    <Layout className={`site-layout ${theme}`}>
      <Sider
        theme={theme}
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={250}
        collapsedWidth={81}
        style={{
          position: "fixed",
          zIndex: 2,
          height: "100vh",
        }}
      >
        <Logo />
        <Menu theme={theme} />
      </Sider>
      <Sider
        trigger={null}
        theme={theme}
        collapsible
        collapsed={collapsedRight}
        width={250}
        collapsedWidth={0}
        style={{
          position: "fixed",
          zIndex: 2,
          height: "calc(100vh - 60px)",
          borderRight: "1px #eee solid",
          right: "0px",
          top: "60px",
        }}
      >
        <Menu theme={theme} />
      </Sider>
      <Layout className="sider-bar-layout">
        <Header
          style={{
            position: "fixed",
            zIndex: 1,
            width: "100vw",
            padding: 0,
          }}
        >
          <Button
            type="link"
            className={collapsed ? "trigger collapsed" : "trigger"}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggle}
          />

          <div href="#" onClick={() => setCollapsedRight(!collapsedRight)} aria-hidden="true">
            <BoxAvatar />
          </div>
        </Header>
        <Routes
          style={{
            marginTop: 90,
            marginRight: 24,
            marginBottom: 24,
            marginLeft: collapsed ? 104 : 274,
            padding: "24px",
          }}
        />
        <Footer
          style={{
            padding: 24,
            marginLeft: collapsed ? 80 : 250,
          }}
        >
          Footer
        </Footer>
      </Layout>
    </Layout>
  );
}
