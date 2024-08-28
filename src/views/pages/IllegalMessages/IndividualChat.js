import { API_BASE_URL, apiRequest } from "../../../utility/apiRequest";
import React, { useContext, useEffect, useState } from "react";

import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import LoadingContext from "../../../utility/context/LoadingContext";
import { Trash } from "react-feather";
import defaultImg from "../../../assets/images/default.jpg";
import moment from "moment/moment";
import toast from "react-hot-toast";

function IndividualChat() {
  const [messages, setMessages] = useState([]);
  const { setLoading } = useContext(LoadingContext);
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    getContents();
  }, []);

  const getContents = async () => {
    setPageLoading(true);
    const resp = await apiRequest._illegalMessages();
    setPageLoading(false);

    if (resp.status) {
      setMessages(resp.data);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    const resp = await apiRequest._deleteIllegalMessage(id, "chat");
    setLoading(false);

    if (resp.status) {
      toast.success(resp.message);
      getContents();
    } else {
      toast.error(resp.message);
    }
  };

  return (
    <DataTable
      noHeader
      data={messages}
      progressPending={pageLoading}
      columns={[
        {
          name: "Sender",
          minWidth: "220px",
          selector: (row) => row.sender.name,
          sortable: true,
          cell: (row) => (
            <>
              <img
                style={{
                  width: 46,
                  minWidth: 46,
                  height: 46,
                  padding: 0,
                  objectFit: "cover",
                }}
                className="table_img rounded-circle img-thumbnail me-1"
                src={
                  row.sender.profileImage
                    ? API_BASE_URL + "/" + row.sender.profileImage
                    : defaultImg
                }
              />
              <span style={{ textTransform: "capitalize" }}>
                {row.sender.name}
              </span>
            </>
          ),
        },
        {
          name: "Receiver",
          minWidth: "170px",
          selector: (row) => row.recipient.name,
          sortable: true,
          cell: (row) => (
            <>
              <img
                style={{
                  width: 46,
                  minWidth: 46,
                  height: 46,
                  padding: 0,
                  objectFit: "cover",
                }}
                className="table_img rounded-circle img-thumbnail me-1"
                src={
                  row.recipient.profileImage
                    ? API_BASE_URL + "/" + row.recipient.profileImage
                    : defaultImg
                }
              />
              <span style={{ textTransform: "capitalize" }}>
                {row.recipient.name}
              </span>
            </>
          ),
        },
        {
          name: "Message",
          minWidth: "160px",
          selector: (row) => row.originalText,
          sortable: true,
          cell: (row) => row.originalText,
        },
        {
          name: "Date",
          minWidth: "140px",
          selector: (row) => row?.createdAt,
          sortable: true,
          cell: (row) => moment(row?.createdAt).format("DD-MMM-yyyy"),
        },
        {
          name: "Action",
          minWidth: "140px",
          selector: (row) => row,
          sortable: true,
          cell: (row) => (
            <div className="d-flex align-items-center">
              <Link to={"individual-chat-details"} state={{ msgInfo: row }}>
                View Chat
              </Link>
              <span className="mx-1">|</span>
              <Link onClick={() => handleDelete(row._id)}>
                <Trash />
              </Link>
            </div>
          ),
        },
      ]}
      className="react-dataTable paddingbox"
      defaultSortField="name"
      pagination
    />
  );
}

export default IndividualChat;
