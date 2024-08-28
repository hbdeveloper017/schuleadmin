import { Button, Col, Row } from "reactstrap";
import React, { useState } from "react";

import DataTable from "react-data-table-component";
import GroupChat from "./GroupChat";
import IndividualChat from "./IndividualChat";
import toast from "react-hot-toast";

function Datatables() {
  const [studentList, setStudentList] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [filterText, setFilterText] = useState([]);
  const [selectedTab, setSelectedTab] = useState(1);

  return (
    <React.Fragment>
      <Row className="mb-2 align-items-center">
        <Col xl="6" md="6">
          <h4 className="card-title headingcard mb-0">Illegal Messages</h4>
        </Col>
        <Col xl="6" md="6">
          <div className="text-end chatTabBtns">
            <button
              onClick={() => setSelectedTab(1)}
              className="me-1"
              style={{
                backgroundColor: selectedTab == 1 ? "#ff6020" : "#82868b",
              }}
            >
              Individual Chats
            </button>
            <button
              onClick={() => setSelectedTab(2)}
              style={{
                backgroundColor: selectedTab == 2 ? "#ff6020" : "#82868b",
              }}
            >
              Group Chats
            </button>
          </div>
        </Col>
      </Row>
      {selectedTab == 1 ? <IndividualChat /> : <GroupChat />}
    </React.Fragment>
  );
}

export default Datatables;
