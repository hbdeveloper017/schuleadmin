import "@styles/react/pages/page-authentication.scss";

import { API_BASE_URL, apiRequest } from "../../../../../utility/apiRequest";
import { ArrowDown, Image } from "react-feather";
import { Col, Row } from "reactstrap";
import React, { useEffect, useRef, useState } from "react";

import { File } from "react-feather";
import FreeLessonUI from "./FreeLessonUI";
import defaultImg from "../../../../../assets/images/default.jpg";
import formatWhatsAppMessageTime from "../../../../../utility/formatWhatsAppMessageTime";
import moment from "moment";

const Comments = ({ teacherInfo }) => {
  const chatContainerRef = useRef();
  const [individualChatList, setIndividualChatList] = useState([]);
  const [groupChatList, setGroupChatList] = useState([]);
  const [chatDetails, setChatDetails] = useState([]);
  const [chatCount, setChatCount] = useState(0);
  const [selectedTab, setSelectedTab] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState({});
  const [individualOffset, setIndividualOffset] = useState(0);
  const [groupOffset, setGroupOffset] = useState(0);
  const [individualChatOffset, setIndividualChatOffset] = useState(0);
  const [groupChatOffset, setGroupChatOffset] = useState(0);

  useEffect(() => {
    getChatList();
  }, []);

  const handleScroll = async () => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  };

  const getChatList = async () => {
    const resp = await apiRequest._getIndividualChatList(teacherInfo.userID, {
      role: "teacher",
      offset: 0,
      limit: 1000,
    });

    if (resp.status) {
      setIndividualChatList(resp.data.list);
      setIndividualOffset(individualOffset + 1);
    }
  };

  const getGroupChatList = async () => {
    const resp = await apiRequest._getChatGroupList(teacherInfo.userID, {
      role: "teacher",
      offset: 0,
      limit: 1000,
    });

    if (resp.status) {
      setGroupChatList(resp.data.list);
      setGroupOffset(groupOffset + 1);
    }
  };

  const getIndividualDetails = async (otherUserID) => {
    const resp = await apiRequest._getIndividualChatDetails(
      teacherInfo.userID,
      otherUserID,
      {
        offset: 0,
        limit: 100,
      }
    );

    if (resp.status) {
      resp.data.list.length > 0 && setChatDetails(resp.data.list.reverse());
      setChatCount(resp.data.count);

      setTimeout(() => {
        handleScroll();
      }, 200);
    } else {
      setChatDetails([]);
    }
  };

  const getGroupDetails = async (groupID) => {
    const resp = await apiRequest._getChatGroupDetails(
      teacherInfo.userID,
      groupID,
      {
        offset: 0,
        limit: 1000,
      }
    );

    if (resp.status) {
      setChatDetails(resp.data.list.reverse());
      setChatCount(resp.data.count);

      setTimeout(() => {
        handleScroll();
      }, 200);
    } else {
      setChatDetails([]);
    }
  };

  const loadMoreMessage = async () => {
    if (chatDetails.length < chatCount) {
      if (selectedTab == 1) {
        const resp = await apiRequest._getIndividualChatDetails(
          teacherInfo.userID,
          selectedStudent.user.userID,
          {
            offset: individualChatOffset + 1,
            limit: 1000,
          }
        );

        console.log(chatDetails);

        // return;

        if (resp.status) {
          const newData = [...resp.data.list.reverse(), ...chatDetails];
          setChatDetails(newData);
          setIndividualChatOffset(individualChatOffset + 1);
        }
      } else {
        const resp = await apiRequest._getChatGroupDetails(
          teacherInfo.userID,
          selectedStudent.lastMessage.recipientID,
          {
            offset: groupChatOffset + 1,
            limit: 1000,
          }
        );

        if (resp.status) {
          const newData = [...resp.data.list.reverse(), ...chatDetails];
          setChatDetails(newData);
          setGroupChatOffset(groupChatOffset + 1);
        }
      }
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
    <Row className="pb-2">
      <Col md="4" lg="4">
        <div className="card" style={{ height: "520px", marginBottom: 0 }}>
          <div className="card-header chatBtnContainer">
            <button
              onClick={() => {
                setSelectedStudent({});
                setChatDetails([]);
                setSelectedTab(1);
              }}
              className={selectedTab == 1 && "active"}
            >
              Individual
            </button>
            <button
              onClick={() => {
                setSelectedStudent({});
                setChatDetails([]);
                setSelectedTab(2);
                getGroupChatList(groupOffset);
              }}
              className={selectedTab == 2 && "active"}
            >
              Group
            </button>
          </div>
          <div className="card-body px-0">
            {selectedTab == 1 ? (
              <div>
                {individualChatList?.map((item) => (
                  <div
                    className={
                      item.user.userID == selectedStudent?.user?.userID
                        ? "py_6 media active"
                        : "py_6 media"
                    }
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setChatDetails([]);
                      setGroupChatOffset(0);
                      setSelectedStudent(item);
                      getIndividualDetails(item.user.userID);
                      setIndividualChatOffset(0);
                    }}
                  >
                    <img
                      src={
                        item?.user?.profileImage
                          ? API_BASE_URL + "/" + item?.user?.profileImage
                          : defaultImg
                      }
                      className="me-1 rounded-circle chatgroupimg"
                      alt=""
                    />
                    <div className="media-body">
                      <h5
                        className="mt-0 mb-0 font-14"
                        style={{ textTransform: "capitalize" }}
                      >
                        <span
                          className="float-end text-muted font-weight-normal font-12"
                          style={{ fontSize: 10 }}
                        >
                          {formatWhatsAppMessageTime(
                            item?.lastMessage?.createdAt
                          )}
                        </span>
                        {item?.user?.name}
                      </h5>
                      <p className="mb-0 text-muted font-14">
                        {item?.lastMessage?.text ? (
                          <div
                            className="user-last-chat"
                            style={{
                              textTransform: "capitalize",
                              color: "#000",
                              fontSize: 12,
                            }}
                          >
                            {item?.lastMessage?.text.substring(0, 90)}
                          </div>
                        ) : (
                          <span
                            style={{
                              textTransform: "capitalize",
                              color: "#000",
                              fontSize: 12,
                            }}
                          >
                            {item?.user?.name}
                            {" : "}
                            <Image size={14} color="#000" /> Photo
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
                {individualChatList.length < 1 && (
                  <p className="text-center mt-4">No Chats</p>
                )}
              </div>
            ) : (
              <div>
                {groupChatList?.map((item) => (
                  <div
                    className={
                      item.lastMessage.recipientID ==
                      selectedStudent?.lastMessage?.recipientID
                        ? "py_6 media active"
                        : "py_6 media"
                    }
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setGroupChatOffset(0);
                      setChatDetails([]);
                      setSelectedStudent(item);
                      getGroupDetails(item.lastMessage.recipientID);
                    }}
                  >
                    <img
                      src={defaultImg}
                      className="me-1 rounded-circle chatgroupimg"
                      alt=""
                    />
                    <div className="media-body">
                      <h5
                        className="mt-0 mb-0 font-14"
                        style={{ textTransform: "capitalize" }}
                      >
                        <span
                          className="float-end text-muted font-weight-normal font-12"
                          style={{ fontSize: 10 }}
                        >
                          {formatWhatsAppMessageTime(
                            item?.lastMessage?.createdAt
                          )}
                        </span>
                        {item?.title}
                      </h5>
                      <p className="mb-0 text-muted font-14">
                        {item?.lastMessage?.text ? (
                          <div
                            className="user-last-chat"
                            style={{
                              textTransform: "capitalize",
                              color: "#000",
                              fontSize: 12,
                            }}
                          >
                            {item?.lastMessage?.text.substring(0, 90)}
                          </div>
                        ) : (
                          <span
                            style={{
                              textTransform: "capitalize",
                              color: "#000",
                              fontSize: 12,
                            }}
                          >
                            {item?.user?.name}
                            {" : "}
                            <Image size={14} color="#000" /> Photo
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
                {groupChatList.length < 1 && (
                  <p className="text-center mt-4">No Chats</p>
                )}
              </div>
            )}
          </div>
        </div>
      </Col>

      <Col md="8" lg="8">
        <div className="card" style={{ height: "520px", marginBottom: 0 }}>
          <div className="card-body py-1 px-1 border-bottom border-light">
            {selectedStudent?.user && (
              <div className="media align-items-center p-0">
                <img
                  onClick={() => console.log(selectedStudent)}
                  src={
                    selectedTab == 1 && selectedStudent?.user?.profileImage
                      ? API_BASE_URL + "/" + selectedStudent?.user?.profileImage
                      : defaultImg
                  }
                  className="me-1 rounded-circle groupactiveimg"
                  alt=""
                />
                <div className="media-body">
                  <h5
                    className="mt-0 mb-0 font-15"
                    style={{ textTransform: "capitalize" }}
                  >
                    {selectedTab == 1
                      ? selectedStudent?.user?.name
                      : selectedStudent?.title}
                  </h5>
                  {/* <p className="mb-0 text-muted font-12">Online</p> */}
                </div>
              </div>
            )}
          </div>
          <div className="card-body p-0">
            <ul
              className="conversation-list pt-2 mb-0 pb-5"
              style={{ overflow: "scroll", height: "450px" }}
              onScroll={(e) => e.target.scrollTop < 240 && loadMoreMessage()}
              ref={chatContainerRef}
            >
              {selectedTab == 1
                ? chatDetails.map((item, index) =>
                    item.senderID == selectedStudent?.user?.userID ? (
                      <>
                        {item.type == "request-free-lesson" ? (
                          <FreeLessonUI
                            item={item}
                            index={index}
                            studentInfo={selectedStudent}
                          />
                        ) : (
                          <li key={index} className="clearfix">
                            <div className="chat-avatar groupchatimg">
                              <img
                                src={
                                  selectedStudent?.user?.profileImage
                                    ? API_BASE_URL +
                                      "/" +
                                      selectedStudent?.user?.profileImage
                                    : defaultImg
                                }
                                className="rounded"
                                alt=""
                              />
                            </div>
                            <div className="conversation-text">
                              <div className="ctext-wrap">
                                <i style={{ textTransform: "capitalize" }}>
                                  {selectedStudent?.user?.name}
                                </i>
                                {item.text && <p>{item.text}</p>}

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

                                <span
                                  style={{ fontSize: 10, display: "block" }}
                                >
                                  {formatWhatsAppMessageTime(item.createdAt)}
                                </span>
                              </div>
                            </div>
                          </li>
                        )}
                      </>
                    ) : (
                      <li key={index} className="clearfix odd">
                        <div className="chat-avatar">
                          <img
                            src={
                              teacherInfo?.profileImage
                                ? API_BASE_URL + "/" + teacherInfo?.profileImage
                                : defaultImg
                            }
                            className="rounded"
                            alt=""
                          />
                        </div>
                        <div className="conversation-text">
                          <div className="ctext-wrap">
                            <i style={{ textTransform: "capitalize" }}>
                              {teacherInfo.name}
                            </i>
                            {item.text && <p>{item.text}</p>}
                            {/* {item.file && <RenderImage file={item.file} />} */}

                            {item?.files && (
                              <div
                                style={{
                                  gap: 10,
                                  display: "flex",
                                  flexWrap: "wrap",
                                  maxWidth: "410px",
                                }}
                              >
                                {item?.files.map((elm) => (
                                  <RenderImage file={elm} />
                                ))}
                              </div>
                            )}

                            <span style={{ fontSize: 10, display: "block" }}>
                              {formatWhatsAppMessageTime(item.createdAt)}
                            </span>
                          </div>
                        </div>
                      </li>
                    )
                  )
                : chatDetails.map((item, index) =>
                    item.senderID == teacherInfo?.userID ? (
                      <li key={index} className="clearfix odd">
                        <div className="chat-avatar">
                          <img
                            src={
                              teacherInfo?.profileImage
                                ? API_BASE_URL + "/" + teacherInfo?.profileImage
                                : defaultImg
                            }
                            className="rounded"
                            alt=""
                          />
                        </div>
                        <div className="conversation-text">
                          <div className="ctext-wrap">
                            <i style={{ textTransform: "capitalize" }}>
                              {teacherInfo?.name}
                            </i>
                            {item.text && <p>{item.text}</p>}
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

                            <span style={{ fontSize: 10, display: "block" }}>
                              {formatWhatsAppMessageTime(item.createdAt)}
                            </span>
                          </div>
                        </div>
                      </li>
                    ) : (
                      <li
                        key={index}
                        className="clearfix"
                        onClick={() => console.log(item)}
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
                        </div>
                        <div className="conversation-text">
                          <div className="ctext-wrap">
                            <i style={{ textTransform: "capitalize" }}>
                              {item?.user?.name}
                            </i>
                            {item.text && <p>{item.text}</p>}
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

                            <span style={{ fontSize: 10, display: "block" }}>
                              {formatWhatsAppMessageTime(item.createdAt)}
                            </span>
                          </div>
                        </div>
                      </li>
                    )
                  )}

              <button className="scrollBtn" onClick={handleScroll}>
                <ArrowDown className="tableicon" />
              </button>
            </ul>
          </div>
        </div>
      </Col>
    </Row>
  );
};
export default Comments;
