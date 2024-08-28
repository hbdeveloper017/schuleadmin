import "@styles/react/pages/page-authentication.scss";

import { API_BASE_URL, apiRequest } from "../../../../../utility/apiRequest";
import {
  Button,
  CardText,
  Col,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  Row,
} from "reactstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useContext, useState } from "react";

import { CheckCircle } from "react-feather";
import LoadingContext from "../../../../../utility/context/LoadingContext";
import docimg1 from "@src/assets/images/img/doc.png";
import moment from "moment";
import toast from "react-hot-toast";

const Viewstudentpending = () => {
  const navigate = useNavigate();
  const { setLoading } = useContext(LoadingContext);
  const { teacherInfo } = useLocation().state;
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [modal2, setModal2] = useState(false);
  const toggle2 = () => setModal2(!modal2);
  const [Message, setMessage] = useState("");

  console.log(teacherInfo);

  const handleApproveStudent = async () => {
    setModal(false);
    setLoading(true);
    const payload = {
      userID: teacherInfo.userID,
      role: "teacher",
    };

    const resp = await apiRequest._userApprove(payload);

    setLoading(false);

    if (resp.status) {
      toast.success(resp.message);
      navigate(-1);
    } else {
      toast.error(resp.message);
    }
  };

  const handleRejectStudent = async () => {
    if (Message == "") {
      toast.error("Type Reason Message");
      return;
    }

    setModal2(false);
    setLoading(true);

    const payload = {
      userID: teacherInfo.userID,
      reason: Message,
    };

    const resp = await apiRequest._userReject(payload);
    setLoading(false);
    if (resp.status) {
      toast.success(resp.message);
      navigate(-1);
      setMessage("");
    } else {
      toast.error(resp.message);
    }
  };

  return (
    <React.Fragment>
      <Row className="mb-2">
        <Col xl="6" md="6">
          <h4 className="card-title mb-1 headingcard">
            Pending Approval Details
          </h4>
        </Col>
        <Col xl="6" md="6" className="text-end">
          <Link to="/pages/teacherpending">
            <Button className="btn-add">Back</Button>
          </Link>
        </Col>
      </Row>
      <Row>
        {/* <Col sm="4">
          <div className="user-avatar-section d-flex flex-column align-items-center justify-content-center">
            <div className="d-flex flex-column mb-1 align-items-center justify-content-center">
              <Avatar className="useravatar1" img={avatar1} />
              <h4 className="viewusername mt-1">David John</h4>
            </div>
          </div>
        </Col> */}
        <Col sm="12">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <tbody>
                    <tr>
                      <th className="pl-0 py-1">
                        <CardText tag="span" className="user-info-title mb-0">
                          Name
                        </CardText>
                      </th>
                      <td>
                        <CardText tag="span" className="user-info-title mb-0">
                          {[teacherInfo.firstName, " ", teacherInfo.lastName]}
                        </CardText>
                      </td>
                    </tr>

                    <tr>
                      <th className="pl-0 py-1">
                        <CardText tag="span" className="user-info-title mb-0">
                          Email
                        </CardText>
                      </th>
                      <td>
                        <CardText tag="span" className="user-info-title mb-0">
                          {teacherInfo.email}
                        </CardText>
                      </td>
                    </tr>

                    <tr>
                      <th className="pl-0 py-1">
                        <CardText tag="span" className="user-info-title mb-0">
                          Phone No.
                        </CardText>
                      </th>
                      <td>
                        <CardText tag="span" className="user-info-title mb-0">
                          {[
                            teacherInfo.phone.countryCode,
                            " ",
                            teacherInfo.phone.number,
                          ]}
                        </CardText>
                      </td>
                    </tr>
                    <tr>
                      <th className="pl-0 py-1">
                        <CardText tag="span" className="user-info-title mb-0">
                          Gender
                        </CardText>
                      </th>
                      <td>
                        <CardText
                          tag="span"
                          className="user-info-title mb-0"
                          style={{ textTransform: "capitalize" }}
                        >
                          {teacherInfo.gender == "prefer-not-to-tell"
                            ? "Not Preferred"
                            : teacherInfo.gender}
                        </CardText>
                      </td>
                    </tr>
                    <tr>
                      <th className="pl-0 py-1">
                        <CardText tag="span" className="user-info-title mb-0">
                          DOB
                        </CardText>
                      </th>
                      <td>
                        <CardText tag="span" className="user-info-title mb-0">
                          {moment(teacherInfo.dob).format("DD MMM yyyy")}
                        </CardText>
                      </td>
                    </tr>
                    <tr>
                      <th className="pl-0 py-1">
                        <CardText tag="span" className="user-info-title mb-0">
                          Subject
                        </CardText>
                      </th>
                      <td>
                        <CardText tag="span" className="user-info-title mb-0">
                          {teacherInfo.subjects.map((item) => (
                            <span className="gradeName">{item.name}</span>
                          ))}
                        </CardText>
                      </td>
                    </tr>
                    <tr>
                      <th className="pl-0 py-1">
                        <CardText tag="span" className="user-info-title mb-0">
                          State
                        </CardText>
                      </th>
                      <td>
                        <CardText tag="span" className="user-info-title mb-0">
                          {teacherInfo?.state?.name}
                        </CardText>
                      </td>
                    </tr>
                    <tr>
                      <th className="pl-0 py-1">
                        <CardText tag="span" className="user-info-title mb-0">
                          City
                        </CardText>
                      </th>
                      <td>
                        <CardText tag="span" className="user-info-title mb-0">
                          {teacherInfo?.city}
                        </CardText>
                      </td>
                    </tr>
                    <tr>
                      <th className="pl-0 py-1">
                        <CardText tag="span" className="user-info-title mb-0">
                          Address
                        </CardText>
                      </th>
                      <td>
                        <CardText tag="span" className="user-info-title mb-0">
                          {teacherInfo?.address}
                        </CardText>
                      </td>
                    </tr>
                    <tr>
                      <th className="pl-0 py-1">
                        <CardText tag="span" className="user-info-title mb-0">
                          Zip Code
                        </CardText>
                      </th>
                      <td>
                        <CardText tag="span" className="user-info-title mb-0">
                          {teacherInfo.zipCode}
                        </CardText>
                      </td>
                    </tr>
                    <tr>
                      <th className="pl-0 py-1">
                        <CardText tag="span" className="user-info-title mb-0">
                          Status
                        </CardText>
                      </th>
                      <td>
                        <CardText className="text-capitalize mb-0 badge bg-light-danger">
                          Pending
                        </CardText>
                      </td>
                    </tr>
                    <tr>
                      <th className="pl-0 py-1">
                        <CardText tag="span" className="user-info-title mb-0">
                          Proof of Qualifications
                        </CardText>
                      </th>
                      <td>
                        {teacherInfo?.qualifications?.map((item) => (
                          <div className="idproof_div">
                            <img
                              src={docimg1}
                              onClick={() =>
                                window.open(
                                  API_BASE_URL + "/" + item,
                                  "_target"
                                )
                              }
                            />
                          </div>
                        ))}
                      </td>
                    </tr>
                    <tr>
                      <th className="pl-0 py-1">
                        <CardText tag="span" className="user-info-title mb-0">
                          Your CV
                        </CardText>
                      </th>
                      <td>
                        <div className="idproof_div">
                          <img
                            src={docimg1}
                            onClick={() =>
                              window.open(
                                API_BASE_URL + "/" + teacherInfo.cv,
                                "_target"
                              )
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-2">
                <Button.Ripple
                  className="minwidth133 btnprimary me-2"
                  type="submit"
                  color="primary"
                  onClick={toggle}
                >
                  Approve
                </Button.Ripple>
                <Button.Ripple
                  className="minwidth133 btnprimary"
                  color="danger"
                  onClick={toggle2}
                >
                  Reject
                </Button.Ripple>
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
export default Viewstudentpending;
