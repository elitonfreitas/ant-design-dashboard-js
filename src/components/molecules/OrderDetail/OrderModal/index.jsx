import React from "react";
import { Button, Spin, Modal } from "antd";
import { FileExcelOutlined } from "@ant-design/icons";
import OrderDetail from "../../../organisms/OrderDetail";
import "./style.less";

export default function OrderModal(props) {
  const { setModalVisible, setOrderId, orderId, visible } = props;

  return (
    <Modal
      title="Detalhamento"
      visible={visible}
      width="100%"
      style={{ top: "5vh", maxHeight: "90vh", maxWidth: "90%" }}
      bodyStyle={{ height: "calc(90vh - 110px)", overflowY: "auto", paddingTop: 0 }}
      onCancel={() => {
        setModalVisible(false);
        setOrderId(null);
      }}
      footer={
        <div className="order-modal-footer-button">
          <Button
            className="pull-right"
            type="primary"
            onClick={() => {
              setModalVisible(false);
              setOrderId(null);
            }}
          >
            Fechar
          </Button>
          <Button type="link" icon={<FileExcelOutlined />} onClick={() => alert(orderId)}>
            Download completo
          </Button>
          <Button type="link" icon={<FileExcelOutlined />} danger onClick={() => alert(orderId)}>
            Download dos erros
          </Button>
        </div>
      }
    >
      {orderId ? <OrderDetail orderId={orderId} /> : <Spin size="large" className="order-detail-spin" />}
    </Modal>
  );
}
