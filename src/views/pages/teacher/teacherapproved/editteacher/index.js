// ** React Imports

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
import { Edit, Upload, X } from "react-feather";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";

import Avatar from "@components/avatar";
import LoadingContext from "../../../../../utility/context/LoadingContext";
import Select from "react-select";
import defaultImg from "../../../../../assets/images/default.jpg";
import docimg1 from "@src/assets/images/img/doc.png";
import moment from "moment";
import toast from "react-hot-toast";

const Editteacher = () => {
  const navigate = useNavigate();
  const { details } = useLocation().state;
  const { setLoading } = useContext(LoadingContext);
  const [subjectList, setSubjectList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [userPassword, setUserPassword] = useState({
    password: "",
    confirmPassword: "",
  });
  const [passwordModal, setPasswordModal] = useState(false);
  const [teacherInfo, setTeacherInfo] = useState({
    firstName: details.firstName,
    lastName: details.lastName,
    email: details.email,
    countryCode: details.phone.countryCode,
    phone: details.phone.number,
    address: details.address,
    gender: details.gender,
    dob: moment(details.dob).format("yyyy-MM-DD"),
    status: details.status,
    qualifications: details.qualifications,
    removedQualifications: [],
    cv: details.cv,
    profileImage: API_BASE_URL + "/" + details.profileImage,
    showProfile: details.profileImage
      ? `${API_BASE_URL}/${details.profileImage}`
      : defaultImg,
    password: "",
    confirmPassword: "",
    city: details.city,
    zipCode: details.zipCode,
    state: details.state._id,
  });

  useEffect(() => {
    console.log(details, "details");
    getSubjectList();
    getStateList();
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
        details.subjects.some((subject) => subject._id === item.value)
      );

      setTeacherInfo({ ...teacherInfo, subjects: filteredInput });
      setSubjectList(data);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (teacherInfo.address == "") {
      toast.error("Address is required.");
      return false;
    }
    if (teacherInfo.qualifications.length < 1) {
      toast.error("Qualification is required.");
      return false;
    }
    if (!teacherInfo.profileImage) {
      toast.error("Profile picture is required.");
      return false;
    }
    if (!teacherInfo.cv) {
      toast.error("CV is required.");
      return false;
    }
    // console.log(teacherInfo.qualifications);
    // return;

    setLoading(true);

    const formdata = new FormData();
    formdata.append("firstName", teacherInfo.firstName);
    formdata.append("lastName", teacherInfo.lastName);
    formdata.append("email", teacherInfo.email);
    formdata.append("phone[countryCode]", teacherInfo.countryCode);
    formdata.append("phone[number]", teacherInfo.phone);
    formdata.append("address", teacherInfo.address);
    formdata.append("city", teacherInfo.city);
    formdata.append("state", teacherInfo.state._id);
    formdata.append("zipCode", teacherInfo.zipCode);
    formdata.append("gender", teacherInfo.gender);
    formdata.append("dob", moment(teacherInfo.dob));

    formdata.append("status", teacherInfo.status);

    teacherInfo.subjects.forEach((element, index) => {
      formdata.append(`subjects[${index}]`, element.value);
    });

    formdata.append("profileImage", teacherInfo.profileImage);
    formdata.append("cv", teacherInfo.cv);

    teacherInfo.removedQualifications.forEach((element) => {
      formdata.append(`removedImages[]`, element);
    });

    teacherInfo.qualifications.forEach((element) => {
      if (typeof element == "string") {
        formdata.append("qualifications[]", element);
      } else {
        formdata.append("qualifications", element);
      }
    });

    const resp = await apiRequest._updateProfile(
      details.userID,
      "teacher",
      formdata
    );
    setLoading(false);

    if (resp.status) {
      navigate(-1);
      toast.success(resp.message);
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
      details.userID,
      "teacher",
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

  const getStateList = async () => {
    const resp = await apiRequest._getStateList();
    if (resp.status) {
      setStateList(resp.data);
    } else {
      setStateList([]);
    }
  };

  return (
    <React.Fragment>
      <Row className="mb-2">
        <Col xl="6" md="6">
          <h4 className="card-title mb-1 headingcard">Edit Teacher</h4>
        </Col>
        <Col xl="6" md="6" className="text-end">
          <Link to="/pages/teacherapproved">
            <Button className="btn-add">Back</Button>
          </Link>
        </Col>
      </Row>

      <Row>
        <Col sm="4">
          <div className="user-avatar-section d-flex flex-column align-items-center justify-content-center">
            <div className="d-flex flex-column mb-1 align-items-center justify-content-center">
              <Avatar
                className="useravatar1"
                img={teacherInfo.showProfile || defaultImg}
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
                onChange={(e) =>
                  setTeacherInfo({
                    ...teacherInfo,
                    profileImage: e.target.files[0],
                    showProfile: URL.createObjectURL(e.target.files[0]),
                  })
                }
              />
            </Button.Ripple>
          </div>
        </Col>
        <Col sm="8">
          <div className="card">
            <div className="card-body">
              <Form onSubmit={handleUpdate}>
                <Row>
                  <Col md="6" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label" htmlFor="fname">
                        Name
                      </Label>
                      <Input
                        type="text"
                        id="fname"
                        name="fname"
                        value={teacherInfo.firstName}
                        onChange={(e) =>
                          setTeacherInfo({
                            ...teacherInfo,
                            firstName: e.target.value,
                          })
                        }
                        placeholder="Full Name"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label" htmlFor="fname">
                        Surname
                      </Label>
                      <Input
                        type="text"
                        id="fname"
                        name="fname"
                        value={teacherInfo.lastName}
                        onChange={(e) =>
                          setTeacherInfo({
                            ...teacherInfo,
                            lastName: e.target.value,
                          })
                        }
                        placeholder="Full Name"
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
                        value={teacherInfo.email}
                        onChange={(e) =>
                          setTeacherInfo({
                            ...teacherInfo,
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
                        name="phone"
                        value={teacherInfo.phone}
                        onChange={(e) =>
                          setTeacherInfo({
                            ...teacherInfo,
                            phone: e.target.value,
                          })
                        }
                        placeholder="Phone No."
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label" htmlFor="Address">
                        Address
                      </Label>
                      <Input
                        type="text"
                        id="Address"
                        name="Address"
                        value={teacherInfo.address}
                        onChange={(e) =>
                          setTeacherInfo({
                            ...teacherInfo,
                            address: e.target.value,
                          })
                        }
                        placeholder="Address"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label" for="state">
                        State
                      </Label>
                      <Input
                        type="select"
                        name="state"
                        id="state"
                        value={teacherInfo.state}
                        onChange={(e) =>
                          setTeacherInfo({
                            ...teacherInfo,
                            state: e.target.value,
                          })
                        }
                      >
                        <option value="select">Select State</option>
                        {stateList.map((item) => (
                          <option value={item._id}>{item.name}</option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md="4" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label" for="city">
                        City
                      </Label>
                      <Input
                        type="text"
                        id="city"
                        name="city"
                        value={teacherInfo.city}
                        onChange={(e) =>
                          setTeacherInfo({
                            ...teacherInfo,
                            city: e.target.value,
                          })
                        }
                        placeholder="city"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label" for="zipCode">
                        Zip Code
                      </Label>
                      <Input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={teacherInfo.zipCode}
                        onChange={(e) =>
                          setTeacherInfo({
                            ...teacherInfo,
                            zipCode: e.target.value,
                          })
                        }
                        placeholder="zip code"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label" for="Gender">
                        Gender
                      </Label>
                      <Input
                        type="select"
                        name="Gender"
                        id="Gender"
                        value={teacherInfo.gender}
                        onChange={(e) =>
                          setTeacherInfo({
                            ...teacherInfo,
                            gender: e.target.value,
                          })
                        }
                      >
                        <option value="select">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="prefer-not-to-tell">
                          Prefer Not to tell
                        </option>
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md="4" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label" htmlFor="DOB">
                        Date of Birth
                      </Label>
                      <Input
                        type="date"
                        id="DOB"
                        name="DOB"
                        value={teacherInfo.dob}
                        onChange={(e) =>
                          setTeacherInfo({
                            ...teacherInfo,
                            dob: e.target.value,
                          })
                        }
                        placeholder="Date of Birth"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label" htmlFor="phone">
                        Status
                      </Label>
                      <Input
                        type="select"
                        name="status"
                        id="status"
                        value={teacherInfo.status}
                        onChange={(e) =>
                          setTeacherInfo({
                            ...teacherInfo,
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
                  <Col md="12" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label" htmlFor="Subject">
                        Subject
                      </Label>
                      <Select
                        isMulti
                        options={subjectList}
                        value={teacherInfo?.subjects}
                        onChange={(item) =>
                          setTeacherInfo({
                            ...teacherInfo,
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

                  <Col md="12" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label">
                        Add Proof of Qualifications
                      </Label>
                      <Input
                        id="ProofQualifications"
                        name="ProofQualifications"
                        className="displaynone"
                        type="file"
                        multiple
                        onChange={(e) => {
                          let filesObj = event.target.files;
                          const oldVal = [...teacherInfo.qualifications];

                          Object.entries(filesObj).map((item) => {
                            // oldImages.push(item[1]);
                            oldVal.push(item[1]);
                          });

                          setTeacherInfo({
                            ...teacherInfo,
                            qualifications: oldVal,
                          });
                        }}
                      />
                      <label
                        className="fileupload"
                        htmlFor="ProofQualifications"
                      >
                        <Upload className="uplaodicon" size={30} />
                        <h3>Upload Documents Here</h3>
                      </label>
                      {teacherInfo.qualifications.map((item, index) => (
                        <div className="formimg idproof_div">
                          <img
                            src={docimg1}
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              item.name
                                ? window.open(URL.createObjectURL(item))
                                : window.open(API_BASE_URL + "/" + item)
                            }
                          />
                          <X
                            className="closebtn"
                            size={10}
                            onClick={() => {
                              let qualificationInfo = [
                                ...teacherInfo.qualifications,
                              ];
                              let removedQualificationInfo = [
                                ...teacherInfo.removedQualifications,
                              ];
                              item.name
                                ? null
                                : removedQualificationInfo.push(item);
                              qualificationInfo.splice(index, 1);

                              setTeacherInfo({
                                ...teacherInfo,
                                qualifications: qualificationInfo,
                                removedQualifications: removedQualificationInfo,
                              });
                            }}
                          />
                        </div>
                      ))}
                    </FormGroup>
                  </Col>
                  <Col md="12" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label">Add Your CV</Label>
                      <Input
                        id="addCV"
                        name="addCV"
                        className="displaynone"
                        type="file"
                        onChange={(e) => {
                          setTeacherInfo({
                            ...teacherInfo,
                            cv: e.target.files[0],
                          });
                        }}
                      />
                      <label className="fileupload" htmlFor="addCV">
                        <Upload className="uplaodicon" size={30} />
                        <h3>Upload Documents Here</h3>
                      </label>
                      {teacherInfo.cv && (
                        <div className="formimg idproof_div">
                          <img
                            src={docimg1}
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              teacherInfo.cv.name
                                ? window.open(
                                    URL.createObjectURL(teacherInfo.cv)
                                  )
                                : window.open(
                                    API_BASE_URL + "/" + teacherInfo.cv
                                  )
                            }
                          />
                          <X
                            className="closebtn"
                            size={10}
                            onClick={() => {
                              setTeacherInfo({
                                ...teacherInfo,
                                cv: "",
                              });
                            }}
                          />
                        </div>
                      )}
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
    </React.Fragment>
  );
};
export default Editteacher;
