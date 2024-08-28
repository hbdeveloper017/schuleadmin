import "@styles/react/pages/page-authentication.scss";

import { Button, Col, Modal, ModalBody, Row } from "reactstrap";
import { Eye, Repeat, Trash, XCircle } from "react-feather";
import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { apiRequest } from "../../../../../utility/apiRequest";
import moment from "moment";
import rating1 from "../../../../../assets/images/rating1.png";
import rating2 from "../../../../../assets/images/rating2.png";
import rating3 from "../../../../../assets/images/rating3.png";
import rating4 from "../../../../../assets/images/rating4.png";

const Meeting = ({ studentInfo }) => {
  const [modal2, setModal2] = useState(false);
  const [meetingList, setMeetingList] = useState([]);
  const toggle2 = () => setModal2(!modal2);

  useEffect(() => {
    getMeetings();
  }, []);

  const getMeetings = async () => {
    const paramsData = {
      role: "student",
    };
    const resp = await apiRequest._getMeetingList(
      studentInfo.userID,
      paramsData
    );
    if (resp.status) {
      setMeetingList(resp.data);
    }
  };

  return (
    <React.Fragment>
      <div className="card">
        <div className="card-body">
          <Row>
            <Col sm="12">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="text-nowrap" style={{ minWidth: "120px" }}>
                        Title
                      </th>
                      <th className="text-nowrap" style={{ minWidth: "140px" }}>
                        Teacher Name
                      </th>
                      <th className="text-nowrap" style={{ minWidth: "140px" }}>
                        Subject
                      </th>
                      <th className="text-nowrap" style={{ minWidth: "120px" }}>
                        Date
                      </th>
                      <th className="text-nowrap" style={{ minWidth: "100px" }}>
                        Rating
                      </th>
                      <th className="text-nowrap" style={{ minWidth: "160px" }}>
                        Meeting Type
                      </th>
                      <th className="text-nowrap" style={{ minWidth: "160px" }}>
                        Proxy Teacher
                      </th>
                      <th className="text-nowrap" style={{ minWidth: "140px" }}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {meetingList.map((item, index) => (
                      <tr key={item._id + index}>
                        <td>{item.title}</td>
                        <td style={{ textTransform: "capitalize" }}>
                          {item.teacher}
                        </td>
                        <td>{item.subject}</td>
                        <td>{moment(item.date).format("DD/MM/yyyy")}</td>
                        <td>
                          {item.rating && item.rating == 1 ? (
                            <img
                              src={rating1}
                              alt="avatarImg"
                              className="ratingIcon"
                              style={{
                                filter:
                                  "invert(35%) sepia(100%) saturate(6377%) hue-rotate(346deg) brightness(91%) contrast(130%)",
                              }}
                            />
                          ) : item.rating == 2 ? (
                            <img
                              src={rating2}
                              alt="avatarImg"
                              className="ratingIcon"
                              style={{
                                filter:
                                  "invert(44%) sepia(29%) saturate(5341%) hue-rotate(1deg) brightness(104%) contrast(103%)",
                              }}
                            />
                          ) : item.rating == 3 ? (
                            <img
                              src={rating3}
                              alt="avatarImg"
                              className="ratingIcon"
                              style={{
                                filter:
                                  "invert(67%) sepia(32%) saturate(993%) hue-rotate(3deg) brightness(95%) contrast(100%)",
                              }}
                            />
                          ) : item.rating == 4 ? (
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
                        <td style={{ textTransform: "capitalize" }}>
                          {item.type == "group"
                            ? "Gruppenunterricht"
                            : "Einzelunterrichto"}
                        </td>
                        <td
                          style={{
                            textTransform: "capitalize",
                            fontWeight: 600,
                            color: "#FF6020",
                          }}
                        >
                          {item?.proxyTeacher?.name || "-"}
                        </td>
                        <td className="tableaction text-nowrap">
                          <Button
                            className="tablebtnview"
                            tag={Link}
                            to="/pages/meetingdetail2"
                            state={{ meetingInfo: item }}
                          >
                            <Eye className="tableicon" />
                          </Button>
                        </td>
                      </tr>
                    ))}

                    {meetingList.length < 1 && (
                      <tr>
                        <td colSpan={7} className="text-center pb-0">
                          There are no records to display
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Col>
          </Row>
        </div>
      </div>
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
export default Meeting;
