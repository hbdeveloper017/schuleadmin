import "@styles/react/pages/page-authentication.scss";

import { API_BASE_URL, apiRequest } from "../../../utility/apiRequest";
import {
  Button,
  Col,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import React, { useContext, useEffect, useState } from "react";

import LoadingContext from "../../../utility/context/LoadingContext";
import MyNotifications from "./mynotification";
import SentNotifications from "./sentnotification";
import UserStatus from "../../../utility/userStatusSocket";
import { XCircle } from "react-feather";
import classnames from "classnames";
import dummyAvatar from "../../../assets/images/default.jpg";
import toast from "react-hot-toast";

const Notifications = () => {
  const [currentActiveTab, setCurrentActiveTab] = useState("1");
  const { setLoading } = useContext(LoadingContext);
  const toggle = (tab) => {
    if (currentActiveTab !== tab) setCurrentActiveTab(tab);
  };

  const [modal, setModal] = useState(false);
  const toggle1 = () => setModal(!modal);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState("");
  const [announcement, setAnnouncement] = useState("");

  const [isSubmit, setIsSubmit] = useState(false);
  // ------------------ Teachers ------------------
  const [activeTeacherList, setActiveTeacherList] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [selectAllTeachers, setSelectAllTeachers] = useState(false);
  const [searchTeacher, setSearchTeacher] = useState("");

  // ------------------ Students ------------------
  const [activeStudentList, setActiveStudentList] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAllStudents, setSelectAllStudents] = useState(false);
  const [searchStudent, setSearchStudent] = useState("");
  const [adminData, setAdminData] = useState({});

  useEffect(() => {
    getActiveUsers();
  }, []);

  const getActiveUsers = async () => {
    const resp = await apiRequest._getActiveUsers();

    if (resp.status) {
      setActiveStudentList(resp.data.students);
      setActiveTeacherList(resp.data.teachers);
    }

    let user = localStorage.getItem("userData");
    let userDetails = JSON.parse(user);
    UserStatus.initializeSocket(userDetails?.id);
  };

  const removeItem = async (item, type) => {
    // let oldVal = [...selectedStudents];
    if (type == "student") {
      let newValue = selectedStudents.filter(
        (items) => items.userID !== item.userID
      );
      setSelectedStudents(newValue);
    } else {
      let newValue = selectedTeachers.filter(
        (items) => items.userID !== item.userID
      );
      setSelectedTeachers(newValue);
    }
  };

  const Submit = async () => {
    if (title && announcement) {
      let recipientType = "";
      let recipientIDs = [];

      if (selectAllStudents && selectAllTeachers) {
        recipientType = "All";
        activeStudentList.forEach((student) =>
          recipientIDs.push(student.userID)
        );
        activeTeacherList.forEach((teacher) =>
          recipientIDs.push(teacher.userID)
        );
      } else if (selectAllStudents) {
        recipientType = "All Student";
        activeStudentList.forEach((student) =>
          recipientIDs.push(student.userID)
        );
        selectedTeachers.forEach((teacher) =>
          recipientIDs.push(teacher.userID)
        );
      } else if (selectAllTeachers) {
        recipientType = "All Teacher";
        activeTeacherList.forEach((teacher) =>
          recipientIDs.push(teacher.userID)
        );
        selectedStudents.forEach((student) =>
          recipientIDs.push(student.userID)
        );
      } else {
        selectedStudents.forEach((student) =>
          recipientIDs.push(student.userID)
        );
        selectedTeachers.forEach((teacher) =>
          recipientIDs.push(teacher.userID)
        );
      }

      if (recipientIDs.length === 0) {
        toast.error("Please select at least one student or one teacher.");
        setIsSubmit(true);
        return;
      }

      console.log(recipientType, "recipientType", recipientIDs, "recipientIDs");
      // return;
      setIsSubmit(true);
      setLoading(true);

      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", title.trim());
      formData.append("content", announcement.trim());
      recipientType !== "" && formData.append("recipientType", recipientType);
      recipientIDs.forEach((element) => {
        formData.append("recipientID[]", element);
      });

      const resp = await apiRequest._addNotification(formData);

      setIsSubmit(false);
      setLoading(false);

      if (resp.status) {
        toast.success(resp.message);

        UserStatus.emit("send_notification", recipientIDs);
      } else {
        toast.error(resp.message);
      }
    }
  };
  return (
    <React.Fragment>
      <Row className="mb-2">
        <Col xl="6" md="6">
          <h4 className="card-title mb-1 headingcard">All Notifications</h4>
        </Col>
        <Col xl="6" md="6" className="text-end">
          <Button onClick={toggle1} className="btn-add">
            Send New Notification
          </Button>
        </Col>
      </Row>

      <SentNotifications />

      <Modal
        backdrop="static"
        centered
        isOpen={modal}
        toggle={toggle}
        size={"lg"}
      >
        <ModalBody className="p-2">
          <div className="deleteModal">
            <h2>Send New Notification</h2>
            <p style={{ marginBottom: 10 }}>
              Send a new notification to selected participants
            </p>

            <Row>
              <div className="col-md-8">
                <FormGroup className="form-group">
                  <Label className="form-label" for="title">
                    Title
                  </Label>
                  <Input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Title"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  {isSubmit && !title && (
                    <span style={{ color: "red" }}>Title is required.</span>
                  )}
                </FormGroup>
              </div>
              <div className="col-md-4">
                <FormGroup className="form-group">
                  <Label className="form-label" for="title">
                    Image
                  </Label>
                  <Input
                    type="file"
                    id="file"
                    name="file"
                    placeholder="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  {isSubmit && !title && (
                    <span style={{ color: "red" }}>Title is required.</span>
                  )}
                </FormGroup>
              </div>
            </Row>

            <FormGroup className="form-group">
              <Label className="form-label" for="Message">
                Announcement
              </Label>
              <Input
                type="textarea"
                id="Message"
                name="Message"
                rows="4"
                placeholder="Type Here..."
                onChange={(e) => setAnnouncement(e.target.value)}
              />
              {isSubmit && !announcement && (
                <span style={{ color: "red" }}>Announcement is required.</span>
              )}
            </FormGroup>
            {/* --------------------------------------STUDENTS-------------------------------- */}
            <FormGroup className="form-group">
              <Row>
                <Col md={4} className="my-auto">
                  <Button
                    className="btn-cancel me-1 w-100"
                    onClick={() => {
                      setSelectAllStudents(!selectAllStudents);
                      setFilteredStudents([]);
                      setSelectedStudents([]);
                    }}
                  >
                    {selectAllStudents
                      ? "Remove To All Students"
                      : "Send To All Students"}
                  </Button>
                </Col>

                <Col md={8}>
                  {
                    <Input
                      type="text"
                      id="addStudent"
                      name="addStudent"
                      placeholder="Enter Add Students"
                      onChange={(e) => {
                        setSearchStudent(e.target.value);
                        const filteredArray = activeStudentList.filter(
                          (item) => {
                            return item.name
                              .toLowerCase()
                              .includes(e.target.value.toLowerCase());
                          }
                        );
                        setFilteredStudents(
                          e.target.value.length > 0 ? filteredArray : []
                        );
                      }}
                    />
                  }
                </Col>
              </Row>
            </FormGroup>
            <ul className="tagsFlex">
              {searchStudent.length == 0 &&
                !selectAllStudents &&
                selectedStudents &&
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
            <ul className="studentList">
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
                        <button style={{ background: "#699e00" }}>Added</button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedStudents([...selectedStudents, item]);
                            setSelectAllStudents(false);
                          }}
                        >
                          Add
                        </button>
                      )}
                    </li>
                  );
                })}
            </ul>
            {/* --------------------------------------TEACHERS-------------------------------- */}
            <FormGroup className="form-group">
              <Row>
                <Col md={4} className="my-auto">
                  <Button
                    className="btn-cancel me-1 w-100"
                    onClick={() => {
                      setSelectAllTeachers(!selectAllTeachers);
                      setFilteredTeachers([]);
                      setSelectedTeachers([]);
                    }}
                  >
                    {selectAllTeachers
                      ? "Remove To All Teachers"
                      : "Send To All Teachers"}
                  </Button>
                </Col>

                <Col md={8}>
                  {
                    <Input
                      type="text"
                      id="addTeachers"
                      name="addTeachers"
                      placeholder="Enter Add Teachers"
                      onChange={(e) => {
                        setSearchTeacher(e.target.value);
                        const filteredArray = activeTeacherList.filter(
                          (item) => {
                            return item.name
                              .toLowerCase()
                              .includes(e.target.value.toLowerCase());
                          }
                        );
                        setFilteredTeachers(
                          e.target.value.length > 0 ? filteredArray : []
                        );
                      }}
                    />
                  }
                </Col>
              </Row>
            </FormGroup>
            {[...selectedStudents, ...selectedTeachers]?.length == 0 &&
              isSubmit && (
                <span style={{ color: "red" }}>
                  Please select at least one student or one teacher.
                </span>
              )}
            <ul className="tagsFlex">
              {searchTeacher.length == 0 &&
                !selectAllTeachers &&
                selectedTeachers &&
                selectedTeachers.map((item, index) => {
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
                        onClick={() => removeItem(item, "teacher")}
                      />
                    </li>
                  );
                })}
            </ul>
            <ul className="studentList">
              {filteredTeachers.length > 0 &&
                filteredTeachers.map((item, index) => {
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
                      {selectedTeachers.includes(item) ? (
                        <button style={{ background: "#699e00" }}>Added</button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedTeachers([...selectedTeachers, item]);
                            setSelectAllTeachers(false);
                          }}
                        >
                          Add
                        </button>
                      )}
                    </li>
                  );
                })}
            </ul>

            <div className="btn-cancel-ok text-center">
              <Button className="btn-cancel me-1" onClick={toggle1}>
                Cancel
              </Button>
              <Button className="btn-ok" onClick={Submit}>
                OK
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};
export default Notifications;
