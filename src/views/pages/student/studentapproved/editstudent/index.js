// ** React Imports

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

import Availability from "./availability";
import Generalinfo from "./generalinfo";
import Subjectstariff from "./subjectstariff";
import classnames from "classnames";

// ** Custom Components

const Editstudent = () => {
  const { details } = useLocation().state;
  const [studentInfo, setStudentInfo] = useState(details);

  const [currentActiveTab, setCurrentActiveTab] = useState("1");

  // Toggle active state for Tab
  const toggle = (tab) => {
    if (currentActiveTab !== tab) setCurrentActiveTab(tab);
  };
  return (
    <React.Fragment>
      <Row className="mb-2">
        <Col xl="6" md="6">
          <h4 className="card-title mb-1 headingcard">Edit Student</h4>
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
            Availability
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
            Subjects & Tariff
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={currentActiveTab}>
        <TabPane tabId="1">
          <Generalinfo studentInfo={studentInfo} />
        </TabPane>
        <TabPane tabId="2">
          <Availability studentInfo={studentInfo} />
        </TabPane>
        <TabPane tabId="3">
          <Subjectstariff studentInfo={studentInfo} />
        </TabPane>
      </TabContent>
    </React.Fragment>
  );
};
export default Editstudent;
