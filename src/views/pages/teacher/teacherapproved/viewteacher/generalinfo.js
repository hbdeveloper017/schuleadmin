import "@styles/react/pages/page-authentication.scss";

import { CardText, Col, Row } from "reactstrap";

import { API_BASE_URL } from "../../../../../utility/apiRequest";
import Avatar from "@components/avatar";
import React from "react";
import defaultImg from "../../../../../assets/images/default.jpg";
import docimg1 from "@src/assets/images/img/doc.png";
import moment from "moment";

const Generalinfo = ({ teacherInfo }) => {
  return (
    <React.Fragment>
      <Row>
        <Col sm="4">
          <div className="user-avatar-section d-flex flex-column align-items-center justify-content-center">
            <div className="d-flex flex-column mb-1 align-items-center justify-content-center">
              <Avatar
                className="useravatar1"
                img={
                  teacherInfo.profileImage
                    ? API_BASE_URL + "/" + teacherInfo.profileImage
                    : defaultImg
                }
              />
              <h4
                className="viewusername mt-1"
                style={{ textTransform: "capitalize" }}
              >
                {[teacherInfo.firstName, " ", teacherInfo.lastName]}
              </h4>
            </div>
          </div>
        </Col>
        <Col sm="8">
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
                        <CardText
                          tag="span"
                          className="user-info-title mb-0"
                          style={{ textTransform: "capitalize" }}
                        >
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
                            teacherInfo?.phone?.countryCode,
                            " ",
                            teacherInfo?.phone?.number,
                          ]}
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
                          Date of Birth
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
                          {teacherInfo?.subjects?.map((item) => (
                            <span className="gradeName">{item.name}</span>
                          ))}
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
                        <CardText className="text-capitalize mb-0 badge bg-light-success">
                          {teacherInfo.status}
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
                                window.open(API_BASE_URL + "/" + item)
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
                              window.open(API_BASE_URL + "/" + teacherInfo?.cv)
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default Generalinfo;
