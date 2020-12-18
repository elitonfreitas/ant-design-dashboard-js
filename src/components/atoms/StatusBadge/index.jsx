import { Badge } from "antd";
import PropTypes from "prop-types";
import "./style.less";

const StatusBadge = props => {
  const { size, status } = props;
  const { id, error } = status;
  const { name } = id;
  return (
    <div className="order-status">
      <span>{name}</span>
      {error ? <Badge size={size} count="E" /> : ""}
    </div>
  );
};

StatusBadge.propTypes = {
  size: PropTypes.string.isRequired,
  status: PropTypes.shape({
    id: PropTypes.number,
    error: PropTypes.string,
  }).isRequired,
};

export default StatusBadge;
