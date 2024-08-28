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

import Comments from "./comments";
import Documents from "./documents";
import Genralinfo from "./generalinfo";
import Meeting from "./meeting";
import MyNotifications from "../../../notifications/mynotification";
import ProxyMeetings from "./ProxyMeetings";
import TabStudents from "./tabstudents";
import TeacherGroup from "./teachergroup";
import classnames from "classnames";

const Viewteacher = () => {
  const { details, teacherList } = useLocation().state;
  const [teacherInfo, setTeacherInfo] = useState(details);
  const [allTeacherList, setAllTeacherList] = useState(teacherList);
  const [currentActiveTab, setCurrentActiveTab] = useState("1");

  const toggle = (tab) => {
    if (currentActiveTab !== tab) setCurrentActiveTab(tab);
  };
  return (
    <React.Fragment>
      <Row className="mb-2">
        <Col xl="6" md="6">
          <h4 className="card-title mb-1 headingcard">Teacher Details</h4>
        </Col>
        <Col xl="6" md="6" className="text-end">
          <Link to="/pages/teacherapproved">
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
              active: currentActiveTab === "8",
            })}
            onClick={() => {
              toggle("8");
            }}
          >
            Proxy Meetings
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
            Message
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
            Notification
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
            Assigned Students
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({
              active: currentActiveTab === "7",
            })}
            onClick={() => {
              toggle("7");
            }}
          >
            Group
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={currentActiveTab}>
        <TabPane tabId="1">
          <Genralinfo teacherInfo={teacherInfo} />
        </TabPane>
        <TabPane tabId="2">
          <Documents teacherInfo={teacherInfo} />
        </TabPane>
        <TabPane tabId="3">
          <Meeting teacherInfo={teacherInfo} allTeacherList={allTeacherList} />
        </TabPane>
        <TabPane tabId="8">
          <ProxyMeetings teacherInfo={teacherInfo} />
        </TabPane>
        <TabPane tabId="4">
          <Comments teacherInfo={teacherInfo} />
        </TabPane>
        <TabPane tabId="5">
          <MyNotifications teacherInfo={teacherInfo} />
        </TabPane>
        <TabPane tabId="6">
          <TabStudents teacherInfo={teacherInfo} />
        </TabPane>
        <TabPane tabId="7">
          <TeacherGroup teacherInfo={teacherInfo} />
        </TabPane>
      </TabContent>
    </React.Fragment>
  );
};
export default Viewteacher;
