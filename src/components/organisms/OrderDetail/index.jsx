import { useState, useEffect } from "react";
import { Layout, Descriptions, Divider, Spin, Button } from "antd";
import moment from "moment";
import { ClearOutlined } from "@ant-design/icons";
import StatusBadge from "../../atoms/StatusBadge";
import service from "../../../services/defaultService";
import Default from "../../molecules/OrderDetail/Default";
import Dictionary from "../../molecules/OrderDetail/Dictionary";
import "./style.less";

const { Content } = Layout;
const actions = {
  C: "Criação",
  U: "Edição",
  D: "Exclusão",
  X: "Execução",
  E: "Exportação",
  I: "Importação",
};

export default function OrderDetail(props) {
  const { orderId: id } = props;
  const [orderId] = useState(id);
  const [order, setOrder] = useState({});
  const { status, user, orderTypeId, content } = order || {};
  const [loading, setLoading] = useState(true);
  const [pager, setPager] = useState({ index: 1, size: 20, sort: "", filter: "" });

  function getFilters(filter) {
    const filterKeys = Object.keys(filter);
    const finalFilter = {};
    filterKeys.forEach(key => {
      if (![undefined, null].includes(filter[key]) && Array.isArray(filter[key]) && filter[key].length) {
        if (key === "content.OPERATION") {
          finalFilter[key] = filter[key];
        } else {
          const value = filter[key][0];
          finalFilter[key] = value;
        }
      }
    });
    return finalFilter;
  }

  async function getOrderDetail({ index = pager.index, size = pager.size, sort = pager.sort, filter = pager.filter }) {
    setLoading(true);
    const filterStr = filter ? JSON.stringify(filter) : "";
    const { data: responseData } = await service.get(
      `/order/${orderId}?pageSize=${size}&pageIndex=${index}&orderBy=${sort}&filter=${filterStr}`,
      {}
    );
    setOrder(responseData);
    setLoading(false);
  }

  function onChangePage(pagination, filters, sorter) {
    const sort = sorter && sorter.field ? `${sorter.field}|${sorter.order === "ascend" ? "-1" : "1"}` : "";
    const filter = filters ? getFilters(filters) : {};
    const pagerData = {
      index: pagination.current || 1,
      size: pagination.pageSize || pager.size,
      sort,
      filter,
    };
    setPager(pagerData);

    getOrderDetail(pagerData);
  }

  useEffect(() => {
    getOrderDetail(pager);
  }, []);

  function getOrderType(type) {
    switch (type) {
      case 3:
      case 9:
      case 2:
      case 22:
        return <Dictionary order={order} loading={loading} pager={pager} onChangePage={onChangePage} />;
      default:
        return <Default order={order} loading={loading} pager={pager} onChangePage={onChangePage} />;
    }
  }

  return (
    <Content className="order-detail">
      {status ? (
        <>
          <Descriptions column={5} className="order-info">
            <Descriptions.Item label="Nº do pedido">{order.id}</Descriptions.Item>
            <Descriptions.Item label="Tipo de pedido">{orderTypeId.name}</Descriptions.Item>
            <Descriptions.Item label="Ação">{actions[order.orderAction]}</Descriptions.Item>
            <Descriptions.Item label="Status" className="order-status">
              <StatusBadge status={status} size="small" />
            </Descriptions.Item>
            <Descriptions.Item label="Solicitante">{`${user.name} (${user.id})`}</Descriptions.Item>
            <Descriptions.Item label="Data de abertura">{moment(order.date).format("DD/MM/YYYY HH:mm")}</Descriptions.Item>
            {order.finishDate ? (
              <Descriptions.Item label="Data de finalização">{moment(order.finishDate).format("DD/MM/YYYY HH:mm")}</Descriptions.Item>
            ) : (
              ""
            )}
            {order.lastItemSent ? (
              <Descriptions.Item label="Último item enviado">{moment(order.lastItemSent).format("DD/MM/YYYY HH:mm")}</Descriptions.Item>
            ) : (
              ""
            )}
            {content.dictionaryName ? <Descriptions.Item label="Dicionário">{content.dictionaryName}</Descriptions.Item> : ""}
            {content.reason ? <Descriptions.Item label="Observação">{content.reason}</Descriptions.Item> : ""}
          </Descriptions>

          <Divider orientation="left" style={{ marginBottom: 0 }}>
            Itens do pedido
          </Divider>

          {order.maxResults ? (
            <div className="items-info">
              <div>
                <span>Total de itens: </span>
                {order.maxResults}
              </div>
              <div>
                <span>Com sucesso: </span>
                {order.withSuccess}
              </div>
              <div>
                <span>Com erro: </span>
                {order.withError}
              </div>
            </div>
          ) : (
            ""
          )}

          {!order.maxResults ? (
            <div className="reset-button">
              <Button type="link" icon={<ClearOutlined />} onClick={() => onChangePage({}, null, null)}>
                Limpar filtros
              </Button>
            </div>
          ) : (
            ""
          )}

          <div className="order-detail-table">{getOrderType(order.orderTypeId._id)}</div>
        </>
      ) : loading ? (
        <Spin size="large" className="order-detail-spin" />
      ) : (
        <p>Não foi possível obter os dados do pedido. Por favor, tente novamente.</p>
      )}
    </Content>
  );
}
