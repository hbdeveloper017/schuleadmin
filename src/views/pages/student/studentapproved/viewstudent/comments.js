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

const Comments = ({ studentInfo }) => {
  const chatContainerRef = useRef();
  const [individualChatList, setIndividualChatList] = useState([]);
  const [groupChatList, setGroupChatList] = useState([]);
  const [chatDetails, setChatDetails] = useState([]);
  const [chatCount, setChatCount] = useState(0);
  const [selectedTab, setSelectedTab] = useState(1);
  const [selectedTeacher, setSelectedTeacher] = useState({});
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
    const resp = await apiRequest._getIndividualChatList(studentInfo.userID, {
      role: "student",
      offset: 0,
      limit: 1000,
    });

    if (resp.status) {
      setIndividualChatList(resp.data.list);
      setIndividualOffset(individualOffset + 1);
    }
  };

  const getGroupChatList = async () => {
    const resp = await apiRequest._getChatGroupList(studentInfo.userID, {
      role: "student",
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
      studentInfo.userID,
      otherUserID,
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
      }, 100);
    } else {
      setChatDetails([]);
    }
  };

  const getGroupDetails = async (groupID) => {
    setChatDetails([]);

    const resp = await apiRequest._getChatGroupDetails(
      studentInfo.userID,
      groupID,
      {
        offset: 0,
        limit: 1000,
      }
    );

    if (resp.status) {
      console.log(resp.data.list.length);

      setChatDetails(resp.data.list.reverse());
      setChatCount(resp.data.count);

      setTimeout(() => {
        handleScroll();
      }, 100);
    } else {
      setChatDetails([]);
    }
  };

  const loadMoreMessage = async () => {
    if (chatDetails.length < chatCount) {
      if (selectedTab == 1) {
        const resp = await apiRequest._getIndividualChatDetails(
          studentInfo.userID,
          selectedTeacher.user.userID,
          {
            offset: individualChatOffset + 1,
            limit: 1000,
          }
        );

        if (resp.status) {
          const newData = [...resp.data.list.reverse(), ...chatDetails];
          setChatDetails(newData);
          setIndividualChatOffset(individualChatOffset + 1);
        }
      } else {
        const resp = await apiRequest._getChatGroupDetails(
          studentInfo.userID,
          selectedTeacher.lastMessage.recipientID,
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
                setSelectedTeacher({});
                setChatDetails([]);
                setSelectedTab(1);
              }}
              className={selectedTab == 1 && "active"}
            >
              Individual
            </button>
            <button
              onClick={() => {
                setSelectedTeacher({});
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
                      item.user.userID == selectedTeacher?.user?.userID
                        ? "py_6 media active"
                        : "py_6 media"
                    }
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setChatDetails([]);
                      setGroupChatOffset(0);
                      setSelectedTeacher(item);
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
                          style={{ fontSize: 10, textTransform: "capitalize" }}
                        >
                          {formatWhatsAppMessageTime(
                            item?.lastMessage?.createdAt
                          )}
                        </span>
                        {item?.user?.name}
                      </h5>
                      <p className="mb-0 text-muted font-14">
                        {item?.lastMessage?.text ? (
                          <div className="user-last-chat">
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
                      selectedTeacher?.lastMessage?.recipientID
                        ? "py_6 media active"
                        : "py_6 media"
                    }
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setGroupChatOffset(0);
                      setChatDetails([]);
                      setSelectedTeacher(item);
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
                          <div className="user-last-chat">
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
            {selectedTeacher?.user && (
              <div className="media align-items-center p-0">
                <img
                  src={
                    selectedTab == 1 && selectedTeacher?.user?.profileImage
                      ? API_BASE_URL + "/" + selectedTeacher?.user?.profileImage
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
                      ? selectedTeacher?.user?.name
                      : selectedTeacher?.title}
                  </h5>
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
                    item.senderID == selectedTeacher?.user?.userID ? (
                      <React.Fragment>
                        <li key={index} className="clearfix">
                          <div className="chat-avatar groupchatimg">
                            <img
                              src={
                                selectedTeacher?.user?.profileImage
                                  ? API_BASE_URL +
                                    "/" +
                                    selectedTeacher?.user?.profileImage
                                  : defaultImg
                              }
                              className="rounded"
                              alt=""
                            />
                          </div>
                          <div className="conversation-text">
                            <div className="ctext-wrap">
                              {item.text && <p className="pt-0">{item.text}</p>}

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
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        {item.type == "request-free-lesson" ? (
                          <FreeLessonUI
                            item={item}
                            index={index}
                            studentInfo={studentInfo}
                          />
                        ) : (
                          <li key={index} className="clearfix odd">
                            <div className="chat-avatar">
                              <img
                                src={
                                  studentInfo?.profileImage
                                    ? API_BASE_URL +
                                      "/" +
                                      studentInfo?.profileImage
                                    : defaultImg
                                }
                                className="rounded"
                                alt=""
                              />
                            </div>
                            <div className="conversation-text">
                              <div className="ctext-wrap">
                                {item.text && <p>{item.text}</p>}

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
                      </React.Fragment>
                    )
                  )
                : chatDetails.map((item, index) =>
                    item.senderID == studentInfo?.userID ? (
                      <li key={index} className="clearfix odd">
                        <div className="chat-avatar">
                          <img
                            src={
                              studentInfo?.profileImage
                                ? API_BASE_URL + "/" + studentInfo?.profileImage
                                : defaultImg
                            }
                            className="rounded"
                            alt=""
                          />
                        </div>
                        <div className="conversation-text">
                          <div className="ctext-wrap">
                            <i style={{ textTransform: "capitalize" }}>
                              {studentInfo?.name}
                            </i>
                            {item.text && <p>{item.text}</p>}

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
