import React, { useState, useEffect } from "react";
import {
  Table,
  Typography,
  Empty,
  Button,
  Form,
  Input,
  Select,
  Row,
  Col,
  DatePicker,
  Divider,
  Spin,
  Avatar,
  Popconfirm,
  message,
} from "antd";
import { DeleteOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import moment from "moment";
import service from "../../../services/defaultService";
import StatusBadge from "../../../components/atoms/StatusBadge";
import OrderModal from "../../../components/molecules/OrderDetail/OrderModal";
import "./style.less";

const { Title } = Typography;
const { Option } = Select;
const actions = {
  C: "Criação",
  U: "Edição",
  D: "Exclusão",
  X: "Execução",
  E: "Exportação",
  I: "Importação",
};
const selectFields = [
  {
    condition: "$eq",
    field: ["id"],
    name: "Nº do pedido",
    location: "order",
    type: "number",
    unique: true,
  },
  {
    condition: "$eq",
    field: ["content.BA"],
    name: "Nº do BA",
    location: "item",
  },
  {
    condition: "$eq",
    field: ["content.employee.id", "content.EngineerId", "content.EngineerID"],
    name: "Matrícula",
    location: "item",
  },
  {
    condition: "$regex",
    field: ["content.reason"],
    name: "Justificativa",
    location: "order",
  },
  {
    condition: "$regex",
    field: ["content.dictionaryName", "content.dictionaryTable"],
    name: "Nome do dicionário",
    location: "order",
  },
  {
    condition: "$eq",
    field: ["content.Key", "content.ID"],
    name: "Campo Key dicionários",
    location: "item",
  },
  {
    condition: "$regex",
    field: ["content.Name", "content.NAME"],
    name: "Campo Name dicionários",
    location: "item",
  },
  {
    condition: "$eq",
    field: ["content.Code", "content.CODE"],
    name: "Campo Code dicionários",
    location: "item",
  },
];

const selectActions = Object.keys(actions).map(key => ({ _id: key, name: actions[key] }));

export default function OrderSearch() {
  const [form] = Form.useForm();
  const [data, setData] = useState({ list: [] });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState([]);
  const [fetchingUser, setFetchingUser] = useState(false);
  const [users, setUsers] = useState([]);
  const [approvers, setApprovers] = useState([]);
  const [orderTypes, setOrderTypes] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  const [pageSize, setPageSize] = useState(20);
  const [pageIndex, setPageIndex] = useState(1);
  const [orderBy, setOrderBy] = useState("");
  const [useOrderId, setUseOrderId] = useState(false);
  const [disableBtn, setDisableBtn] = useState(true);
  const [fieldValueDisabled, setFieldValueDisabled] = useState(true);
  const [statusToCancel] = useState([6, 7, 8, 9]);
  const [modalVisible, setModalVisible] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [notViewColumns, setNotViewColumns] = useState(JSON.parse(localStorage.getItem("search-columns-hidden") || "[]"));
  const [tableWidth, setTableWidth] = useState(1400);

  async function getSelectData(type) {
    const storageName = `order-search-${type}`;
    let localData = localStorage.getItem(storageName);
    if (!localData || localData === "[]") {
      const { data: responseData } = await service.get(`/parametrizer/${type}`, []);
      localData = responseData;
      localStorage.setItem(storageName, JSON.stringify(localData));
    } else {
      localData = JSON.parse(localData);
    }
    if (type === "ordertype") {
      setOrderTypes(localData);
    } else {
      setOrderStatus(localData);
    }
    setLoading(false);
    return null;
  }

  async function searchAutoComplete(term, type = "users") {
    if (!term || term.length <= 2) {
      return null;
    }
    if (!fetchingUser) {
      setFetchingUser(true);
      const { data: responseData } = await service.get(`/order/metadata/${type}?term=${term}`, []);
      if (type === "users") {
        setUsers(responseData);
      } else {
        setApprovers(responseData);
      }
      setFetchingUser(false);
    }
    return null;
  }

  async function searchData(index) {
    setLoading(true);
    setDisableBtn(true);
    const forms = form.getFieldsValue();
    const queries = [];
    let query = "";
    const { field } = forms;

    Object.keys(forms).forEach(key => {
      if (forms[key] && key !== "field") {
        let keyName = key;
        let value = forms[key];

        if (key === "date") {
          value = moment(value).format("DD/MM/YYYY");
        }

        if (key === "fieldValue" && field) {
          keyName = "field";
          const selectedField = selectFields.find(item => item.name === field);
          selectedField.value = value;
          value = JSON.stringify(selectedField);
        }

        queries.push(`${keyName}=${value}`);
      }

      if (queries.length) {
        query = `&${queries.join("&")}`;
      }
    });

    const { data: responseData } = await service.get(`/order?pageIndex=${index}&pageSize=${pageSize}&orderBy=${orderBy}${query}`, {
      list: [],
    });
    setItems(responseData.list);
    delete responseData.list;
    setData(responseData);
    setLoading(false);
  }

  useEffect(() => {
    getSelectData("ordertype");
    getSelectData("orderstatus");
  }, []);

  function onChangePage(pagination, filters, sorter) {
    const sortBy = sorter.field ? `${sorter.field}|${sorter.order === "ascend" ? "-1" : "1"}` : "";
    setPageSize(pagination.pageSize);
    setOrderBy(sortBy);
    setPageIndex(pagination.current);
    searchData(pagination.current);
  }

  function onFinish() {
    setPageIndex(1);
    searchData(1);
  }

  function showTotal(total, range) {
    return data.maxResults ? `${range[0]} - ${range[1]} de ${data.maxResults}` : "";
  }

  function onFormChange() {
    const fields = form.getFieldsValue();
    delete fields.field;
    const disabled = !!Object.keys(fields).filter(v => fields[v]).length;
    setDisableBtn(!disabled);
  }

  function setUseOrderIdHandler() {
    const fieldValues = form.getFieldsValue();
    const value = fieldValues.field;
    const isUnique = selectFields.find(item => item.name === value) || {};

    if (isUnique.unique) {
      const fields = {
        date: "",
        approver_id: 0,
        user_id: 0,
        orderAction: 0,
        orderTypeId: 0,
        status_id: 0,
      };
      form.setFieldsValue(fields);
    }
    setUseOrderId(isUnique.unique);
  }

  function confirmCancel(id) {
    setLoading(false);
    message.success(`Pedido ${id} cancelado com sucesso!`);
    searchData(pageIndex);
  }

  const columns = [
    {
      title: "#",
      width: 80,
      dataIndex: "id",
      sorter: true,
      fixed: "left",
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 180,
      sorter: true,
      render: (_, item) => <StatusBadge status={item.status} size="small" />,
    },
    {
      title: "Abertura",
      width: 160,
      dataIndex: "date",
      sorter: true,
      render: (_, item) => (item.date ? moment(item.date).format("DD/MM/YYYY HH:mm") : ""),
    },
    {
      title: "Fechamento",
      dataIndex: "finishDate",
      width: 160,
      sorter: true,
      render: (text, item) => (item.finishDate ? moment(item.finishDate).format("DD/MM/YYYY HH:mm") : ""),
    },
    {
      title: "Solicitante",
      dataIndex: "userId",
      width: 140,
      sorter: true,
      render: (text, item) => {
        const tr = item.user ? item.user.id : "";
        const name = item.user ? item.user.name : "";
        return (
          <div className="user" title={name}>
            <span>{tr}</span>
            <span>{name}</span>
          </div>
        );
      },
    },
    {
      title: "Aprovador",
      dataIndex: "approver",
      width: 140,
      sorter: true,
      render: (text, item) => {
        const approver = item.approver && item.approver.length ? item.approver[item.approver.length - 1] : null;
        const tr = approver ? approver.id : "";
        const name = approver ? approver.name : "";
        return (
          <div className="user" title={name}>
            <span>{tr}</span>
            <span>{name}</span>
          </div>
        );
      },
    },
    {
      title: "Tipo de pedido",
      dataIndex: "orderTypeName",
      width: 300,
      sorter: true,
      render: (text, item) => (item.orderTypeId ? item.orderTypeId.name : ""),
    },
    {
      title: "Ação",
      dataIndex: "orderAction",
      width: 120,
      render: (text, item) => (item.orderAction ? actions[item.orderAction] : ""),
    },
    {
      title: "Dicionário",
      dataIndex: "content.dictionaryName",
      width: 240,
      render: (text, item) => (item.content && item.content.dictionaryName ? item.content.dictionaryName : "—"),
    },
    {
      title: "Opções",
      dataIndex: "options",
      fixed: "right",
      width: 90,
      align: "center",
      render: (text, item) =>
        !statusToCancel.includes(item.status.id._id) ? (
          <Popconfirm
            placement="topRight"
            title="Tem certeza que deseja cancelar esse pedido?"
            onConfirm={event => {
              event.stopPropagation();
              confirmCancel(item.id);
            }}
            onCancel={event => event.stopPropagation()}
            okText="Sim"
            cancelText="Não"
          >
            <Button icon={<DeleteOutlined />} type="link" className="option-link" onClick={event => event.stopPropagation()} />
          </Popconfirm>
        ) : (
          ""
        ),
    },
  ];

  const selectColumns = columns.filter(col => !["id", "status", "options"].includes(col.dataIndex));
  const viewColumns = columns.filter(col => !notViewColumns.includes(col.dataIndex));

  function setColumnsHandler(values) {
    setNotViewColumns(values);
    localStorage.setItem("search-columns-hidden", JSON.stringify(values));
    setTableWidth(viewColumns.reduce((total, col) => (Number(total) || 0) + col.width));
  }

  return (
    <div className="order-search">
      <Title className="title" level={4}>
        Visualização de pedidos
      </Title>
      <Form form={form} name="order-search-form" onFinish={onFinish} onFieldsChange={onFormChange}>
        <Row gutter={[12, 12]} justify="start">
          <Col xs={24} sm={12} md={8} lg={4}>
            <Form.Item name="field" rules={[{ required: false, message: "Por favor, preencha o campo" }]}>
              <Select
                showSearch
                placeholder="Buscar por campo"
                optionFilterProp="children"
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onChange={value => {
                  setFieldValueDisabled(!value);
                  form.setFieldsValue({ fieldValue: "" });
                  setUseOrderIdHandler();
                  setTimeout(() => form.getFieldInstance("fieldValue").focus(), 150);
                }}
              >
                <Option value={0}>Buscar por campo</Option>
                {selectFields.map((field, key) => (
                  <Option value={field.name} key={key + 1} title={field.name} alt={field.name}>
                    {field.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={5}>
            <Form.Item name="fieldValue" rules={[{ required: false, message: "Por favor, preencha o campo" }]}>
              <Input
                placeholder={fieldValueDisabled ? "Selecione o campo para a busca" : "Digite o valor da busca"}
                disabled={fieldValueDisabled}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="user_id" rules={[{ required: false, message: "Por favor, preencha o campo" }]}>
              <Select
                showSearch
                allowClear
                placeholder="Solicitante"
                notFoundContent={fetchingUser ? <Spin size="small" /> : null}
                filterOption={false}
                showArrow={false}
                onSearch={text => searchAutoComplete(text, "users")}
                disabled={useOrderId}
                style={{ width: "100%" }}
              >
                {useOrderId ? <Option value={0}>Solicitante</Option> : ""}
                {users.map(d => (
                  <Option key={d.id} value={d.id}>
                    {`${d.id} | ${d.name}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="approver_id" rules={[{ required: false, message: "Por favor, preencha o campo" }]}>
              <Select
                showSearch
                allowClear
                placeholder="Aprovador"
                notFoundContent={fetchingUser ? <Spin size="small" /> : null}
                filterOption={false}
                showArrow={false}
                onSearch={text => searchAutoComplete(text, "approvers")}
                disabled={useOrderId}
                style={{ width: "100%" }}
              >
                {useOrderId ? <Option value={0}>Aprovador</Option> : ""}
                {approvers.map(d => (
                  <Option key={d.id} value={d.id}>
                    {`${d.id} | ${d.name}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8} lg={4}>
            <Form.Item name="date" rules={[{ required: false, message: "Por favor, preencha o campo" }]}>
              <DatePicker disabled={useOrderId} format="DD/MM/YYYY" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={5}>
            <Form.Item name="status_id" rules={[{ required: false, message: "Por favor, preencha o campo" }]}>
              <Select
                disabled={useOrderId}
                showSearch
                placeholder="Status do pedido"
                optionFilterProp="children"
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                <Option value={0}>Status do pedido</Option>
                {orderStatus.map(type => (
                  <Option value={type._id} key={type._id} title={type.name} alt={type.name}>
                    {type.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={7}>
            <Form.Item name="orderTypeId" rules={[{ required: false, message: "Por favor, preencha o campo" }]}>
              <Select
                disabled={useOrderId}
                showSearch
                placeholder="Tipo de pedido"
                optionFilterProp="children"
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                <Option value={0}>Tipo de pedido</Option>
                {orderTypes.map(type => (
                  <Option value={type._id} key={type._id} title={type.name} alt={type.name}>
                    {type.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={5}>
            <Form.Item name="orderAction" rules={[{ required: false, message: "Por favor, preencha o campo" }]}>
              <Select
                disabled={useOrderId}
                showSearch
                placeholder="Tipo de ação"
                optionFilterProp="children"
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                <Option value={0}>Tipo de ação</Option>
                {selectActions.map(type => (
                  <Option value={type._id} key={type._id} title={type.name} alt={type.name}>
                    {type.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={4} lg={3}>
            <Form.Item>
              <Button type="primary" htmlType="submit" block disabled={disableBtn} loading={loading}>
                Buscar
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Divider orientation="left" style={{ marginBottom: data.maxResults ? 0 : 16 }}>
        Resultados da busca
      </Divider>

      {items.length ? (
        <Select
          className="select-columns"
          dropdownClassName="select-columns-option"
          placeholder="Ocultar colunas"
          defaultValue={notViewColumns}
          mode="multiple"
          showArrow
          bordered={false}
          style={{ minWidth: 200 }}
          maxTagCount={0}
          maxTagPlaceholder={omittedValues => `Colunas ocultas: ${omittedValues.length}`}
          allowClear
          size="small"
          menuItemSelectedIcon={<EyeInvisibleOutlined />}
          onChange={values => setColumnsHandler(values)}
        >
          {selectColumns.map(col => (
            <Option value={col.dataIndex} key={col.dataIndex} title={col.title} alt={col.title}>
              {col.title}
            </Option>
          ))}
        </Select>
      ) : (
        ""
      )}

      <Table
        columns={viewColumns}
        dataSource={items}
        scroll={{ x: tableWidth < 1000 ? tableWidth : 1000 }}
        loading={loading}
        sticky
        rowKey="id"
        expandable={{
          expandedRowRender: item => {
            const approverAvatar = item.user.requiredLevel.map((lv, i) => {
              const approver = item.approver[i] && item.approver[i] ? item.approver[i] : {};
              const { approved } = approver.result || {};
              const hasApproved = approved !== undefined;
              return (
                <div
                  key={`approver-${item.id}-${i}`}
                  className={hasApproved ? (approved ? "approver approved" : "approver denied") : "approver"}
                >
                  <h4>{approver.name || "Aguardando"}</h4>
                  <Avatar>{`N${i + 1}`}</Avatar>
                  <h5>{hasApproved ? (approved ? "Aprovado" : "Negado") : "Aguardando"}</h5>
                  <h6>{moment(approver.date || new Date()).format("DD/MM/YYYY HH:mm")}</h6>
                </div>
              );
            });

            const { justification } = item.approver[item.approver.length - 1] || {};

            return (
              <>
                <div className="approver-container">{approverAvatar}</div>
                {justification ? (
                  <div className="justification">
                    <h3>Justificativa</h3>
                    <p>{justification}</p>
                  </div>
                ) : (
                  ""
                )}
              </>
            );
          },
          rowExpandable: item => !!item.user.requiredLevel.length,
        }}
        onRow={record => ({
          onClick: () => {
            setOrderId(record.id);
            setModalVisible(true);
          },
        })}
        locale={{
          emptyText: (
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{
                height: 60,
              }}
              description={<span>Nenhum resultado encontrado para a sua busca.</span>}
            />
          ),
        }}
        onChange={onChangePage}
        pagination={{
          position: ["topRight", "bottomRight"],
          current: data.pageIndex,
          total: data.maxResults,
          defaultPageSize: pageSize,
          showTotal,
          size: "small",
        }}
      />

      <OrderModal orderId={orderId} visible={modalVisible} setModalVisible={setModalVisible} setOrderId={setOrderId} />
    </div>
  );
}
