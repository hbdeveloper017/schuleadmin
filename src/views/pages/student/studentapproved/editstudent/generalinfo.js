import "@styles/react/pages/page-authentication.scss";

import { API_BASE_URL, apiRequest } from "../../../../../utility/apiRequest";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  Row,
} from "reactstrap";
import React, { useContext, useEffect, useRef, useState } from "react";

import Avatar from "@components/avatar";
import AvatarEditor from "react-avatar-editor";
import { Edit } from "react-feather";
import LoadingContext from "../../../../../utility/context/LoadingContext";
import Select from "react-select";
import defaultImg from "../../../../../assets/images/default.jpg";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Generalinfo = ({ studentInfo }) => {
  const navigate = useNavigate();
  const avatarRef = useRef(null);
  const { setLoading } = useContext(LoadingContext);
  const [stateList, setStateList] = useState([]);
  const [schoolList, setSchoolList] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [filteredGrades, setFilteredGrades] = useState([]);
  const [passwordModal, setPasswordModal] = useState(false);
  const [oldSubjects, setOldSubjects] = useState(studentInfo?.subjects);
  const [subjectAlert, setSubjectAlert] = useState(false);
  const [avatarEditModal, setAvatarModal] = useState(false);
  const [avatarOptions, setAvatarOptions] = useState({
    scale: 1.2,
    rotate: 0,
  });
  const [userPassword, setUserPassword] = useState({
    password: "",
    confirmPassword: "",
  });

  const [userInfo, setUserInfo] = useState({
    address: studentInfo.address,
    city: studentInfo.city,
    email: studentInfo.email,
    studentFirstName: studentInfo.studentFirstName,
    studentLastName: studentInfo.studentLastName,
    zipCode: studentInfo.zipCode,
    parentFirstName: studentInfo.parentFirstName,
    parentLastName: studentInfo.parentLastName,
    registerAs: studentInfo.registerAs,
    profileImage: studentInfo.profileImage,
    showProfile: studentInfo.profileImage
      ? `${API_BASE_URL}/${studentInfo.profileImage}`
      : defaultImg,
    countryCode: studentInfo.phone.countryCode,
    phone: studentInfo.phone.number,
    state: studentInfo.state,
    school: studentInfo.school,
    grade: studentInfo.grade,
    subjects: {},
    status: studentInfo.status,
    password: "",
    confirmpassword: "",
  });

  useEffect(() => {
    getStateList();
    getSchoolList();
    getGradeList();
    getSubjectList();
  }, []);

  const getSubjectList = async () => {
    const resp = await apiRequest._getSubjects();
    if (resp.status) {
      let data = await resp.data.map((item) => {
        return {
          value: item._id,
          label: item.name,
        };
      });

      const filteredInput = await data.filter((item) =>
        studentInfo.subjects.some((subject) => subject._id === item.value)
      );

      setUserInfo({ ...userInfo, subjects: filteredInput });
      setSubjectList(data);
    }
  };

  const getGradeList = async () => {
    const resp = await apiRequest._getGrades();

    if (resp.status) {
      const filteredData = resp.data.filter((item) =>
        item.schools.some(
          (school) => school.schoolID === studentInfo.school._id
        )
      );

      setFilteredGrades(filteredData);
      setGradeList(resp.data);
    }
  };

  const getSchoolList = async () => {
    const resp = await apiRequest._getSchool();
    if (resp.status) {
      setSchoolList(resp.data);
    }
  };

  const getStateList = async () => {
    const resp = await apiRequest._getStateList();

    if (resp.status) {
      setStateList(resp.data);
    }
  };

  const checkSubjectChanges = async (e) => {
    e.preventDefault();

    if (userInfo.address == "") {
      toast.error("Address is required.");
      return false;
    }
    if (userInfo.city == "") {
      toast.error("City is required.");
      return false;
    }
    if (userInfo.studentFirstName == "") {
      toast.error("Student firstname is required.");
      return false;
    }
    if (userInfo.studentLastName == "") {
      toast.error("Student lastname is required.");
      return false;
    }
    if (userInfo.email == "") {
      toast.error("Email is required.");
      return false;
    }
    if (userInfo.zipCode == "") {
      toast.error("Zipcode is required.");
      return false;
    }
    if (userInfo.phone == "") {
      toast.error("Number if required.");
      return false;
    }
    if (userInfo?.state == undefined || userInfo?.state?._id == "") {
      toast.error("State is required.");
      return false;
    }
    if (userInfo.school == "") {
      toast.error("School is required.");
      return false;
    }
    if (userInfo.grade == "") {
      toast.error("Grade is required.");
      return false;
    }
    if (userInfo.subjects == "") {
      toast.error("Subject is required.");
      return false;
    }

    const checkSubject = () => {
      if (oldSubjects.length !== userInfo?.subjects.length) {
        return false;
      }

      for (let i = 0; i < oldSubjects.length; i++) {
        const oldItem = oldSubjects[i];
        const newItem = userInfo?.subjects.find(
          (item) => item._id === oldItem.value
        );

        if (!newItem || newItem.name !== oldItem.label) {
          return false;
        }
      }

      return true;
    };

    const isSameSubject = checkSubject();
    console.log(isSameSubject);

    if (isSameSubject == true) {
      handleUpdate();
    } else {
      console.log(isSameSubject, "isSameSubject");
      setSubjectAlert(true);
    }
  };

  const handleUpdate = async (e) => {
    setLoading(true);

    const formdata = new FormData();
    formdata.append("email", userInfo.email);
    formdata.append("phone[countryCode]", userInfo.countryCode);
    formdata.append("phone[number]", userInfo.phone);
    formdata.append("studentFirstName", userInfo.studentFirstName);
    formdata.append("studentLastName", userInfo.studentLastName);
    formdata.append("address", userInfo.address);
    formdata.append("city", userInfo.city);
    formdata.append("zipCode", userInfo.zipCode);
    formdata.append("state", userInfo.state?._id);
    formdata.append("profileImage", userInfo.profileImage);
    formdata.append("status", userInfo.status);
    formdata.append("school", userInfo.school._id);
    formdata.append("grade", userInfo.grade._id);
    userInfo.subjects.forEach((element, index) => {
      formdata.append(`subjects[${index}]`, element.value);
    });

    if (userInfo.registerAs == "parent") {
      formdata.append("parentFirstName", userInfo.parentFirstName);
      formdata.append("parentLastName", userInfo.parentLastName);
    }

    const resp = await apiRequest._updateProfile(
      studentInfo.userID,
      "student",
      formdata
    );
    console.log(resp);
    setLoading(false);

    if (resp.status) {
      toast.success(resp.message);
      navigate(-1);
    } else {
      toast.error(resp.message);
    }
  };

  const handlePasswordUpdate = async () => {
    if (
      userPassword.password.length < 7 ||
      userPassword.confirmPassword.length < 7
    ) {
      toast.error("Password must be 8 characters.");
      return false;
    }

    if (userPassword.password !== userPassword.confirmPassword) {
      toast.error("Password must be same.");
      return false;
    }

    setLoading(true);

    const resp = await apiRequest._changeUserPassword(
      studentInfo.userID,
      "student",
      userPassword
    );

    setLoading(false);

    if (resp.status) {
      setPasswordModal(false);
      toast.success(resp.message);
    } else {
      toast.error(resp.message);
    }
  };

  return (
    <React.Fragment>
      <Row>
        <Col sm="4">
          <div className="user-avatar-section d-flex flex-column align-items-center justify-content-center">
            <div className="d-flex flex-column mb-1 align-items-center justify-content-center">
              <Avatar
                className="useravatar1"
                img={userInfo.showProfile ? userInfo.showProfile : defaultImg}
              />
            </div>
            <Button.Ripple
              id="change-img"
              tag={Label}
              outline
              className="mb-0"
              color="primary"
            >
              <span className="d-none d-sm-block">Change Picture</span>
              <span className="d-block d-sm-none">
                <Edit size={14} />
              </span>
              <input
                type="file"
                hidden
                id="change-img"
                accept="image/*"
                onChange={(event) => {
                  console.log(event.target.files);
                  if (event.target.files.length > 0) {
                    // setFieldValue(
                    //   "showProfile",
                    //   URL.createObjectURL(event?.target?.files[0])
                    // );

                    setUserInfo({
                      ...userInfo,
                      showProfile: URL.createObjectURL(event?.target?.files[0]),
                    });

                    setAvatarModal(true);
                    console.log(avatarEditModal);
                  }
                }}
                // onChange={(e) =>
                //   setUserInfo({
                //     ...userInfo,
                //     profileImage: e.target.files[0],
                //     showProfile: URL.createObjectURL(e.target.files[0]),
                //   })
                // }
              />
            </Button.Ripple>
          </div>

          <Modal
            show={avatarEditModal}
            onHide={() => setAvatarModal(false)}
            size="md"
            className="modalSuccess"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Body className="pb-2">
              <h4 className="mt-0 mb-3">Edit your profile picture</h4>
              <Row>
                <Col md={6}>
                  <div className="avatarEditWrapper">
                    <AvatarEditor
                      ref={avatarRef}
                      image={userInfo.showProfile}
                      width={160}
                      height={180}
                      border={4}
                      color={[255, 95, 32, 0.5]}
                      scale={avatarOptions.scale}
                      rotate={0}
                      borderRadius={10}
                    />
                  </div>
                </Col>
                <Col
                  md={6}
                  className="d-flex justify-content-between flex-column"
                >
                  <div className="">
                    <Form.Label htmlFor="basic-url">Zoom</Form.Label>
                    <Form.Range
                      value={avatarOptions.scale}
                      min={1}
                      max={10}
                      step={0.1}
                      onChange={(evt) => {
                        setAvatarOptions({
                          ...avatarOptions,
                          scale: evt.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <Button
                      className="px-4"
                      onClick={async () => {
                        const canvas = avatarRef.current.getImage();
                        canvas.toBlob((blob) => {
                          console.log(blob, "blocb");
                          setFieldValue("profileImage", blob);

                          setFieldValue(
                            "showProfile",
                            URL.createObjectURL(blob)
                          );
                          setAvatarModal(false);
                        });
                      }}
                    >
                      Save Photo
                    </Button>
                    <Button
                      className="px-4"
                      onClick={() => {
                        setAvatarModal(false);
                        setFieldValue("showProfile", profileImage);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </Col>
              </Row>
            </Modal.Body>
          </Modal>
        </Col>
        <Col sm="8">
          <div className="card">
            <div className="card-body">
              <Form onSubmit={checkSubjectChanges}>
                <Row>
                  <Col md="6" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label" htmlFor="fname">
                        Student's First Name
                      </Label>
                      <Input
                        type="text"
                        id="fname"
                        name="fname"
                        value={userInfo.studentFirstName}
                        onChange={(e) =>
                          setUserInfo({
                            ...userInfo,
                            studentFirstName: e.target.value,
                          })
                        }
                        placeholder="First Name"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label" htmlFor="lname">
                        Student's Last Name
                      </Label>
                      <Input
                        type="text"
                        id="lname"
                        name="lname"
                        value={userInfo.studentLastName}
                        onChange={(e) =>
                          setUserInfo({
                            ...userInfo,
                            studentLastName: e.target.value,
                          })
                        }
                        placeholder="Last Name"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label" htmlFor="email">
                        Email
                      </Label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={userInfo.email}
                        onChange={(e) =>
                          setUserInfo({
                            ...userInfo,
                            email: e.target.value,
                          })
                        }
                        placeholder="Email"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label" htmlFor="phone">
                        Phone No.
                      </Label>
                      <Input
                        type="text"
                        id="phone"
                        value={userInfo?.phone}
                        onChange={(e) =>
                          setUserInfo({
                            ...userInfo,
                            phone: e.target.value,
                          })
                        }
                        placeholder="Phone No."
                      />
                    </FormGroup>
                  </Col>
                  {userInfo.registerAs == "parent" && (
                    <>
                      <Col md="6" sm="12">
                        <FormGroup className="form-group">
                          <Label
                            className="form-label"
                            htmlFor="childfirstname"
                          >
                            Parent's First Name
                          </Label>
                          <Input
                            type="text"
                            id="childfirstname"
                            name="childfirstname"
                            value={userInfo.parentFirstName}
                            onChange={(e) =>
                              setUserInfo({
                                ...userInfo,
                                parentFirstName: e.target.value,
                              })
                            }
                            placeholder="Parent's First Name"
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6" sm="12">
                        <FormGroup className="form-group">
                          <Label className="form-label" htmlFor="childlastname">
                            Parent's Last Name
                          </Label>
                          <Input
                            type="text"
                            id="childlastname"
                            name="childlastname"
                            value={userInfo.parentLastName}
                            onChange={(e) =>
                              setUserInfo({
                                ...userInfo,
                                parentLastName: e.target.value,
                              })
                            }
                            placeholder="Parent's Last Name"
                          />
                        </FormGroup>
                      </Col>
                    </>
                  )}
                  <Col md="6" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label" htmlFor="Street">
                        Street
                      </Label>
                      <Input
                        type="text"
                        id="Street"
                        name="Street"
                        value={userInfo.address}
                        onChange={(e) =>
                          setUserInfo({
                            ...userInfo,
                            address: e.target.value,
                          })
                        }
                        placeholder="Street"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label" htmlFor="ZipCode">
                        Zip Code
                      </Label>
                      <Input
                        type="number"
                        id="ZipCode"
                        name="ZipCode"
                        value={userInfo.zipCode}
                        onChange={(e) =>
                          setUserInfo({
                            ...userInfo,
                            zipCode: e.target.value,
                          })
                        }
                        placeholder="Zip Code"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label" htmlFor="City">
                        City
                      </Label>
                      <Input
                        type="text"
                        id="City"
                        name="City"
                        value={userInfo.city}
                        onChange={(e) =>
                          setUserInfo({
                            ...userInfo,
                            city: e.target.value,
                          })
                        }
                        placeholder="City"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label" for="State">
                        State
                      </Label>
                      <Input
                        type="select"
                        name="State"
                        id="State"
                        value={userInfo?.state?._id}
                        onChange={(e) => {
                          setUserInfo({
                            ...userInfo,
                            state: { ...userInfo.state, _id: e.target.value },
                          });
                        }}
                      >
                        <option value={""}>Select State</option>
                        {stateList.map((item) => (
                          <option value={item._id}>{item.name}</option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md="12" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label" htmlFor="Subjects">
                        Subjects
                      </Label>
                      <Select
                        isMulti
                        options={subjectList}
                        value={userInfo?.subjects}
                        onChange={(item) =>
                          setUserInfo({
                            ...userInfo,
                            subjects: item,
                          })
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
                              <span>{props.data.label}</span>
                            </div>
                          ),
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label" htmlFor="School">
                        School
                      </Label>
                      <Input
                        type="select"
                        name="school"
                        id="school"
                        value={userInfo?.school?._id}
                        onChange={(e) => {
                          setUserInfo({
                            ...userInfo,
                            school: { ...userInfo.school, _id: e.target.value },
                          });

                          const filteredData = gradeList.filter((item) =>
                            item.schools.some(
                              (school) => school.schoolID === e.target.value
                            )
                          );

                          setFilteredGrades(filteredData);
                        }}
                      >
                        {schoolList.map((item) => (
                          <option value={item._id}>{item.name}</option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>

                  <Col md="6" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label" htmlFor="Grade">
                        Grade
                      </Label>

                      <Input
                        type="select"
                        name="grade"
                        id="grade"
                        value={userInfo?.grade?._id}
                        onChange={(e) =>
                          setUserInfo({
                            ...userInfo,
                            grade: { ...userInfo.grade, _id: e.target.value },
                          })
                        }
                      >
                        {filteredGrades.map((item) => (
                          <option value={item._id}>{item.name}</option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md="6" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label" htmlFor="phone">
                        Status
                      </Label>
                      <Input
                        type="select"
                        name="status"
                        id="status"
                        value={userInfo.status}
                        onChange={(e) =>
                          setUserInfo({
                            ...userInfo,
                            status: e.target.value,
                          })
                        }
                      >
                        <option value="select">Select Status</option>
                        <option value="active">Active</option>
                        <option value="blocked">Inactive</option>
                      </Input>
                    </FormGroup>
                  </Col>

                  <Col className="d-flex flex-sm-row flex-column mt-2 " sm="12">
                    <Button.Ripple
                      className="minwidth133 btnprimary"
                      type="submit"
                      color="primary"
                    >
                      Update
                    </Button.Ripple>

                    <Button.Ripple
                      className="minwidth133 btnprimary ms-2"
                      type="button"
                      color="primary"
                      onClick={() => setPasswordModal(true)}
                    >
                      Change Password
                    </Button.Ripple>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </Col>
      </Row>

      <Modal
        centered
        isOpen={passwordModal}
        toggle={() => setPasswordModal(false)}
      >
        <ModalBody className="p-2">
          <div className="deleteModal">
            <h2>Change Password.</h2>

            <FormGroup className="form-group">
              <Label className="form-label" htmlFor="password">
                Password
              </Label>
              <Input
                type="text"
                id="password"
                name="password"
                value={userPassword.password}
                onChange={(e) =>
                  setUserPassword({
                    ...userPassword,
                    password: e.target.value,
                  })
                }
                placeholder="Password"
              />
            </FormGroup>
            <FormGroup className="form-group">
              <Label className="form-label" htmlFor="confirmpassword">
                Confirm Password
              </Label>
              <Input
                type="text"
                id="confirmpassword"
                name="confirmpassword"
                value={userPassword.confirmPassword}
                onChange={(e) =>
                  setUserPassword({
                    ...userPassword,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder="Confirm Password"
              />
            </FormGroup>

            <div className="btn-cancel-ok mt-3">
              <Button className="btn-ok" onClick={handlePasswordUpdate}>
                Update
              </Button>
              <Button
                className="btn-cancel ms-1"
                onClick={() => setPasswordModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      <Modal
        centered
        isOpen={subjectAlert}
        toggle={() => setSubjectAlert(false)}
      >
        <ModalBody className="p-2">
          <div className="deleteModal">
            <h2>Warning.</h2>
            <h5>Changing subjects may affect tariff</h5>
            <h5>Are you sure you want to update this?</h5>

            <div className="btn-cancel-ok mt-3">
              <Button className="btn-ok" onClick={handleUpdate}>
                Update
              </Button>
              <Button
                className="btn-cancel ms-1"
                onClick={() => setSubjectAlert(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};
export default Generalinfo;
