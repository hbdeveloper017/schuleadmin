import { API_BASE_URL } from "../../../../../utility/apiRequest";
import React from "react";
import defaultImg from "../../../../../assets/images/default.jpg";
import formatWhatsAppMessageTime from "../../../../../utility/formatWhatsAppMessageTime";
import moment from "moment";

function FreeLessonUI({ item, index, studentInfo }) {
  return (
    <li key={index} className="clearfix">
      <div className="chat-avatar groupchatimg">
        <img
          src={
            studentInfo?.user?.profileImage
              ? API_BASE_URL + "/" + studentInfo?.user?.profileImage
              : defaultImg
          }
          className="rounded"
          alt=""
        />
      </div>
      <div className="conversation-text">
        <div className="ctext-wrap">
          <div
            className="requestedLesson"
            key={index}
            onClick={() => console.log(item)}
          >
            <p>Requested Free Lesson</p>
            <div className="d-flex justify-content-between">
              <h5>
                <span className="title">Subject</span>
                <span>{item?.lessonRequest?.subject?.name}</span>
              </h5>
              <h5>
                <span className="title">Duration</span>
                <span>{item?.lessonRequest?.duration} Mins</span>
              </h5>
            </div>
            <div className="d-flex justify-content-between">
              <h5>
                <span className="title">Date & Time</span>
                <span>{moment(item?.lessonRequest?.date).format("lll")}</span>
              </h5>
            </div>
            <div className="d-flex justify-content-between">
              <h5>
                <span
                  style={{
                    textTransform: "capitalize",
                    color: "#ff5f20",
                  }}
                >
                  Status : {item?.lessonRequest?.status}
                </span>
              </h5>
            </div>
            <div className="chat-time">
              <span
                style={{
                  fontSize: 10,
                  color: "#7c8691",
                  textAlign: "left",
                }}
              >
                {formatWhatsAppMessageTime(item?.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export default FreeLessonUI;
