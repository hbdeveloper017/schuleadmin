import { API_BASE_URL, apiRequest } from "../../../utility/apiRequest";
import { Button, Col, Row } from "reactstrap";
import { Edit, Trash } from "react-feather";
import React, { useEffect, useState } from "react";

import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import StudentTable from "./StudentTable";
import TeacherTable from "./TeacherTable";

function DeleteRequest() {
  const [selectedTab, setSelectedTab] = useState(1);
  return (
    <React.Fragment>
      <Row className="mb-2">
        <Col xl="6" md="6">
          <h4 className="card-title mb-0 headingcard">Delete Request</h4>
        </Col>
        <Col xl="6" md="6" className="text-end">
          <button
            className={selectedTab == 1 ? "active btn-add2" : "btn-add2"}
            onClick={() => setSelectedTab(1)}
          >
            Student
          </button>
          <button
            className={selectedTab == 2 ? "active btn-add2" : "btn-add2"}
            onClick={() => setSelectedTab(2)}
          >
            Teacher
          </button>
        </Col>
      </Row>
      <div className="card">
        <div className="card-body filterheader">
          {selectedTab == 1 && <StudentTable />}

          {selectedTab == 2 && <TeacherTable />}
        </div>
      </div>
    </React.Fragment>
  );
}

export default DeleteRequest;
