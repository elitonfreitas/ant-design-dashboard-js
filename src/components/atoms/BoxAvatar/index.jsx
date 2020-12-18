import { Avatar } from "antd";
import "./style.less";

const index = (...props) => {
  const { act } = props;
  return (
    <div className="Avatar">
      <h2>sadsadsad</h2>
      <p>sdsadsad</p>
      <Avatar className="avatarThumb" size={40} onClick={() => act}>
        U
      </Avatar>
    </div>
  );
};

export default index;
