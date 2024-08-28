import "@styles/react/pages/page-authentication.scss";

import { Button, Col, Modal, ModalBody, Row } from "reactstrap";
import React, { useState } from "react";
import { Smile, XCircle } from "react-feather";
import { useLocation, useNavigate } from "react-router-dom";

import moment from "moment";
import rating1 from "../../../../../../assets/images/rating1.png";
import rating2 from "../../../../../../assets/images/rating2.png";
import rating3 from "../../../../../../assets/images/rating3.png";
import rating4 from "../../../../../../assets/images/rating4.png";

const meetingdetail = () => {
  const { meetingInfo } = useLocation().state;
  const navigate = useNavigate();
  const [modal2, setModal2] = useState(false);
  const toggle2 = () => setModal2(!modal2);
  return (
    <React.Fragment>
      <Row className="mb-2">
        <Col xl="6" md="6">
          <h4 className="card-title mb-1 headingcard">Meeting Details</h4>
        </Col>
        <Col xl="6" md="6" className="text-end">
          <Button className="btn-add" onClick={() => navigate(-1)}>
            Back
          </Button>
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
                      <td>{meetingInfo.title}</td>
                    </tr>
                    <tr>
                      <th className="pl-0 py-1">Teacher Name</th>
                      <td style={{ textTransform: "capitalize" }}>
                        {meetingInfo.teacher}
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
                      <td>{meetingInfo.subject}</td>
                    </tr>
                    <tr>
                      <th className="pl-0 py-1">Date</th>
                      <td>
                        {moment((<td>{meetingInfo.subject}</td>).date).format(
                          "DD/MM/yyyy"
                        )}
                      </td>
                    </tr>

                    <tr>
                      <th className="pl-0 py-1">Meeting Type</th>
                      <td style={{ textTransform: "capitalize" }}>
                        {meetingInfo.type == "group"
                          ? "Gruppenunterricht"
                          : "Einzelunterrichto"}
                      </td>
                    </tr>
                    <tr>
                      <th className="pl-0 py-1">Rating</th>
                      <td>
                        {meetingInfo.rating && meetingInfo.rating == 1 ? (
                          <img
                            src={rating1}
                            alt="avatarImg"
                            className="ratingIcon"
                            style={{
                              filter:
                                "invert(35%) sepia(100%) saturate(6377%) hue-rotate(346deg) brightness(91%) contrast(130%)",
                            }}
                          />
                        ) : meetingInfo.rating == 2 ? (
                          <img
                            src={rating2}
                            alt="avatarImg"
                            className="ratingIcon"
                            style={{
                              filter:
                                "invert(44%) sepia(29%) saturate(5341%) hue-rotate(1deg) brightness(104%) contrast(103%)",
                            }}
                          />
                        ) : meetingInfo.rating == 3 ? (
                          <img
                            src={rating3}
                            alt="avatarImg"
                            className="ratingIcon"
                            style={{
                              filter:
                                "invert(67%) sepia(32%) saturate(993%) hue-rotate(3deg) brightness(95%) contrast(100%)",
                            }}
                          />
                        ) : meetingInfo.rating == 4 ? (
                          <img
                            src={rating4}
                            alt="avatarImg"
                            className="ratingIcon"
                            style={{
                              filter:
                                "invert(72%) sepia(48%) saturate(602%) hue-rotate(30deg) brightness(96%) contrast(85%)",
                            }}
                          />
                        ) : (
                          "No Rating"
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th className="pl-0 py-1">Review Message</th>
                      <td>{meetingInfo.review || "No Review"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
