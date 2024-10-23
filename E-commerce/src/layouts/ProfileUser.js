import React from "react";
import { Nav, Tab, Container, Row, Col } from "react-bootstrap";
import InfoUser from "../page/ProfileUser/infoUser";
import InfoOrder from "../page/ProfileUser/infoOrder";

function ProfileUser() {
  return (
    <Container>
      <h2 className="text-center">Quản lý tài khoản</h2>
      <br />
      <Tab.Container defaultActiveKey="info">
        <Row>
          <Col
            sm={3}
            style={{
              backgroundColor: "rgb(224, 224, 224)",
              borderRadius: "25px",
              minHeight: "400px",
            }}
            className="py-4"
          >
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="info">Thông tin cá nhân</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="order">Đơn hàng</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9} className="px-4">
            <Tab.Content>
              <Tab.Pane eventKey="info">
                <h3>Thông tin cá nhân</h3>
                <InfoUser />
              </Tab.Pane>
              <Tab.Pane eventKey="order">
                <h3>Đơn hàng</h3>
                <InfoOrder />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
}

export default ProfileUser;
