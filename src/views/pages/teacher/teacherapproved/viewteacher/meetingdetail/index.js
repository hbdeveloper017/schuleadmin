import "@styles/react/pages/page-authentication.scss";

import { Button, CardText, Col, Modal, ModalBody, Row } from "reactstrap";
import { Eye, Smile, Trash, XCircle } from "react-feather";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import ReviewList from "./reviewlist";
import moment from "moment";

const meetingdetail = () => {
  const navigate = useNavigate();
  const { meetingInfo } = useLocation().state;
  const [modal2, setModal2] = useState(false);
  const toggle2 = () => setModal2(!modal2);

  return (
    <React.Fragment>
      <Row className="mb-2">
        <Col xl="6" md="6">
          <h4 className="card-title mb-1 headingcard">Meeting Details</h4>
        </Col>
        <Col xl="6" md="6" className="text-end">
          {/* <Link to="/pages/viewteacher"> */}
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
                      <th className="pl-0 py-1">Title</th>
                      <td>{meetingInfo?.title}</td>
                    </tr>
                    <tr>
                      <th className="pl-0 py-1">Student Name</th>
                      <td style={{ textTransform: "capitalize" }}>
                        {meetingInfo.type == "individual"
                          ? meetingInfo?.student?.studentName
                          : meetingInfo?.group.map((item) => (
                              <span> {[item.studentName, " |"]} </span>
                            ))}
                      </td>
                    </tr>

                    {meetingInfo?.proxyTeacher?.name && (
                      <tr>
                        <th className="pl-0 py-1">Proxy Teacher Name</th>
                        <td style={{ textTransform: "capitalize" }}>
                          {meetingInfo?.proxyTeacher?.name}
                        </td>
                      </tr>
                    )}

                    <tr>
                      <th className="pl-0 py-1">Subject</th>
                      <td>{meetingInfo?.subject?.name}</td>
                    </tr>
                    <tr>
                      <th className="pl-0 py-1">Time Slot</th>
                      <td>
                        {meetingInfo.time} -{" "}
                        {moment(meetingInfo.time, "hh:mm A")
                          .add(meetingInfo.duration, "minutes")
                          .format("hh:mm A")}
                      </td>
                    </tr>
                    <tr>
                      <th className="pl-0 py-1">School & Class </th>
                      <td>
                        {meetingInfo?.school?.name}{" "}
                        {meetingInfo?.school?.name && "|"}{" "}
                        {meetingInfo?.grade?.name || "-"}
                      </td>
                    </tr>

                    <tr>
                      <th className="pl-0 py-1">Meeting Type</th>
                      <td>
                        {meetingInfo.type == "group"
                          ? "Gruppenunterricht"
                          : "Einzelunterrichto"}
                      </td>
                    </tr>
                    {/* <tr>
                      <th className="pl-0 py-1">Ratting</th>
                      <td>
                        <Smile color="#FF6020" size="20" />
                      </td>
                    </tr>
                    <tr>
                      <th className="pl-0 py-1">Review Message</th>
                      <td>
                        Lorem ipsum dolor sit amet consectetur. Velit id diam
                        ultricies enim faucibus augue condimentum. Viverra
                        phasellus morbi ut ut accumsan sodales amet. Lorem ipsum
                        dolor sit amet consectetur.
                      </td>
                    </tr> */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col sm="12">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-1 headingcard">Reviews List</h4>
              <ReviewList />
            </div>
          </div>
        </Col>
      </Row>

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
              <Button className="btn-ok" onClick={toggle2}>
                OK
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};
export default meetingdetail;
