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
import { CheckCircle, Edit, Eye, XCircle } from "react-feather";
import React, { useContext, useEffect, useMemo, useState } from "react";

import DataTable from "react-data-table-component";
import FilterComponent from "./FilterComponent";
import { Link } from "react-router-dom";
import LoadingContext from "../../../../utility/context/LoadingContext";
import { Tooltip } from "react-tooltip";
import { apiRequest } from "../../../../utility/apiRequest";
import moment from "moment";
import toast from "react-hot-toast";

const Table = () => {
  const { setLoading } = useContext(LoadingContext);
  const [teacherList, setTeacherList] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [pageLoading, setPageLoading] = useState(false);

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [modal2, setModal2] = useState(false);
  const toggle2 = () => setModal2(!modal2);
  const [Message, setMessage] = useState("");
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    getPendingStudent();
  }, [subjects]);

  const getPendingStudent = async () => {
    setPageLoading(true);
    const payload = {
      role: "teacher",
      type: "pending-approval",
    };
    if (subjects.length > 0) payload["subjects"] = subjects;

    const resp = await apiRequest._getUserList(payload);

    setPageLoading(false);

    if (resp.status) {
      setTeacherList(resp.data);
      setFilterData(resp.data);
    } else {
      setTeacherList([]);
      setFilterData([]);
    }
  };

  const subHeaderComponent = useMemo(() => {
    return (
      <FilterComponent
        onSubjectChange={(e) => {
          setSubjects(e.map((e) => e?.value));
        }}
        onFilter={(e) => {
          setFilterText(e.target.value);
          let newData = filterData.filter(
            (item) =>
              item.firstName
                .toLowerCase()
                .includes(e.target.value.toLowerCase()) ||
              item.lastName
                .toLowerCase()
                .includes(e.target.value.toLowerCase()) ||
              item.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
              item.address
                .toLowerCase()
                .includes(e.target.value.toLowerCase()) ||
              item.phone.number
                .toLowerCase()
                .includes(e.target.value.toLowerCase())
          );
          setTeacherList(newData);
        }}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  const handleApproveTeacher = async () => {
    setModal(false);
    setLoading(true);
    const payload = {
      userID: selectedTeacher,
      role: "teacher",
    };

    const resp = await apiRequest._userApprove(payload);

    setLoading(false);

    if (resp.status) {
      toast.success(resp.message);
    } else {
      toast.error(resp.message);
    }
  };

  const handleRejectStudent = async () => {
    setLoading(true);

    const payload = {
      userID: selectedTeacher,
      reason: Message,
    };

    const resp = await apiRequest._userReject(payload);
    console.log(resp);
    setLoading(false);
    if (resp.status) {
      toast.success(resp.message);
      setModal2(false);
      setMessage("");
      setSelectedStudentID("");
    } else {
      toast.error(resp.message);
    }
  };

  return (
    <React.Fragment>
      <Row className="mb-2">
        <Col xl="6" md="6">
          <h4 className="card-title mb-1  headingcard">Pending Approval</h4>
        </Col>
      </Row>

      <DataTable
        noHeader
        data={teacherList}
        progressPending={pageLoading}
        columns={[
          {
            name: "Name",
            minWidth: "120px",
            selector: (row) => row.firstName,
            sortable: true,
            cell: (row) => row.firstName + " " + row.lastName,
          },
          {
            name: "Email",
            minWidth: "160px",
            selector: (row) => row.email,
            sortable: true,
            cell: (row) => row.email,
          },
          {
            name: "Phone No.",
            minWidth: "80px",
            selector: (row) => row.phone.number,
            sortable: true,
            cell: (row) => row.phone.number,
          },
          {
            name: "Gender",
            minWidth: "120px",
            selector: (row) => row.gender,
            sortable: true,
            cell: (row) => (
              <span style={{ textTransform: "capitalize" }}>
                {row.gender == "prefer-not-to-tell"
                  ? "Not Preferred"
                  : row.gender}
              </span>
            ),
          },
          {
            name: "DOB",
            minWidth: "120px",
            selector: (row) => row.dob,
            sortable: true,
            cell: (row) => moment(row.dob).format("DD MMM yyyy"),
          },
          {
            name: "Subjects",
            minWidth: "170px",
            selector: (row) => row.subjects[0].name,
            sortable: true,
            cell: (row) => (
              <>
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
                      {row.subjects.slice(1).map((item) => (
                        <li>{item.name}</li>
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
              </>
            ),
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
              <div className="tableaction ms-auto">
                <Button
                  tag={Link}
                  to="/pages/viewpendingteacher"
                  state={{ teacherInfo: row }}
                  className="tablebtnview"
                >
                  <Eye className="tableicon" />
                </Button>
                <Button
                  className="tablebtnedit"
                  onClick={() => {
                    setSelectedTeacher(row.userID);
                    setModal(true);
                  }}
                >
                  <CheckCircle className="tableicon" />
                </Button>
                <Button
                  className="tablebtndelete me-0"
                  onClick={() => {
                    setSelectedTeacher(row.userID);
                    setModal2(true);
                  }}
                >
                  <XCircle className="tableicon" />
                </Button>
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
              <Button className="btn-ok" onClick={handleApproveTeacher}>
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
                  value={Message}
                  onChange={(e) => setMessage(e.target.value)}
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
