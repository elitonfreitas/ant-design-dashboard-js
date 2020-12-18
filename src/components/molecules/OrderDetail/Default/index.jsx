import { Table } from "antd";
import moment from "moment";
import StatusBadge from "../../../atoms/StatusBadge";
import utils from "../../../../utils/utils";

export default function Default(props) {
  const { order, onChangePage, loading } = props;
  const { items } = order;

  function showTotal(total, range) {
    return order.maxResults ? `${range[0]} - ${range[1]} de ${order.maxResults}` : "";
  }

  const columns = [
    {
      title: "Nº de matrícula",
      dataIndex: "content.employee.id",
      sorter: true,
      width: 140,
      fixed: "left",
      render: (text, item) => item.content.employee.id,
    },
    {
      title: "Data início",
      dataIndex: "content.startDate",
      sorter: true,
      width: 150,
      render: (text, item) => (item.content.startDate ? moment(item.content.startDate).format("DD/MM/YYYY HH:mm") : ""),
    },
    {
      title: "Data fim",
      dataIndex: "content.endDate",
      sorter: true,
      width: 150,
      render: (text, item) => (item.content.endDate ? moment(item.content.endDate).format("DD/MM/YYYY HH:mm") : ""),
    },
    {
      title: "Motivo",
      dataIndex: "content.reason.desc",
      width: 150,
      render: (text, item) => item.content.reason.desc,
    },
    {
      title: "Observação",
      dataIndex: "content.note",
      width: 150,
      sorter: true,
      render: (text, item) => item.content.note,
    },
  ];

  if (order.withError) {
    columns.unshift({
      title: "Detalhamento",
      dataIndex: "status.error",
      className: "item-detial",
      width: 280,
      sorter: true,
      fixed: "left",
      render: (text, item) => utils.translateError(item.status.error),
    });
  }
  columns.unshift({
    title: "Status",
    dataIndex: "status",
    sorter: true,
    width: 130,
    fixed: "left",
    render: (_, item) => <StatusBadge status={item.status} size="small" />,
  });

  return (
    <Table
      columns={columns}
      dataSource={items}
      rowKey="_id"
      sticky
      scroll={{ x: 1300 }}
      loading={loading}
      onChange={onChangePage}
      pagination={{
        position: ["topRight", "bottomRight"],
        current: order.pageIndex,
        total: order.maxResults,
        defaultPageSize: order.pageSize,
        showSizeChanger: true,
        showTotal,
        size: "small",
      }}
      locale={{
        emptyText: <span>Não foram encontrados resultados para os filtros aplicados.</span>,
      }}
    />
  );
}
