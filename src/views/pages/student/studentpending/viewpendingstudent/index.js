import "@styles/react/pages/page-authentication.scss";

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
import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { CheckCircle } from "react-feather";
import LoadingContext from "../../../../../utility/context/LoadingContext";
import { apiRequest } from "../../../../../utility/apiRequest";
import toast from "react-hot-toast";

const Viewstudentpending = () => {
  const navigate = useNavigate();
  const { setLoading } = useContext(LoadingContext);
  const { studentInfo } = useLocation().state;
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [modal2, setModal2] = useState(false);
  const toggle2 = () => setModal2(!modal2);
  const [Message, setMessage] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const handleApproveStudent = async () => {
    setModal(false);
    setLoading(true);
    const payload = {
      userID: studentInfo.userID,
      role: "student",
    };

    const resp = await apiRequest._userApprove(payload);
    setLoading(false);
    if (resp.status) {
      navigate(-1);
      toast.success(resp.message);
    } else {
      toast.error(resp.message);
    }
  };

  const handleRejectStudent = async () => {
    if (rejectReason == "") {
      toast.error("Type Reason Message");
      return;
    }

    setModal2(false);
    setLoading(true);

    const payload = {
      userID: studentInfo.userID,
      reason: rejectReason,
    };

    const resp = await apiRequest._userReject(payload);
    setLoading(false);
    if (resp.status) {
      toast.success(resp.message);
      navigate(-1);
      setRejectReason("");
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
          {/* <Link to="/pages/studentpending"> */}
          <Button className="btn-add" onClick={() => navigate(-1)}>
            Back
          </Button>
          {/* </Link> */}
        </Col>
      </Row>
      <Row>
        <Col sm="12">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <tbody>
                    <tr>
                      <th className="pl-0 py-1">
                        <CardText tag="span" className="user-info-title mb-0">
                          Student First Name
                        </CardText>
                      </th>
                      <td style={{ textTransform: "capitalize" }}>
                        <CardText tag="span" className="user-info-title mb-0">
                          {studentInfo.studentFirstName}
                        </CardText>
                      </td>
                    </tr>
                    <tr>
                      <th className="pl-0 py-1">
                        <CardText tag="span" className="user-info-title mb-0">
                          Student Last Name
                        </CardText>
                      </th>
                      <td style={{ textTransform: "capitalize" }}>
                        <CardText tag="span" className="user-info-title mb-0">
                          {studentInfo.studentLastName}
                        </CardText>
                      </td>
                    </tr>

                    {studentInfo.registerAs == "parent" && (
                      <>
                        <tr>
                          <th className="pl-0 py-1">
                            <CardText
                              tag="span"
                              className="user-info-title mb-0"
                            >
                              Parent First Name
                            </CardText>
                          </th>
                          <td style={{ textTransform: "capitalize" }}>
                            <CardText
                              tag="span"
                              className="user-info-title mb-0"
                            >
                              {studentInfo.parentFirstName}
                            </CardText>
                          </td>
                        </tr>
                        <tr>
                          <th className="pl-0 py-1">
                            <CardText
                              tag="span"
                              className="user-info-title mb-0"
                            >
                              Parent Last Name
                            </CardText>
                          </th>
                          <td style={{ textTransform: "capitalize" }}>
                            <CardText
                              tag="span"
                              className="user-info-title mb-0"
                            >
                              {studentInfo.parentLastName}
                            </CardText>
                          </td>
                        </tr>
                      </>
                    )}

                    <tr>
                      <th className="pl-0 py-1">
                        <CardText tag="span" className="user-info-title mb-0">
                          Email
                        </CardText>
                      </th>
                      <td>
                        <CardText tag="span" className="user-info-title mb-0">
                          {studentInfo.email}
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
                            studentInfo.phone.countryCode,
                            " ",
                            studentInfo.phone.number,
                          ]}
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
                          {studentInfo.subjects.map((item) => (
                            <span className="gradeName">{item.name}</span>
                          ))}
                        </CardText>
                      </td>
                    </tr>
                    <tr>
                      <th className="pl-0 py-1">
                        <CardText tag="span" className="user-info-title mb-0">
                          School
                        </CardText>
                      </th>
                      <td>
                        <CardText tag="span" className="user-info-title mb-0">
                          {studentInfo.school.name}
                        </CardText>
                      </td>
                    </tr>
                    <tr>
                      <th className="pl-0 py-1">
                        <CardText tag="span" className="user-info-title mb-0">
                          Class
                        </CardText>
                      </th>
                      <td>
                        <CardText tag="span" className="user-info-title mb-0">
                          {studentInfo.grade.name}
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
export default Viewstudentpending;
