import { API_BASE_URL, apiRequest } from "../../../../utility/apiRequest";
import { Button, Col, Modal, ModalBody, Row } from "reactstrap";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Trash, XCircle } from "react-feather";

import DataTable from "react-data-table-component";
import FilterComponent from "./FilterComponent";
import LoadingContext from "../../../../utility/context/LoadingContext";
import { Tooltip } from "react-tooltip";
import avatar1 from "@src/assets/images/img/notificationicon1.jpg";
import moment from "moment";
import toast from "react-hot-toast";

const Table = (props) => {
  const [notifications, setNotifications] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const { setLoading } = useContext(LoadingContext);

  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    setPageLoading(true);

    const resp = await apiRequest._getNotifications();

    setPageLoading(false);

    if (resp.status) {
      setNotifications(resp.data);
      setFilterData(resp.data);
      setLoading(false);
    } else {
      setNotifications([]);
      setFilterData([]);
      setLoading(false);
    }
  };
  const columns = [
    {
      name: "Title",
      minWidth: "290px",
      selector: (row) => row.title,
      sortable: true,
      cell: (row) => (
        <>
          <img
            className="table_img rounded-circle img-thumbnail me-1"
            src={row.image ? API_BASE_URL + "/" + row.image : avatar1}
          />
          {row.title}
        </>
      ),
    },
    {
      name: "Description",
      minWidth: "400px",
      selector: (row) => row.content,
      sortable: true,
      cell: (row) => row.content,
    },

    {
      name: "Type",
      minWidth: "130px",
      selector: (row) => row.recipientType,
      sortable: true,
      cell: (row) => (row.recipientType ? row.recipientType : "-"),
    },
    {
      name: "Receiver",
      minWidth: "170px",
      selector: (row) => row?.users[0]?.name,
      sortable: true,
      cell: (row) => (
        <>
          {row.recipientType ? (
            "-"
          ) : (
            <div className="tooltipWrapper">
              <Tooltip
                id={row._id}
                place="top"
                style={{
                  backgroundColor: "#797d8c",
                  color: "#fff",
                  fontWeight: 600,
                }}
              >
                <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                  {row?.users.slice(1).map((item, i) => (
                    <li key={i}>{item.name}</li>
                  ))}
                </ul>
              </Tooltip>

              {row?.users[0]?.name}
              <a
                style={{
                  lineHeight: "18px",
                  fontSize: 13,
                  whiteSpace: "nowrap",
                  fontWeight: 600,
                  color: "#FF6020",
                }}
                data-tooltip-id={row._id}
              >
                {[" ", row.users?.length > 1 && `+${row.users?.length - 1}`]}
              </a>
            </div>
          )}
        </>
      ),
    },

    {
      name: "Date",
      minWidth: "130px",
      selector: (row) => row.createdAt,
      sortable: true,
      cell: (row) => moment(row.createdAt).format("DD MMM yyyy"),
    },
    {
      name: "Actions",
      minWidth: "120px",
      cell: (row) => (
        <div className="tableaction">
          <>
            <Button className="tablebtndelete" onClick={() => toggle2(row._id)}>
              <Trash className="tableicon" />
            </Button>
          </>
        </div>
      ),
    },
  ];

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);

  const subHeaderComponent = useMemo(() => {
    return (
      <FilterComponent
        onFilter={(e) => {
          setFilterText(e.target.value);
          let newData = filterData.filter((item) =>
            item.title.toLowerCase().includes(e.target.value.toLowerCase())
          );
          setNotifications(newData);
        }}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);
  const [modal2, setModal2] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const toggle2 = async (id) => {
    if (id) {
      setDeleteId(id);
      setModal2(!modal2);
    } else {
      setModal2(!modal2);
      setDeleteId("");
    }
  };
  const deleteNotification = async () => {
    if (deleteId) {
      setLoading(true);
      const resp = await apiRequest._deleteNotification(deleteId);

      if (resp.status) {
        toast.success(resp.message);
        setModal2(!modal2);
        setLoading(false);
      } else {
        toast.error(resp.message);
        setLoading(false);
      }
    }
  };

  return (
    <React.Fragment>
      <DataTable
        noHeader
        columns={columns}
        progressPending={pageLoading}
        className="react-dataTable paddingbox"
        data={notifications}
        defaultSortField="name"
        pagination
        subHeader
        subHeaderComponent={subHeaderComponent}
      />
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
              <Button className="btn-ok" onClick={deleteNotification}>
                OK
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default Table;
