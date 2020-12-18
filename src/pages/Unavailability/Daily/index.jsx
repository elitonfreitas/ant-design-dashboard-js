import { Layout, Row, Col, Input, Select, DatePicker, Form, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import moment from "moment";

const { TextArea, Search } = Input;
const { Content } = Layout;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function Daily() {
  const validateMessages = {
    required: " is required!",
    types: {
      email: " is not validate email!",
      number: " is not a validate number!",
    },
    number: {
      range: " must be between ${min} and ${max}", // eslint-disable-line no-template-curly-in-string
    },
  };

  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  function onFinish() {}

  function onChangeRangeDate(dates, dateStrings) {
    console.log("From: ", dates[0], ", to: ", dates[1]);
    console.log("From: ", dateStrings[0], ", to: ", dateStrings[1]);
  }

  return (
    <>
      <Row>
        <Content style={{ padding: "0 15px" }}>
          <Form
            name="nest-messages"
            layout="vertical"
            initialValues={{
              remember: false,
            }}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row>
              <Col span={6} style={{ padding: "0 10px " }}>
                <h3>Dados do técnico</h3>
              </Col>
            </Row>

            <Row>
              <Col span={6} style={{ padding: "0 10px " }}>
                <Form.Item name="findUser" rules={[{ required: true }]}>
                  <Search placeholder="input search text" onSearch={value => console.log(value)} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={6} style={{ padding: "0 10px " }}>
                <Form.Item name="tech">
                  <Input placeholder="Técnico" disabled prefix={<UserOutlined />} />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={6} style={{ padding: "0  10px" }}>
                <h3>Dados da indisponibilidade</h3>
              </Col>
            </Row>
            <Row>
              <Col span={6} style={{ padding: "0 10px " }}>
                <Form.Item name="selectMot" rules={[{ required: true }]}>
                  <Select placeholder="Selecione" style={{ width: "100%" }} onChange={handleChange}>
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="Yiminghe">yiminghe</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6} style={{ padding: "0 10px " }}>
                <Form.Item name="date" rules={[{ required: true }]}>
                  <RangePicker
                    ranges={{
                      Today: [moment(), moment()],
                      "This Month": [moment().startOf("month"), moment().endOf("month")],
                    }}
                    showTime
                    format="DD/MM/YYYY HH:mm"
                    onChange={onChangeRangeDate}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12} style={{ padding: "0 10px " }}>
                <Form.Item name="textareat" rules={[{ required: true }]}>
                  <TextArea rows={4} placeholder="Observação" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12} style={{ padding: "0 10px", textAlign: "right" }}>
                <Form.Item>
                  <Button type="primary">Enviar</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Content>
      </Row>
    </>
  );
}
