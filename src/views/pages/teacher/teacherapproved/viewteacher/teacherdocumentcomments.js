import "@styles/react/pages/page-authentication.scss";

import { API_BASE_URL, apiRequest } from "../../../../../utility/apiRequest";
import { Badge, Button, Col, Row } from "reactstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

import defaultImg from "../../../../../assets/images/default.jpg";
import moment from "moment";

const TeacherDocumentComments = () => {
  const navigate = useNavigate();
  const { documentInfo, teacherInfo } = useLocation().state;
  const [cmtList, setCmtList] = useState([]);

  useEffect(() => {
    getDocumentComments();
  }, []);

  const getDocumentComments = async () => {
    const resp = await apiRequest._getDocumentComments(
      teacherInfo.userID,
      documentInfo._id,
      "teacher"
    );
    if (resp.status) {
      setCmtList(resp.data);
    }
  };

  return (
    <React.Fragment>
      <Row className="mb-2">
        <Col xl="6" md="6">
          <h4 className="card-title mb-1 headingcard">Documents</h4>
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
        <Col lg={7}>
          <div className="document_details">
            <img
              src="https://showcase.indiit.com/schuleimgriff/static/media/subject1.3c297e94221a8dc7aaf7.png"
              alt=""
            />
            <h3>Date: {moment(documentInfo?.dob).format("DD MMM yyyy")}</h3>
            <h3>
              <strong>Student: {documentInfo?.name}</strong>
            </h3>
            <h3 className="de_subject">{documentInfo?.subject?.name}</h3>
            <h3 className="de_status text-capitalize">
              Status:{" "}
              <span
                style={{
                  textTransform: "capitalize",
                  background:
                    documentInfo?.status == "pending" ? "#ffc108" : "#5ccb49",
                  padding: "2px 10px",
                  borderRadius: "18px",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              >
                {documentInfo?.status}
              </span>
            </h3>
            <p>{documentInfo?.message}</p>
          </div>
        </Col>
        <Col lg={5}>
          <div className="document_details">
            <h1 className="top_Heading mb-2">Comments</h1>
            <ul>
              {cmtList.length < 1 && (
                <tr>
                  <td colSpan={6} className="text-center pb-0">
                    There are no comments to display
                  </td>
                </tr>
              )}

              {cmtList.map((e, i) => (
                <li>
                  <div className="reviewBox">
                    <img
                      className="u_img"
                      src={
                        documentInfo?.teacherID == e?.senderID &&
                        teacherInfo?.profileImage
                          ? `${API_BASE_URL}/${teacherInfo?.profileImage}`
                          : documentInfo?.studentID === e?.senderID &&
                            documentInfo?.profileImage
                          ? `${API_BASE_URL}/${documentInfo?.profileImage}`
                          : defaultImg
                      }
                      alt=""
                    />
                    <div>
                      <h2>
                        {documentInfo?.studentID === e?.senderID &&
                          documentInfo?.name}
                        {documentInfo?.teacherID === e?.senderID &&
                          teacherInfo?.name}{" "}
                        <span>
                          {" "}
                          {moment(e?.createdAt).format("DD/MM/yyyy")}
                        </span>
                      </h2>
                      <p>
                        {e?.comment}
                        {e?.commentDoc && (
                          <a
                            href={`${API_BASE_URL}/${e?.commentDoc}`}
                            target="_blank"
                          >
                            {e?.commentDoc.split("/")[1]}
                          </a>
                        )}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default TeacherDocumentComments;
