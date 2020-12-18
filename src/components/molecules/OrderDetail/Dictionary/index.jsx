import { useState } from "react";
import { Table, Input, Space, Button } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import StatusBadge from "../../../atoms/StatusBadge";
import utils from "../../../../utils/utils";

export default function Dictionary(props) {
  const { order, onChangePage, pager, loading } = props;
  const { items } = order;
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  function showTotal(total, range) {
    return order.maxResults ? `${range[0]} - ${range[1]} de ${order.maxResults}` : "";
  }

  function searchHandler(selectedKeys, dataIndex, confirm) {
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    confirm();
  }

  function getColumnSearchProps(dataIndex) {
    if (dataIndex === "content.OPERATION") {
      return {};
    }

    const name = dataIndex.replace("content.", "");
    let searchInput = { select: () => null };

    return {
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={node => {
              searchInput = node;
            }}
            placeholder={`Filtrar por ${name}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => searchHandler(selectedKeys, dataIndex, confirm)}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => searchHandler(selectedKeys, dataIndex, confirm)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Filtrar
            </Button>
            <Button
              onClick={() => {
                clearFilters();
                setSearchText("");
                setSearchedColumn("");
                onChangePage({});
              }}
              size="small"
              style={{ width: 90 }}
            >
              Limpar
            </Button>
          </Space>
        </div>
      ),
      filterIcon: () => {
        const filtered = !!pager.filter[dataIndex];
        return <SearchOutlined className={filtered ? "search-icon active" : "search-icon"} />;
      },
      onFilterDropdownVisibleChange: visible => {
        if (visible) {
          setTimeout(() => searchInput.select(), 100);
        }
      },
      render: (text, item) => {
        const data = item.content[name] || "";
        if (searchedColumn === dataIndex && data) {
          return (
            <Highlighter
              highlightStyle={{ backgroundColor: "#F7D3A1", padding: 0 }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={data ? data.toString() : ""}
            />
          );
        }
        return data;
      },
    };
  }

  const firstItem = items[0];
  const { content } = firstItem || { content: {} };
  const fields = Object.keys(content);
  let tableWidth = 510;

  const columns = fields.map(key => {
    let width = 130;
    switch (key) {
      case "Name":
        width = 250;
        break;
      case "Description":
        width = 250;
        break;
      default:
        width = key.length * 12 > width ? key.length * 12 : width;
        break;
    }

    tableWidth += width;

    const column = {
      width,
      title: key,
      sorter: true,
      dataIndex: `content.${key}`,
      key: `content.${key}`,
      ...getColumnSearchProps(`content.${key}`),
    };

    if (key === "OPERATION") {
      column.align = "center";
      column.fixed = "right";
      column.width = 140;
      column.filteredValue = pager.filter ? pager.filter["content.OPERATION"] || [] : [];
      column.render = (text, item) => item.content[key];
      column.filters = [
        {
          text: "INSERT",
          value: "INSERT",
        },
        {
          text: "EDIT",
          value: "EDIT",
        },
        {
          text: "DELETE",
          value: "DELETE",
        },
      ];
    }

    return column;
  });

  if (order.withError) {
    columns.unshift({
      title: "Detalhamento",
      dataIndex: "status.error",
      className: "item-detial",
      fixed: "left",
      width: 250,
      sorter: true,
      render: (text, item) => utils.translateError(item.status.error) || "",
    });
  }
  if (columns.length) {
    columns.unshift({
      title: "Status",
      dataIndex: "status.id",
      width: 120,
      sorter: true,
      fixed: "left",
      render: (_, item) => <StatusBadge status={item.status} size="small" />,
    });
  } else {
    columns.unshift({
      title: "Nenhum resultado",
      dataIndex: "reset",
    });
  }

  return (
    <Table
      columns={columns}
      dataSource={items}
      rowKey="_id"
      scroll={{ x: tableWidth }}
      sticky
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
