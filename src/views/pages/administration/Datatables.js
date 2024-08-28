import { API_BASE_URL, apiRequest } from "../../../utility/apiRequest";
import {
  Badge,
  Button,
  Col,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  Row,
} from "reactstrap";
import { CheckCircle, Edit, Eye, User, UserPlus, XCircle } from "react-feather";
import React, { useContext, useEffect, useMemo, useState } from "react";

import DataTable from "react-data-table-component";
import FilterComponent from "./FilterComponent";
import { Link } from "react-router-dom";
import LoadingContext from "../../../utility/context/LoadingContext";
import Select from "react-select";
import { Tooltip } from "react-tooltip";
import dummyAvatar from "../../../assets/images/default.jpg";
import moment from "moment";
import toast from "react-hot-toast";

const Table = () => {
  const { setLoading } = useContext(LoadingContext);
  const [teacherList, setTeacherList] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [unassignedTeachers, setUnassignedTeachers] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [allStudentList, setAllStudentList] = useState([]);

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [modal2, setModal2] = useState(false);
  const toggle2 = () => setModal2(!modal2);
  const [Message, setMessage] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [assignValues, setAssignValues] = useState({
    teacherId: "",
    students: [],
  });

  useEffect(() => {
    getPendingStudent();
    getUnassignedTeachers();
    getStudentsList();
  }, []);

  const getStudentsList = async () => {
    const payload = {
      role: "student",
      type: "approved",
    };

    const resp = await apiRequest._getUserList(payload);

    if (resp.status) {
      setAllStudentList(resp.data);
    }
  };

  const getUnassignedTeachers = async () => {
    const resp = await apiRequest._unassignedTeachers();
    console.log(resp);
    if (resp.status) {
      setUnassignedTeachers(resp.data);
    }
  };

  const getPendingStudent = async () => {
    setPageLoading(true);
    const payload = {
      role: "teacher",
      type: "pending-approval",
    };
    const resp = await apiRequest._getTeachers();

    setPageLoading(false);
    if (resp.status) {
      setTeacherList(resp.data);
      setFilterData(resp.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

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

  const subHeaderComponent = useMemo(() => {
    return (
      <FilterComponent
        onFilter={(e) => {
          setFilterText(e.target.value);
          let newData = filterData.filter(
            (item) =>
              item.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
              item.email.toLowerCase().includes(e.target.value.toLowerCase())
          );
          setTeacherList(newData);
        }}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  const handleAssignStudents = async () => {
    console.log(assignValues);

    let studentId = [];

    assignValues.students.forEach((student) => {
      studentId.push(student.value);
    });

    if (studentId.length > 0 && assignValues.teacherId != "") {
      setLoading(true);
      const payload = {
        students: studentId,
      };

      const resp = await apiRequest._addAllotStudent(
        assignValues.teacherId,
        payload
      );

      setLoading(false);

      if (resp.status) {
        toast.success(resp.message);
      } else {
        toast.error(resp.message);
      }
    } else {
      toast.error("Teacher and Student both are required.");
    }
  };
  const filterStudents = async (teacehrID) => {
    const matchTeacher = unassignedTeachers.filter(
      (item) => item.userID == teacehrID
    );

    if (matchTeacher[0]) {
      let filteredStudents = allStudentList.filter((student) => {
        return student.subjects.some((subject) =>
          matchTeacher[0].subjects.includes(subject._id)
        );
      });

      let data = await filteredStudents
        .filter((item) => item.status === "active")
        .map((item) => {
          return {
            value: item.userID,
            label: item.studentFirstName + " " + item.studentLastName,
          };
        });
      setStudentList(data);
    }
  };
  return (
    <React.Fragment>
      <Row className="mb-2">
        <Col xl="12" md="12">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="card-title mb-0  headingcard">Teachers</h4>
            <Button
              onClick={() => setShowAddModal(true)}
              className="tablebtnview"
              color={"primary"}
            >
              Add New Teacher
            </Button>
          </div>
        </Col>
      </Row>

      <DataTable
        noHeader
        data={teacherList}
        progressPending={pageLoading}
        columns={[
          {
            name: "Image",
            minWidth: "120px",
            selector: (row) => row.imgUrl,
            sortable: true,
            cell: (row) => (
              <img
                src={
                  row?.profileImage
                    ? `${API_BASE_URL}/${row.profileImage}`
                    : dummyAvatar
                }
                className=" table_img rounded-circle img-thumbnail me-1"
                alt=""
              />
            ),
          },
          {
            name: "Name",
            minWidth: "120px",
            selector: (row) => row.name,
            sortable: true,
            cell: (row) => row.name,
          },
          {
            name: "Email",
            minWidth: "200px",
            selector: (row) => row.email,
            sortable: true,
            cell: (row) => row.email,
          },
          {
            name: "Subjects",
            minWidth: "170px",
            selector: (row) => row.subjects,
            sortable: true,
            cell: (row) => (
              <div className="tooltipWrapper">
                {row.subjects.length > 1 ? (
                  <>
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
                        "+" + row.subjects.length - 1 + " more",
                      ]}
                    </a>
                  </>
                ) : (
                  <a
                    style={{
                      fontWeight: 600,
                      lineHeight: "18px",
                      fontSize: 13,
                    }}
                  >
                    {[row.subjects[0].name]}
                  </a>
                )}
              </div>
            ),
          },
          {
            name: "Students",
            minWidth: "160px",
            selector: (row) => row.email,
            sortable: true,
            cell: (row) => (
              // <Link to="/pages/administrationview">
              <Badge color="success">{row.students}</Badge>
              // </Link>
            ),
          },
          {
            name: "Actions",
            minWidth: "200px",
            cell: (row) => (
              <div className="tableaction">
                <Button
                  tag={Link}
                  to="/pages/assignusers"
                  state={{ teacherInfo: row }}
                  className="tablebtnview"
                >
                  <Eye className="tableicon" />
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

      <Modal centered isOpen={modal} toggle={toggle} size="lg">
        <ModalBody className="p-2">
          <h2 className="status_heading">Assign Student</h2>
          <div className="deleteModal">
            <FormGroup className="form-group">
              <Label className="form-label" for="fname">
                Full Name
              </Label>
              <Input
                type="text"
                id="fname"
                name="fname"
                placeholder="Full Name"
              />
            </FormGroup>
            <ul className="tagsFlex">
              <li>
                <img
                  src={
                    "http://3.91.192.145:3001/uploads/1711973021110-New-file--1-.gif"
                  }
                  className="imgUser"
                  alt=""
                />
                <p>Lisa Joestar</p>
                <XCircle fontSize={18} />
              </li>
              <li>
                <img
                  src={
                    "http://3.91.192.145:3001/uploads/1711973021110-New-file--1-.gif"
                  }
                  className="imgUser"
                  alt=""
                />
                <p>Iggy Joestar</p>
                <XCircle fontSize={18} />
              </li>
              <li>
                <img
                  src={
                    "http://3.91.192.145:3001/uploads/1711973021110-New-file--1-.gif"
                  }
                  className="imgUser"
                  alt=""
                />
                <p>Iggy Joestar</p>
                <XCircle fontSize={18} />
              </li>
              <li>
                <img
                  src={
                    "http://3.91.192.145:3001/uploads/1711973021110-New-file--1-.gif"
                  }
                  className="imgUser"
                  alt=""
                />
                <p>Lisa Joestar</p>
                <XCircle fontSize={18} />
              </li>
              <li>
                <img
                  src={
                    "http://3.91.192.145:3001/uploads/1711973021110-New-file--1-.gif"
                  }
                  className="imgUser"
                  alt=""
                />
                <p>Iggy Joestar</p>
                <XCircle fontSize={18} />
              </li>
              <li>
                <img
                  src={
                    "http://3.91.192.145:3001/uploads/1711973021110-New-file--1-.gif"
                  }
                  className="imgUser"
                  alt=""
                />
                <p>Iggy Joestar</p>
                <XCircle fontSize={18} />
              </li>
            </ul>
            <div className="btn-cancel-ok text-center">
              <Button
                className="btn-cancel me-1"
                tag={Link}
                to="/pages/assignusers"
              >
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
            <Button color="primary" onClick={toggle2}>
              Send
            </Button>
          </div>
        </ModalBody>
      </Modal>

      <Modal
        centered
        isOpen={showAddModal}
        toggle={() => setShowAddModal(false)}
      >
        <ModalBody className="p-2 statusmodal_body">
          <h2 className="status_heading">Add New Teacher</h2>

          <FormGroup className="form-group">
            <Label className="form-label" for="Message">
              Select Teacher
            </Label>
            <Input
              type="select"
              name="State"
              id="State"
              style={{ textTransform: "capitalize" }}
              value={assignValues.teacherId}
              onChange={(e) => {
                setAssignValues({
                  ...assignValues,
                  teacherId: e.target.value,
                });
                filterStudents(e.target.value);
              }}
            >
              <option value="">Select Teacher</option>
              {unassignedTeachers.map((item) => (
                <option value={item.userID}>{item.name}</option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup className="form-group">
            <Label className="form-label" for="Message">
              Select Students
            </Label>
            <Select
              isMulti
              options={studentList}
              value={assignValues?.students}
              onChange={
                (item) => setAssignValues({ ...assignValues, students: item })
                // console.log(item)
              }
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  padding: "5px 0",
                  borderRadius: 9,
                }),
              }}
              components={{
                Option: (props) => (
                  <div
                    onClick={() => props.selectOption(props.data)}
                    style={{
                      padding: "10px 10px",
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ textTransform: "capitalize" }}>
                      {props.data.label}
                    </span>
                  </div>
                ),
              }}
            />
          </FormGroup>
          <div className="btn-cancel-ok text-center mt-1">
            <Button
              className="btn-cancel me-1"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button color="primary" onClick={handleAssignStudents}>
              Submit
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default Table;
