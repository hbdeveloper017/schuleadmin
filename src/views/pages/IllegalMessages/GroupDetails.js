import { API_BASE_URL, apiRequest } from "../../../utility/apiRequest";
import { Col, Row } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";

import defaultImg from "../../../assets/images/default.jpg";
import moment from "moment";

function GroupDetails() {
  const { state } = useLocation();
  const msgRef = useRef();
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
    const resp = await apiRequest._illegalGroupDetails(
      msgInfo._id,
      msgInfo.sender.userID,
      msgInfo.recipient.groupID
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
          style={{ width: 300, height: 280, borderRadius: 6 }}
        />
      </a>
    ) : (
      <a
        href={`${API_BASE_URL}/${file}`}
        target="_blank"
        className="text-white d-flex docFile"
        style={{ color: "#000!important;" }}
      >
        <span className="d-block">
          {file.split("/")[1]}
          <b
            className="d-block"
            style={{ fontSize: "12px", fontWeight: 400, marginTop: "-6px" }}
          >
            DOC
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
                      <div className="requestBox">
                        <div className="requestBody">
                          <p className="mb-0">Request Free Lesson</p>
                        </div>
                      </div>
                    ) : (
                      <li
                        key={index}
                        ref={item._id == msgInfo._id ? msgRef : null}
                        className={
                          item._id == msgInfo._id
                            ? "activeMsg clearfix odd"
                            : "clearfix odd"
                        }
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
                            {item.file && <RenderImage file={item.file} />}
                          </div>
                        </div>
                      </li>
                    )}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {item.type == "request-free-lesson" ? (
                      <div className="requestBox">
                        <div className="requestBody">
                          <p className="mb-0">Request Free Lesson</p>
                        </div>
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
                              item?.user?.profileImage
                                ? API_BASE_URL + "/" + item?.user?.profileImage
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
                              {item?.user?.name}
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

export default GroupDetails;
