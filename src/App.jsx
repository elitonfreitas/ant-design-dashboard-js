import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import "moment/locale/pt-br";
import locale from "antd/es/locale/pt_BR";
import SiderBar from "./components/templates/SiderBar";
import "./themes/default.less";

function App() {
  return (
    <ConfigProvider locale={locale} componentSize="middle">
      <BrowserRouter>
        <SiderBar />
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
