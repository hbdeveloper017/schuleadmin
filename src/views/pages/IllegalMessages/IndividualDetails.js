import { API_BASE_URL, apiRequest } from "../../../utility/apiRequest";
import { Col, Row } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";

import { File } from "react-feather";
import FreeLessonUI from "../student/studentapproved/viewstudent/FreeLessonUI";
import defaultImg from "../../../assets/images/default.jpg";
import moment from "moment";

function IndividualDetails() {
  const msgRef = useRef();
  const { state } = useLocation();
  const [messages, setMessages] = useState([]);
  const [msgInfo, setMsgInfo] = useState(state?.msgInfo);

  useEffect(() => {
    getMessages();
  }, []);

  useEffect(() => {
    if (msgRef?.current) {
      msgRef?.current.scrollIntoView({
        behavior: "instant",
        block: "center",
      });
    }
  }, [messages]);

  const getMessages = async () => {
    const resp = await apiRequest._illegalIndividualDetails(
      msgInfo._id,
      msgInfo.sender.userID,
      msgInfo.recipient.userID
    );
    if (resp.status) {
      setMessages(resp.data);
    }
  };

  const RenderImage = ({ file }) => {
    const acceptedImageTypes = ["gif", "jpeg", "png", "jpg", "webp"];
    let fileType = acceptedImageTypes.includes(file.split(".")[1]);

    return fileType ? (
      <a
        href={`${API_BASE_URL}/${file}`}
        target="_blank"
        style={{ color: "#000!important;" }}
      >
        <img
          alt=""
          src={`${API_BASE_URL}/${file}`}
          className="img-fluid"
          style={{ width: "200px", height: "200px", borderRadius: 6 }}
        />
      </a>
    ) : (
      <a
        href={`${API_BASE_URL}/${file}`}
        target="_blank"
        className="text-white d-flex docFile"
        style={{
          color: "#000!important;",
          width: "200px",
          height: "200px",
          borderRadius: 6,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <span className="d-block">
          <File size={80} color="#000" />
          <b
            className="d-block"
            style={{
              fontSize: "12px",
              fontWeight: 600,
              textAlign: "center",
              marginTop: 5,
            }}
          >
            Open DOC
          </b>
        </span>
      </a>
    );
  };

  return (
    <Row>
      <Col md="12" lg="12">
        <div className="card" style={{ height: "520px", marginBottom: 0 }}>
          <div className="card-body p-0">
            <ul
              className="conversation-list pt-2 mb-0 pb-5"
              style={{ overflow: "scroll", height: "510px" }}
              onScroll={(e) => e.target.scrollTop < 240 && loadMoreMessage()}
              //   ref={chatContainerRef}
            >
              {messages.map((item, index) =>
                item.senderID == msgInfo?.sender?.userID ? (
                  <React.Fragment>
                    {item.type == "request-free-lesson" ? (
                      <FreeLessonUI
                        item={item}
                        index={index}
                        studentInfo={msgInfo?.sender}
                      />
                    ) : (
                      <li
                        key={index}
                        className={
                          item._id == msgInfo._id
                            ? "activeMsg clearfix odd"
                            : "clearfix odd"
                        }
                        ref={item._id == msgInfo._id ? msgRef : null}
                      >
                        <div className="chat-avatar">
                          <img
                            src={
                              msgInfo?.sender?.profileImage
                                ? API_BASE_URL +
                                  "/" +
                                  msgInfo?.sender?.profileImage
                                : defaultImg
                            }
                            className="rounded"
                            alt=""
                          />
                          <i style={{ whiteSpace: "nowrap" }}>
                            {moment(item.createdAt).format("HH:mm a")}
                          </i>
                        </div>
                        <div className="conversation-text">
                          <div className="ctext-wrap">
                            <i style={{ textTransform: "capitalize" }}>
                              {msgInfo.sender.name}
                            </i>
                            {item.text && (
                              <p>{item?.originalText || item?.text}</p>
                            )}
                            {/* {item.file && <RenderImage file={item.file} />} */}
                            {item.files && (
                              <div
                                style={{
                                  gap: 10,
                                  display: "flex",
                                  flexWrap: "wrap",
                                  maxWidth: "410px",
                                }}
                              >
                                {item.files.map((elm) => (
                                  <RenderImage file={elm} />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    )}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {item.type == "request-free-lesson" ? (
                      <div className="requestBox">
                        {/* <div className="requestBody">
                          <p className="mb-0">Request Free Lesson</p>
                        </div> */}
                      </div>
                    ) : (
                      <li
                        key={index}
                        ref={item._id == msgInfo._id ? msgRef : null}
                        className={
                          item._id == msgInfo._id
                            ? "activeMsg clearfix"
                            : "clearfix"
                        }
                      >
                        <div className="chat-avatar groupchatimg">
                          <img
                            src={
                              msgInfo?.recipient?.profileImage
                                ? API_BASE_URL +
                                  "/" +
                                  msgInfo?.recipient?.profileImage
                                : defaultImg
                            }
                            className="rounded"
                            alt=""
                          />
                          <i style={{ whiteSpace: "nowrap" }}>
                            {moment(item.createdAt).format("HH:mm a")}
                          </i>
                        </div>
                        <div className="conversation-text">
                          <div className="ctext-wrap">
                            <i style={{ textTransform: "capitalize" }}>
                              {msgInfo?.recipient?.name}
                            </i>
                            {item.text && (
                              <p>{item?.originalText || item?.text}</p>
                            )}
                            {item.file && <RenderImage file={item.file} />}
                          </div>
                        </div>
                      </li>
                    )}
                  </React.Fragment>
                )
              )}
            </ul>
          </div>
        </div>
      </Col>
    </Row>
  );
}

export default IndividualDetails;
