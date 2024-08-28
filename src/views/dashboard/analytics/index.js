import {
  Button,
  Col,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  Row,
  Table,
} from "reactstrap";
import { CheckCircle, Eye, UserCheck, Users, XCircle } from "react-feather";
import React, { useContext, useEffect, useState } from "react";

import { Link } from "react-router-dom";
import LoadingContext from "../../../utility/context/LoadingContext";
import { Tooltip } from "react-tooltip";
import { apiRequest } from "../../../utility/apiRequest";
import moment from "moment";
import toast from "react-hot-toast";

const AnalyticsDashboard = () => {
  const { setLoading } = useContext(LoadingContext);
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [modal2, setModal2] = useState(false);
  const toggle2 = () => setModal2(!modal2);
  const [Message, setMessage] = useState("");

  const [selectedTeacher, setSelectedTeacher] = useState({});
  const [selectedUser, setSelectUser] = useState("");
  const [studentRequestList, setStudentRequestList] = useState([]);
  const [teacherRequestList, setTeacherRequestList] = useState([]);
  const [studentApprovedList, setStudentApprovedList] = useState([]);
  const [teacherApprovedList, setTeacherApprovedList] = useState([]);

  useEffect(() => {
    getInitialData();
  }, []);

  const getInitialData = async () => {
    await Promise.all([
      getStudentRequest(),
      getTeacherRequest(),
      getStudentApproved(),
      getTeacherApproved(),
    ]);
  };

  const getStudentRequest = async () => {
    const payload = {
      role: "student",
      type: "pending-approval",
    };
    const resp = await apiRequest._getUserList(payload);
    if (resp.status) {
      setStudentRequestList(resp.data);
    }
  };

  const getTeacherRequest = async () => {
    const payload = {
      role: "teacher",
      type: "pending-approval",
    };
    const resp = await apiRequest._getUserList(payload);
    if (resp.status) {
      setTeacherRequestList(resp.data);
    }
  };

  const getStudentApproved = async () => {
    const payload = {
      role: "student",
      type: "approved",
    };
    const resp = await apiRequest._getUserList(payload);
    if (resp.status) {
      setStudentApprovedList(resp.data);
    } else {
      setStudentApprovedList([]);
    }
  };
  const getTeacherApproved = async () => {
    const payload = {
      role: "teacher",
      type: "approved",
    };
    const resp = await apiRequest._getUserList(payload);
    if (resp.status) {
      setTeacherApprovedList(resp.data);
    } else {
      setTeacherApprovedList();
    }
  };

  const handleApprove = async () => {
    setModal(false);
    setLoading(true);

    const payload = {
      userID: selectedTeacher.userID,
      role: selectedTeacher.role,
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
      userID: selectedUser,
      reason: Message,
    };

    // console.log(payload);
    // return;

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
    <div id="dashboard-analytics">
      <Row className="match-height">
        <Col lg="3" sm="6">
          <div className="card br-10 stats-box">
            <Link to="/pages/Studentpending">
              <div className="card-body px-1 py-2">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0 avatar avatar-stats wh-60 mx-auto bg-light-primary d-flex justify-content-center align-items-center ">
                    <div className="avatar-content ">
                      <Users className="stats_icon" />
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-1">
                    <h3>{studentRequestList?.length}</h3>
                    <p className="card-text">Student Requests</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </Col>
        <Col lg="3" sm="6">
          <div className="card br-10 stats-box">
            <Link to="/pages/teacherpending">
              <div className="card-body px-1 py-2">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0 avatar avatar-stats wh-60 mx-auto bg-light-info d-flex justify-content-center align-items-center">
                    <div className="avatar-content ">
                      <Users className="stats_icon" />
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-1">
                    <h3>{teacherRequestList?.length}</h3>
                    <p className="card-text">Teacher Requests</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </Col>
        <Col lg="3" sm="6">
          <div className="card br-10 stats-box">
            <Link to="/pages/studentapproved">
              <div className="card-body px-1 py-2">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0 avatar avatar-stats wh-60 mx-auto bg-light-danger d-flex justify-content-center align-items-center">
                    <div className="avatar-content ">
                      <UserCheck className="stats_icon" />
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-1">
                    <h3>{studentApprovedList?.length}</h3>
                    <p className="card-text">Approved Students</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </Col>
        <Col lg="3" sm="6">
          <div className="card br-10 stats-box">
            <Link to="/pages/teacherapproved">
              <div className="card-body px-1 py-2">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0 avatar avatar-stats wh-60 mx-auto bg-light-info d-flex justify-content-center align-items-center">
                    <div className="avatar-content ">
                      <UserCheck className="stats_icon" />
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-1">
                    <h3>{teacherApprovedList?.length}</h3>
                    <p className="card-text">Approved Teachers</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs="12">
          <div className="card">
            <div className="card-body">
              <Row>
                <Col xl="6" md="6">
                  <h4 className="card-title mb-1 headingcard">
                    Recent Student Requests
                  </h4>
                </Col>
              </Row>
              <div className="table-responsive">
                <Table className="react-dataTable paddingbox tablestatic">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone No.</th>
                      <th>Subjects</th>
                      <th>School</th>
                      <th>Class</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentRequestList.map((item, i) => (
                      <tr key={i}>
                        <td>
                          {[item.studentFirstName, " ", item.studentLastName]}
                        </td>
                        <td>{item.email}</td>
                        <td>
                          {[item?.phone?.countryCode, " ", item?.phone?.number]}
                        </td>
                        <td>
                          <div className="tooltipWrapper">
                            <Tooltip
                              id={item.email}
                              place="top"
                              style={{
                                backgroundColor: "#797d8c",
                                color: "#fff",
                                fontWeight: 600,
                              }}
                            >
                              <ul
                                style={{
                                  margin: 0,
                                  padding: 0,
                                  listStyle: "none",
                                }}
                              >
                                {item.subjects.slice(1).map((item) => (
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
                              data-tooltip-id={item.email}
                            >
                              {[
                                item.subjects[0].name,
                                " ",
                                item.subjects.length > 1 &&
                                  "+" + item.subjects.length - 1 + " more",
                              ]}
                            </a>
                          </div>
                        </td>
                        <td>{item?.school?.name}</td>
                        <td>{item?.grade?.name}</td>
                        <td className="tableaction">
                          <div className="d-flex justify-content-end">
                            <Button
                              className="tablebtnview"
                              tag={Link}
                              to="/pages/viewpendingstudent"
                              state={{ studentInfo: item }}
                            >
                              <Eye className="tableicon" />
                            </Button>
                            <Button
                              className="tablebtnedit"
                              onClick={() => {
                                setSelectedTeacher({
                                  userID: item.userID,
                                  role: "student",
                                });
                                setModal(true);
                              }}
                            >
                              <CheckCircle className="tableicon" />
                            </Button>
                            <Button
                              className="tablebtndelete me-0"
                              onClick={() => {
                                setSelectUser(item.userID);
                                setModal2(true);
                              }}
                            >
                              <XCircle className="tableicon" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {studentRequestList?.length < 1 && (
                      <tr>
                        <td colSpan={7} className="text-center">
                          There are no records to display
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <Row>
                <Col xl="6" md="6">
                  <h4 className="card-title mb-1 headingcard">
                    Recent Teacher Requests
                  </h4>
                </Col>
              </Row>
              <div className="table-responsive">
                <Table className="react-dataTable paddingbox tablestatic">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone No.</th>
                      <th>Gender</th>
                      <th>DOB</th>
                      <th>Subjects</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teacherRequestList.map((item, i) => (
                      <tr key={i}>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td>
                          {[item?.phone?.countryCode, " ", item?.phone?.number]}
                        </td>
                        <td>
                          {item.gender == "prefer-not-to-tell"
                            ? "Not Preferred"
                            : item.gender}
                        </td>
                        <td>{moment(item.dob).format("DD MMM yyyy")}</td>
                        <td>
                          <div className="tooltipWrapper">
                            <Tooltip
                              id={item.email}
                              place="top"
                              style={{
                                backgroundColor: "#797d8c",
                                color: "#fff",
                                fontWeight: 600,
                              }}
                            >
                              <ul
                                style={{
                                  margin: 0,
                                  padding: 0,
                                  listStyle: "none",
                                }}
                              >
                                {item.subjects.slice(1).map((item) => (
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
                              data-tooltip-id={item.email}
                            >
                              {[
                                item.subjects[0].name,
                                " ",
                                item.subjects.length > 1 &&
                                  "+" + item.subjects.length - 1 + " more",
                              ]}
                            </a>
                          </div>
                        </td>
                        <td className="tableaction">
                          <div className="d-flex justify-content-end">
                            <Button
                              className="tablebtnview"
                              tag={Link}
                              to="/pages/viewpendingteacher"
                              state={{ teacherInfo: item }}
                            >
                              <Eye className="tableicon" />
                            </Button>
                            <Button
                              className="tablebtnedit"
                              onClick={() => {
                                setSelectedTeacher({
                                  userID: item.userID,
                                  role: "teacher",
                                });
                                setModal(true);
                              }}
                            >
                              <CheckCircle className="tableicon" />
                            </Button>
                            <Button
                              className="tablebtndelete me-0"
                              onClick={() => {
                                setSelectUser(item.userID);
                                setModal2(true);
                              }}
                            >
                              <XCircle className="tableicon" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {teacherRequestList?.length < 1 && (
                      <tr>
                        <td colSpan={7} className="text-center">
                          There are no records to display
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </Col>
      </Row>

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
              <Button className="btn-ok" onClick={handleApprove}>
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
    </div>
  );
};

export default AnalyticsDashboard;
