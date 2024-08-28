import { API_BASE_URL, apiRequest } from "../../../utility/apiRequest";
import { Button, Modal, ModalBody } from "reactstrap";
import React, { useContext, useEffect, useState } from "react";

import DataTable from "react-data-table-component";
import LoadingContext from "../../../utility/context/LoadingContext";
import { XCircle } from "react-feather";
import defaultImg from "../../../assets/images/default.jpg";
import moment from "moment/moment";
import toast from "react-hot-toast";

function TeacherTable() {
  const { setLoading } = useContext(LoadingContext);
  const [requestList, setRequestList] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    getContents();
  }, []);

  const getContents = async () => {
    setPageLoading(true);
    let data = {};
    const resp = await apiRequest._getDeleteRequest("teacher");
    setPageLoading(false);

    if (resp.status) {
      setRequestList(resp.data);
    } else {
      setRequestList([]);
    }
  };

  const deleteAccount = async () => {
    setLoading(true);
    const resp = await apiRequest._deleteUserAccount(
      selectedUser.userID,
      "teacher"
    );
    setLoading(false);

    if (resp.status) {
      toast.success(resp.message);
    } else {
      toast.error(resp.message);
    }
  };

  return (
    <>
      <DataTable
        noHeader
        data={requestList}
        progressPending={pageLoading}
        columns={[
          {
            name: "Teacher",
            minWidth: "220px",
            selector: (row) => row.user.name,
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
                    row.user.profileImage
                      ? API_BASE_URL + "/" + row.user.profileImage
                      : defaultImg
                  }
                />
                <span style={{ textTransform: "capitalize" }}>
                  {row.user.name}
                </span>
              </>
            ),
          },

          {
            name: "Message",
            minWidth: "160px",
            selector: (row) => row.reason,
            sortable: true,
            cell: (row) => row.reason,
          },
          {
            name: "Contact Details  ",
            minWidth: "160px",
            selector: (row) => row.user.email,
            sortable: true,
            cell: (row) => (
              <div>
                <span className="d-flex" style={{ whiteSpace: "nowrap" }}>
                  Call
                  <a
                    href={`tel: ${
                      row.user.phone?.countryCode + row.user.phone?.number
                    }`}
                    className="d-block ms-1"
                  >
                    {[row.user.phone?.countryCode, " ", row.user.phone?.number]}
                  </a>
                </span>
                <span className="d-flex" style={{ whiteSpace: "nowrap" }}>
                  Email
                  <a href={`mailto:${row.user.email}`} className="d-block ms-1">
                    {row.user.email}
                  </a>
                </span>
              </div>
            ),
          },
          {
            name: "Date",
            minWidth: "140px",
            selector: (row) => row.data,
            sortable: true,
            cell: (row) => moment(row.data).format("lll"),
          },
          {
            name: "Actions",
            minWidth: "90px",
            cell: (row) => (
              <Button
                onClick={() => {
                  setModalOpen(true);
                  setSelectedUser(row);
                }}
                className="tablebtndelete"
              >
                Approve
              </Button>
            ),
          },
        ]}
        className="react-dataTable paddingbox"
        defaultSortField="name"
        pagination
      />

      <Modal
        centered
        isOpen={modalOpen}
        toggle={() => {
          setSelectedUser({});
          setModalOpen(false);
        }}
      >
        <ModalBody className="p-3">
          <div className="deleteModal text-center">
            <XCircle className="deletemodal_icon" />
            <h2>Are You Sure ?</h2>
            <p>You will not be able to recover the deleted record!</p>
            <div className="btn-cancel-ok">
              <Button
                className="btn-cancel me-1"
                onClick={() => {
                  setSelectedUser({});
                  setModalOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button className="btn-ok" onClick={deleteAccount}>
                OK
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default TeacherTable;
