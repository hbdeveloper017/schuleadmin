import "@styles/react/pages/page-authentication.scss";

import {
  Button,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import React, { useState } from "react";
import classnames from "classnames";

import Classwork from "./classwork";
import Comments from "./comments";
import Documents from "./documents";
import Generalinfo from "./generalinfo";
import Meeting from "./meeting";
import Referral from "./referral";

const Viewstudent = () => {
  const { details } = useLocation().state;
  const [studentInfo, setStudentInfo] = useState(details);
  const [currentActiveTab, setCurrentActiveTab] = useState("1");

  const toggle = (tab) => {
    if (currentActiveTab !== tab) setCurrentActiveTab(tab);
  };
  return (
    <React.Fragment>
      <Row className="mb-2">
        <Col xl="6" md="6">
          <h4 className="card-title mb-1 headingcard">Student Details</h4>
        </Col>
        <Col xl="6" md="6" className="text-end">
          <Link to="/pages/studentapproved">
            <Button className="btn-add">Back</Button>
          </Link>
        </Col>
      </Row>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({
              active: currentActiveTab === "1",
            })}
            onClick={() => {
              toggle("1");
            }}
          >
            General Info
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({
              active: currentActiveTab === "2",
            })}
            onClick={() => {
              toggle("2");
            }}
          >
            Documents
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({
              active: currentActiveTab === "3",
            })}
            onClick={() => {
              toggle("3");
            }}
          >
            Meetings
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({
              active: currentActiveTab === "4",
            })}
            onClick={() => {
              toggle("4");
            }}
          >
            Classwork
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({
              active: currentActiveTab === "5",
            })}
            onClick={() => {
              toggle("5");
            }}
          >
            Messages
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({
              active: currentActiveTab === "6",
            })}
            onClick={() => {
              toggle("6");
            }}
          >
            Referral
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={currentActiveTab}>
        <TabPane tabId="1">
          <Generalinfo studentInfo={studentInfo} />
        </TabPane>
        <TabPane tabId="2">
          <Documents studentInfo={studentInfo} />
        </TabPane>
        <TabPane tabId="3">
          <Meeting studentInfo={studentInfo} />
        </TabPane>
        <TabPane tabId="4">
          <Classwork studentInfo={studentInfo} />
        </TabPane>
        <TabPane tabId="5">
          {currentActiveTab == 5 && <Comments studentInfo={studentInfo} />}
        </TabPane>
        <TabPane tabId="6">
          <Referral studentInfo={studentInfo} />
        </TabPane>
      </TabContent>
    </React.Fragment>
  );
};
export default Viewstudent;
