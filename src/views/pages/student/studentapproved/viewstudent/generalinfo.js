import "@styles/react/pages/page-authentication.scss";

import { CardText, Col, Row } from "reactstrap";

import { API_BASE_URL } from "../../../../../utility/apiRequest";
import Avatar from "@components/avatar";
import React from "react";
import defaultImg from "../../../../../assets/images/default.jpg";

const Generalinfo = ({ studentInfo }) => {
  return (
    <React.Fragment>
      <Row>
        <Col sm="4">
          <div className="user-avatar-section d-flex flex-column align-items-center justify-content-center">
            <div className="d-flex flex-column mb-1 align-items-center justify-content-center">
              <Avatar
                className="useravatar1"
                img={
                  studentInfo.profileImage
                    ? API_BASE_URL + "/" + studentInfo.profileImage
                    : defaultImg
                }
              />
              <h4
                className="viewusername mt-1"
                style={{ textTransform: "capitalize" }}
              >
                {[
                  studentInfo?.studentFirstName,
                  " ",
                  studentInfo?.studentLastName,
                ]}
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
                          Student First Name
                        </CardText>
                      </th>
                      <td>
                        <CardText
                          tag="span"
                          className="user-info-title mb-0"
                          style={{ textTransform: "capitalize" }}
                        >
                          {studentInfo?.studentFirstName}
                        </CardText>
                      </td>
                    </tr>
                    <tr>
                      <th className="pl-0 py-1">
                        <CardText
                          tag="span"
                          className="user-info-title mb-0"
                          style={{ textTransform: "capitalize" }}
                        >
                          Student Last Name
                        </CardText>
                      </th>
                      <td>
                        <CardText
                          tag="span"
                          className="user-info-title mb-0"
                          style={{ textTransform: "capitalize" }}
                        >
                          {studentInfo?.studentLastName}
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
                          {studentInfo?.email}
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
                            studentInfo?.phone?.countryCode,
                            " ",
                            studentInfo?.phone?.number,
                          ]}
                        </CardText>
                      </td>
                    </tr>
                    {studentInfo?.registerAs == "parent" && (
                      <>
                        <tr>
                          <th className="pl-0 py-1">
                            <CardText
                              tag="span"
                              className="user-info-title mb-0"
                            >
                              Parent's First Name
                            </CardText>
                          </th>
                          <td>
                            <CardText
                              tag="span"
                              className="user-info-title mb-0"
                              style={{ textTransform: "capitalize" }}
                            >
                              {studentInfo?.parentFirstName}
                            </CardText>
                          </td>
                        </tr>
                        <tr>
                          <th className="pl-0 py-1">
                            <CardText
                              tag="span"
                              className="user-info-title mb-0"
                            >
                              Parent's Last Name
                            </CardText>
                          </th>
                          <td>
                            <CardText
                              tag="span"
                              className="user-info-title mb-0"
                              style={{ textTransform: "capitalize" }}
                            >
                              {studentInfo?.parentLastName}
                            </CardText>
                          </td>
                        </tr>
                      </>
                    )}

                    <tr>
                      <th className="pl-0 py-1">
                        <CardText tag="span" className="user-info-title mb-0">
                          Street
                        </CardText>
                      </th>
                      <td>
                        <CardText tag="span" className="user-info-title mb-0">
                          {studentInfo?.address}
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
                          {studentInfo?.zipCode}
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
                          {studentInfo.city}
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
                          {studentInfo?.state?.name}
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
                          {studentInfo?.school?.name}
                        </CardText>
                      </td>
                    </tr>
                    <tr>
                      <th className="pl-0 py-1">
                        <CardText tag="span" className="user-info-title mb-0">
                          Grade
                        </CardText>
                      </th>
                      <td>
                        <CardText tag="span" className="user-info-title mb-0">
                          {studentInfo?.grade?.name}
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
                          {studentInfo?.status}
                        </CardText>
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
