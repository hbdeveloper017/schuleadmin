import { API_BASE_URL, apiRequest } from "../../../../utility/apiRequest";
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
import {
  CheckCircle,
  Edit,
  Eye,
  Info,
  Plus,
  User,
  UserPlus,
  XCircle,
} from "react-feather";
import { Link, useLocation } from "react-router-dom";
import React, { useContext, useEffect, useMemo, useState } from "react";

import DataTable from "react-data-table-component";
import FilterComponent from "./FilterComponent";
import LoadingContext from "../../../../utility/context/LoadingContext";
import { Tooltip } from "react-tooltip";
import dummyAvatar from "../../../../assets/images/default.jpg";
import moment from "moment";
import toast from "react-hot-toast";

const Table = () => {
  const { state } = useLocation();

  const { setLoading } = useContext(LoadingContext);
  const [teacherList, setTeacherList] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [modal2, setModal2] = useState(false);

  const [Message, setMessage] = useState("");

  const [activeStudentList, setActiveStudentList] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAllStudents, setSelectAllStudents] = useState(false);
  const [idStudent, setIdStudent] = useState("");
  const [pageLoading, setPageLoading] = useState(false);

  const [searchStudent, setSearchStudent] = useState("");

  const toggle2 = (studId) => {
    if (studId) {
      setIdStudent(studId);
    }
    setModal2(!modal2);
  };

  const deleteAllotStud = async () => {
    if (idStudent && state.teacherInfo.userID) {
      setLoading(true);
      const resp = await apiRequest._deleteAllotStudent(
        state.teacherInfo.userID,
        idStudent
      );

      if (resp.status) {
        toast.success(resp.message);
        setModal2(!modal2);
        setLoading(false);
      } else {
        toast.error(resp.message);
        setLoading(false);
      }
    } else {
      toast.error("Something was wrong.");
    }
  };

  useEffect(() => {
    assignedStudensList();
    getPendingStudentsList();
  }, []);

  const getPendingStudentsList = async () => {
    const resp = await apiRequest._getAssignStudents(state.teacherInfo.userID);

    if (resp.status) {
      const teacherSubjects = state?.teacherInfo?.subjects.map(
        (obj) => obj._id
      );

      let filteredStudents = resp.data.filter((student) => {
        return student.subjects.some((subject) =>
          teacherSubjects.includes(subject)
        );
      });

      console.log(teacherSubjects);
      console.log(filteredStudents);

      setActiveStudentList(filteredStudents);
      setFilteredStudents(filteredStudents);
    }
  };

  const removeItem = async (item, type) => {
    if (type == "student") {
      let newValue = selectedStudents.filter(
        (items) => items.userID !== item.userID
      );
      setSelectedStudents(newValue);
    }
  };

  const assignedStudensList = async () => {
    setPageLoading(true);
    const resp = await apiRequest._getUserAssignedStudents(
      state.teacherInfo.userID
    );

    setPageLoading(false);

    if (resp.status) {
      setTeacherList(resp.data);
      setFilterData(resp.data);
    }
  };

  const handleApproveTeacher = async () => {
    let studentId = [];
    selectedStudents.forEach((student) => {
      studentId.push(student.userID);
    });

    if (studentId.length > 0) {
      setLoading(true);
      const payload = {
        students: studentId,
      };

      const resp = await apiRequest._addAllotStudent(
        state.teacherInfo.userID,
        payload
      );

      setLoading(false);

      if (resp.status) {
        toast.success(resp.message);
      } else {
        toast.error(resp.message);
      }
    } else {
      toast.error("Please select atleast one student.");
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

  return (
    <React.Fragment>
      <Row className="mb-2">
        <Col xl="12" md="12">
          <div className="d-flex justify-content-between">
            <h4 className="card-title mb-1  headingcard">Assign Students</h4>
            <Button onClick={toggle} className="tablebtnview" color={"primary"}>
              Add Students
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
            name: "Name",
            minWidth: "250px",
            selector: (row) => row.name,
            sortable: true,
            cell: (row) => (
              <>
                <img
                  className="table_img rounded-circle img-thumbnail me-1"
                  src={
                    row.profileImage
                      ? API_BASE_URL + "/" + row.profileImage
                      : dummyAvatar
                  }
                />
                <span style={{ textTransform: "capitalize" }}>{row.name}</span>
              </>
            ),
          },
          {
            name: "Email",
            minWidth: "170px",
            selector: (row) => row.email,
            sortable: true,
            cell: (row) => row.email,
          },
          {
            name: "Phone No.",
            minWidth: "160px",
            selector: (row) => row.phone.number,
            sortable: true,
            cell: (row) => row.phone.countryCode + " " + row.phone.number,
          },
          {
            name: "Subjects",
            minWidth: "140px",
            selector: (row) => row?.subjects[0]?.name,
            sortable: true,
            cell: (row) => (
              <div className="tooltipWrapper">
                <Tooltip
                  id={row.userID}
                  place="top"
                  style={{
                    backgroundColor: "#797d8c",
                    color: "#fff",
                    fontWeight: 600,
                  }}
                >
                  <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                    {row?.subjects.slice(1).map((item, i) => (
                      <li key={i}>{item.name}</li>
                    ))}
                  </ul>
                </Tooltip>

                {row?.subjects[0]?.name}
                <a
                  style={{
                    lineHeight: "18px",
                    fontSize: 13,
                    whiteSpace: "nowrap",
                    fontWeight: 600,
                    color: "#FF6020",
                  }}
                  data-tooltip-id={row.userID}
                >
                  {[
                    " ",
                    row.subjects?.length > 1 && `+${row.subjects?.length - 1}`,
                  ]}
                </a>
              </div>
            ),
          },
          {
            name: "School",
            minWidth: "140px",
            selector: (row) => row?.school?.name,
            sortable: true,
            cell: (row) => row?.school?.name,
          },
          {
            name: "Grade",
            minWidth: "80px",
            selector: (row) => row?.grade?.name,
            sortable: true,
            cell: (row) => row?.grade?.name,
          },
          {
            name: "State",
            minWidth: "140px",
            selector: (row) => row?.state?.name,
            sortable: true,
            cell: (row) => row?.state?.name,
          },
          {
            name: "Free Lessons",
            minWidth: "140px",
            selector: (row) => row.freeLessons,
            sortable: true,
            cell: (row) => row.freeLessons,
          },
          {
            name: "Group Meetings Left",
            minWidth: "180px",
            selector: (row) => row.groupLessons,
            sortable: true,
            cell: (row) => (
              <>
                {row.groupLessons?.total ? (
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
                        {row.groupLessons.data.map((item) => (
                          <li>{[item.name, " - ", item.lessons]}</li>
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
                      {row.groupLessons?.total}{" "}
                      <Info
                        className="tableicon"
                        style={{ width: 14, height: 14 }}
                      />
                    </a>
                  </>
                ) : (
                  row.groupLessons
                )}
              </>
            ),
          },
          {
            name: "Individual Meetings Left",
            minWidth: "210px",
            selector: (row) => row.individualLessons,
            sortable: true,
            cell: (row) => (
              <>
                {row.individualLessons?.total ? (
                  <>
                    <Tooltip
                      id={row.phone?.number}
                      place="top"
                      style={{
                        backgroundColor: "#797d8c",
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    >
                      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                        {row.individualLessons.data.map((item) => (
                          <li>{[item.name, " - ", item.lessons]}</li>
                        ))}
                      </ul>
                    </Tooltip>

                    <a
                      style={{
                        fontWeight: 600,
                        lineHeight: "18px",
                        fontSize: 13,
                      }}
                      data-tooltip-id={row.phone?.number}
                    >
                      {row.individualLessons?.total}{" "}
                      <Info
                        className="tableicon"
                        style={{ width: 14, height: 14 }}
                      />
                    </a>
                  </>
                ) : (
                  row.individualLessons
                )}
              </>
            ),
          },
          {
            name: "Status",
            minWidth: "100px",
            selector: (row) => row.status,
            sortable: true,
            cell: (row) => (
              <span
                className={
                  row.status == "active" ? "Active badge" : "Inactive badge"
                }
                style={{ textTransform: "capitalize" }}
              >
                {row.status}
              </span>
            ),
          },
          {
            name: "Actions",
            minWidth: "200px",
            cell: (row) => (
              <div className="tableaction">
                <Button
                  onClick={() => toggle2(row.userID)}
                  className="tablebtnview"
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

      <Modal centered isOpen={modal} toggle={toggle} size="lg">
        <ModalBody className="p-2">
          <div className="deleteModal">
            <Row>
              <Col lg={5}>
                <h4 className="status_heading">Assign Student</h4>
                <Input
                  type="text"
                  id="addStudent"
                  name="addStudent"
                  placeholder="Enter Add Students"
                  onChange={(e) => {
                    setSearchStudent(e.target.value);
                    const filteredArray = activeStudentList.filter((item) => {
                      return item.name
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase());
                    });
                    console.log("ppp", filteredArray);
                    setFilteredStudents(
                      e.target.value.length > 0
                        ? filteredArray
                        : activeStudentList
                    );
                  }}
                />
                <ul className="studentList ps-0 mt-2">
                  {filteredStudents.length > 0 &&
                    filteredStudents.map((item, index) => {
                      return (
                        <li key={index}>
                          <span>
                            <img
                              src={
                                item?.profileImage
                                  ? `${API_BASE_URL}/${item.profileImage}`
                                  : dummyAvatar
                              }
                              alt={item.name}
                            />
                            {item.name}
                          </span>
                          {selectedStudents.includes(item) ? (
                            <button style={{ background: "#699e00" }}>
                              Added
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedStudents([
                                  ...selectedStudents,
                                  item,
                                ]);
                                setSelectAllStudents(false);
                              }}
                            >
                              Add
                            </button>
                          )}
                        </li>
                      );
                    })}

                  {filteredStudents.length < 1 && (
                    <>
                      <h5>opps student not found</h5>
                    </>
                  )}
                </ul>
              </Col>

              <Col lg={7}>
                {selectedStudents.length > 0 && (
                  <h4 className="status_heading">Selected Students</h4>
                )}
                <ul className="tagsFlex mt-2">
                  {selectedStudents &&
                    selectedStudents.map((item, index) => {
                      return (
                        <li>
                          <img
                            src={
                              item?.profileImage
                                ? `${API_BASE_URL}/${item.profileImage}`
                                : dummyAvatar
                            }
                            className="imgUser"
                            alt=""
                          />
                          <p>{item.name}</p>
                          <XCircle
                            fontSize={18}
                            onClick={() => removeItem(item, "student")}
                          />
                        </li>
                      );
                    })}
                </ul>
              </Col>
            </Row>

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
        <ModalBody className="p-3">
          <div className="deleteModal text-center">
            <XCircle className="deletemodal_icon" />
            <h2>Are You Sure ?</h2>
            <p>You will not be able to recover the deleted record!</p>
            <div className="btn-cancel-ok">
              <Button className="btn-cancel me-1" onClick={toggle2}>
                Cancel
              </Button>
              <Button className="btn-ok" onClick={deleteAllotStud}>
                OK
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
      {/* <Modal centered isOpen={modal2} toggle={toggle2}>
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
      </Modal> */}
    </React.Fragment>
  );
};

export default Table;
