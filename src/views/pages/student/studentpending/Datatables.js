import {
  Button,
  Col,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  Row,
} from "reactstrap";
import { CheckCircle, Eye, XCircle } from "react-feather";
import React, { useContext, useEffect, useMemo, useState } from "react";

import DataTable from "react-data-table-component";
import FilterComponent from "./FilterComponent";
import { Link } from "react-router-dom";
import LoadingContext from "../../../../utility/context/LoadingContext";
import { Tooltip } from "react-tooltip";
import { apiRequest } from "../../../../utility/apiRequest";
import moment from "moment/moment";
import toast from "react-hot-toast";

const Table = (props) => {
  const { setLoading } = useContext(LoadingContext);
  const [studentList, setStudentList] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [filterText, setFilterText] = React.useState("");
  const [selectedStudentID, setSelectedStudentID] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [pageLoading, setPageLoading] = useState(false);
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [modal2, setModal2] = useState(false);
  const toggle2 = () => setModal2(!modal2);
  const [Message, setMessage] = useState("");

  useEffect(() => {
    getPendingStudent();
  }, []);

  const getPendingStudent = async (queryParams) => {
    setPageLoading(true);

    const payload = {
      role: "student",
      type: "pending-approval",
    };
    if (queryParams) {
      if (queryParams?.subjects) payload["subjects"] = queryParams.subjects;
      if (queryParams?.schools) payload["schools"] = queryParams.schools;
      if (queryParams?.grades) payload["grades"] = queryParams.grades;
    }

    const resp = await apiRequest._getUserList(payload);

    setPageLoading(false);

    if (resp.status) {
      setStudentList(resp.data);
      setFilterData(resp.data);
    } else {
      setStudentList([]);
      setFilterData([]);
    }
  };

  const handleApproveStudent = async () => {
    setModal(false);
    setLoading(true);
    const payload = {
      userID: selectedStudentID,
      role: "student",
    };

    const resp = await apiRequest._userApprove(payload);
    setLoading(false);
    if (resp.status) {
      toast.success(resp.message);
      setSelectedStudentID("");
    } else {
      toast.error(resp.message);
    }
  };

  const handleRejectStudent = async () => {
    setLoading(true);

    const payload = {
      userID: selectedStudentID,
      reason: rejectReason,
    };

    const resp = await apiRequest._userReject(payload);
    setLoading(false);
    if (resp.status) {
      toast.success(resp.message);
      setModal2(false);
      setRejectReason("");
      setSelectedStudentID("");
    } else {
      toast.error(resp.message);
    }
  };

  const subHeaderComponent = useMemo(() => {
    return (
      <FilterComponent
        onNewFilter={getPendingStudent}
        onReset={getPendingStudent}
        onFilter={(e) => {
          setFilterText(e.target.value);
          let newData = filterData.filter(
            (item) =>
              item.studentFirstName
                .toLowerCase()
                .includes(e.target.value.toLowerCase()) ||
              item.studentLastName
                .toLowerCase()
                .includes(e.target.value.toLowerCase()) ||
              item.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
              item.grade.name
                .toLowerCase()
                .includes(e.target.value.toLowerCase()) ||
              item.school.name
                .toLowerCase()
                .includes(e.target.value.toLowerCase())
          );
          setStudentList(newData);
        }}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  return (
    <React.Fragment>
      <DataTable
        noHeader
        data={studentList}
        progressPending={pageLoading}
        columns={[
          {
            name: "Name",
            minWidth: "120px",
            selector: (row) => row.studentFirstName,
            sortable: true,
            cell: (row) => (
              <span style={{ textTransform: "capitalize" }}>
                {[row.studentFirstName, " ", row.studentLastName]}
              </span>
            ),
          },
          {
            name: "Email",
            minWidth: "190px",
            selector: (row) => row.email,
            sortable: true,
            cell: (row) => row.email,
          },
          {
            name: "Phone No.",
            minWidth: "170px",
            selector: (row) => row?.phone?.number,
            sortable: true,
            cell: (row) => row?.phone?.countryCode + " " + row?.phone?.number,
          },
          {
            name: "Subjects",
            minWidth: "170px",
            selector: (row) => row.subjects[0].name,
            sortable: true,
            cell: (row) => (
              <div className="tooltipWrapper">
                <Tooltip
                  id={row.email}
                  place="top"
                  style={{
                    backgroundColor: "#797d8c",
                    color: "#fff",
                    fontWeight: 600,
                  }}
                >
                  <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                    {row.subjects.slice(1).map((item, index) => (
                      <li key={index}>{item.name}</li>
                    ))}
                  </ul>
                </Tooltip>

                <a
                  style={{
                    fontWeight: 600,
                    lineHeight: "18px",
                    fontSize: 13,
                  }}
                  data-tooltip-id={row.email}
                >
                  {[
                    row.subjects[0].name,
                    " ",
                    row.subjects.length > 1 &&
                      "+" + row.subjects.length - 1 + " more",
                  ]}
                </a>
              </div>
            ),
          },
          {
            name: "School",
            minWidth: "180px",
            selector: (row) => row.school.name,
            sortable: true,
            cell: (row) => row.school.name,
          },
          {
            name: "Class",
            minWidth: "60px",
            selector: (row) => row.grade.name,
            sortable: true,
            cell: (row) => row.grade.name,
          },
          {
            name: "Date",
            minWidth: "120px",
            selector: (row) => row.createdAt,
            sortable: true,
            cell: (row) => moment(row.createdAt).format("ll"),
          },
          {
            name: "Actions",
            minWidth: "200px",
            cell: (row) => (
              <div className="tableaction">
                <>
                  <Button
                    tag={Link}
                    to="/pages/viewpendingstudent"
                    state={{ studentInfo: row }}
                    className="tablebtnview"
                  >
                    <Eye className="tableicon" />
                  </Button>
                  <Button
                    className="tablebtnedit"
                    onClick={() => {
                      setSelectedStudentID(row.userID);
                      setModal(true);
                    }}
                  >
                    <CheckCircle className="tableicon" />
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedStudentID(row.userID);
                      setModal2(true);
                    }}
                    className="tablebtndelete"
                  >
                    <XCircle className="tableicon" />
                  </Button>
                </>
              </div>
            ),
          },
        ]}
        className="react-dataTable paddingbox"
        defaultSortField="name"
        pagination
        subHeader
        subHeaderComponent={subHeaderComponent}
      />

      <Modal centered isOpen={modal} toggle={toggle}>
        <ModalBody className="p-2">
          <div className="deleteModal text-center">
            <CheckCircle className="deletemodal_icon" />
            <h2>Confirmation</h2>
            <p>Are you sure you want to accept this?</p>
            <div className="btn-cancel-ok">
              <Button className="btn-cancel me-1" onClick={toggle}>
                Cancel
              </Button>
              <Button className="btn-ok" onClick={handleApproveStudent}>
                OK
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      <Modal centered isOpen={modal2} toggle={toggle2}>
        <ModalBody className="p-2 statusmodal_body">
          <h2 className="status_heading">Reason</h2>
          <Row>
            <Col md="12" sm="12">
              <FormGroup className="form-group">
                <Label className="form-label" for="Message">
                  Message
                </Label>
                <Input
                  type="textarea"
                  id="Message"
                  name="Message"
                  rows="4"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Type Here..."
                />
              </FormGroup>
            </Col>
          </Row>
          <div className="btn-cancel-ok text-center mt-1">
            <Button className="btn-cancel me-1" onClick={toggle2}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleRejectStudent}>
              Send
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default Table;
