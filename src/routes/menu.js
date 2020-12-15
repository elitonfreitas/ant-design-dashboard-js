import { UserOutlined, VideoCameraOutlined, UploadOutlined } from "@ant-design/icons";
import Dashboard from "../pages/Dashboard";
import OrderSearch from "../pages/ManagerOrder/OrderSearch";
import OrderApprove from "../pages/ManagerOrder/OrderApprove";
import Mua from "../pages/Dictionary/Mua";

import Daily from "../pages/Unavailability/Daily";

const menus = [
  {
    path: "/",
    title: "Dashboard",
    component: Dashboard,
    exact: true,
    icon: UserOutlined,
  },
  {
    path: "/manager-order",
    title: "Gestão de pedidos",
    icon: VideoCameraOutlined,
    children: [
      {
        path: "/search",
        title: "Visualização",
        component: OrderSearch,
        noHeader: true,
        icon: UploadOutlined,
      },
      {
        path: "/approve",
        title: "Aprovação",
        component: OrderApprove,
        icon: UploadOutlined,
      },
    ],
  },
  {
    path: "/engineer",
    title: "Gestão de técnicos",
    icon: VideoCameraOutlined,
    children: [
      {
        path: "/unavailability",
        title: "Indisponibilidade",
        icon: UploadOutlined,
        children: [
          {
            path: "/daily",
            title: "Diária",
            component: Daily,
            icon: UploadOutlined,
          },
          {
            path: "/simple",
            title: "Simplificada",
            component: Mua,
            icon: UploadOutlined,
          },
          {
            path: "/detailed",
            title: "Detalhada",
            component: Mua,
            icon: UploadOutlined,
          },
        ],
      },
      {
        path: "/cadastral",
        title: "Manutenção cadastral",
        component: Mua,
        icon: UploadOutlined,
      },
    ],
  },
];

export default menus;
