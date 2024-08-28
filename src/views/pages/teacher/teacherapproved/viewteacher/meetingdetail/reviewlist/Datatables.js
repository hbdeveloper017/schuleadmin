import "react-tooltip/dist/react-tooltip.css";

import {
  API_BASE_URL,
  apiRequest,
} from "../../../../../../../utility/apiRequest";
import { Button, Col, Modal, ModalBody, Row } from "reactstrap";
import { Edit, Eye, Frown, Meh, Smile, Trash, XCircle } from "react-feather";
import React, { useEffect, useMemo, useState } from "react";

import DataTable from "react-data-table-component";
import FilterComponent from "./FilterComponent";
import { Link, useLocation } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import defaultImg from "../../../../../../../assets/images/default.jpg";
import moment from "moment";
import toast from "react-hot-toast";

const Table = (props) => {
  const { state } = useLocation();

  const [teacherList, setTeacherList] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [filterText, setFilterText] = React.useState("");
  const [selectedUser, setSelectedUser] = useState({});
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);

  const [modal2, setModal2] = useState(false);
  const toggle2 = () => setModal2(!modal2);

  useEffect(() => {
    getStudentList();
  }, []);

  const getStudentList = async () => {
    const resp = await apiRequest._getMeetingReviewList(
      state.teacherInfo.userID,
      state.meetingInfo._id
    );
    // const resp = await apiRequest._getUserList(payload);
    if (resp.status) {
      setTeacherList(resp.data);
      setFilterData(resp.data);
    }
  };

  const deleteUser = async () => {
    const resp = await apiRequest._deleteUser(selectedUser.userID, "teacher");

    if (resp.status) {
      setSelectedUser({});
      toast.success(resp.message);
      getStudentList();
    } else {
      toast.error(resp.message);
    }
  };

  const subHeaderComponent = useMemo(() => {
    return (
      <FilterComponent
        onFilter={(e) => {
          setFilterText(e.target.value);
          let newData = filterData.filter(
            (item) =>
              item.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
              item.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
              item.address
                .toLowerCase()
                .includes(e.target.value.toLowerCase()) ||
              item.phone.number
                .toLowerCase()
                .includes(e.target.value.toLowerCase()) ||
              item.status.toLowerCase().includes(e.target.value.toLowerCase())
          );
          setTeacherList(newData);
        }}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  return (
    <React.Fragment>
      <DataTable
        // noHeader
        data={teacherList}
        columns={[
          {
            name: "Name",
            minWidth: "190px",
            selector: (row) => row.imgurl,
            sortable: true,
            cell: (row) => (
              <>
                <img
                  className="table_img rounded-circle img-thumbnail me-1"
                  src={
                    row.profileImage
                      ? API_BASE_URL + "/" + row.profileImage
                      : defaultImg
                  }
                />
                <span style={{ textTransform: "capitalize" }}>{row.name}</span>
              </>
            ),
          },
          // {
          //   name: "Email",
          //   minWidth: "138px",
          //   selector: (row) => row.email,
          //   sortable: true,
          //   cell: (row) => row.email,
          // },
          {
            name: "Review",
            minWidth: "650px",
            selector: (row) => row.status,
            sortable: true,
            cell: (row) => row.review,
          },
          {
            name: "Rating",
            minWidth: "80px",
            selector: (row) => row.status,
            sortable: true,
            cell: (row) => (
              <a>
                {row?.rating == 1 && <Frown color="#FF6020" size="20" />}
                {row?.rating == 2 && <Meh color="#FF6020" size="20" />}
                {row?.rating == 3 && <Smile color="#FF6020" size="20" />}
                {row?.rating == 4 && (
                  <svg width="24" height="24" viewBox="0 0 114 114" fill="none">
                    <path
                      d="M68.21 67.5925C65.0347 70.1526 61.0788 71.5487 57 71.5487C52.9212 71.5487 48.9653 70.1526 45.79 67.5925C44.82 66.7862 43.5694 66.3983 42.3134 66.5142C41.0574 66.63 39.8988 67.24 39.0925 68.21C38.2863 69.18 37.8984 70.4306 38.0142 71.6866C38.13 72.9427 38.74 74.1012 39.71 74.9075C44.5614 78.9574 50.6804 81.1758 57 81.1758C63.3196 81.1758 69.4387 78.9574 74.29 74.9075C75.2601 74.1012 75.8701 72.9427 75.9859 71.6866C76.1017 70.4306 75.7138 69.18 74.9075 68.21C74.5083 67.7297 74.0184 67.3327 73.4658 67.0417C72.9131 66.7508 72.3086 66.5715 71.6867 66.5142C70.4306 66.3983 69.1801 66.7862 68.21 67.5925ZM43.7475 50.065C44.6375 50.9497 45.8414 51.4463 47.0963 51.4463C48.3512 51.4463 49.5551 50.9497 50.445 50.065C51.3297 49.175 51.8263 47.9711 51.8263 46.7163C51.8263 45.4614 51.3297 44.2575 50.445 43.3675C47.7267 40.7882 44.1223 39.3503 40.375 39.3503C36.6278 39.3503 33.0233 40.7882 30.305 43.3675C29.8078 43.7933 29.4039 44.3173 29.1188 44.9066C28.8337 45.496 28.6735 46.1378 28.6482 46.792C28.623 47.4462 28.7332 48.0985 28.972 48.708C29.2108 49.3176 29.573 49.8712 30.0359 50.3341C30.4988 50.797 31.0524 51.1592 31.662 51.398C32.2715 51.6368 32.9239 51.7471 33.578 51.7218C34.2322 51.6965 34.8741 51.5363 35.4634 51.2512C36.0527 50.9661 36.5767 50.5622 37.0025 50.065C37.4441 49.6198 37.9694 49.2664 38.5483 49.0253C39.1271 48.7841 39.748 48.66 40.375 48.66C41.0021 48.66 41.6229 48.7841 42.2018 49.0253C42.7806 49.2664 43.3059 49.6198 43.7475 50.065ZM83.695 43.3675C80.9767 40.7882 77.3723 39.3503 73.625 39.3503C69.8778 39.3503 66.2733 40.7882 63.555 43.3675C62.7768 44.2762 62.3702 45.445 62.4164 46.6405C62.4626 47.836 62.9581 48.97 63.8041 49.8159C64.65 50.6619 65.7841 51.1575 66.9795 51.2036C68.175 51.2498 69.3438 50.8432 70.2525 50.065C70.6941 49.6198 71.2195 49.2664 71.7983 49.0253C72.3771 48.7841 72.998 48.66 73.625 48.66C74.2521 48.66 74.8729 48.7841 75.4518 49.0253C76.0306 49.2664 76.5559 49.6198 76.9975 50.065C77.8875 50.9497 79.0914 51.4463 80.3463 51.4463C81.6012 51.4463 82.8051 50.9497 83.695 50.065C84.5797 49.175 85.0763 47.9711 85.0763 46.7163C85.0763 45.4614 84.5797 44.2575 83.695 43.3675ZM57 9.5C47.6054 9.5 38.4218 12.2858 30.6104 17.5052C22.7991 22.7246 16.7109 30.143 13.1157 38.8225C9.52058 47.502 8.57992 57.0527 10.4127 66.2668C12.2455 75.4809 16.7695 83.9446 23.4124 90.5876C30.0554 97.2306 38.5191 101.755 47.7332 103.587C56.9473 105.42 66.498 104.479 75.1775 100.884C83.857 97.2891 91.2755 91.2009 96.4948 83.3896C101.714 75.5783 104.5 66.3946 104.5 57C104.5 50.7622 103.271 44.5855 100.884 38.8225C98.4972 33.0596 94.9984 27.8232 90.5876 23.4124C86.1768 19.0016 80.9405 15.5028 75.1775 13.1157C69.4145 10.7286 63.2378 9.5 57 9.5ZM57 95C49.4843 95 42.1374 92.7713 35.8884 88.5958C29.6393 84.4203 24.7687 78.4856 21.8926 71.542C19.0165 64.5984 18.2639 56.9578 19.7302 49.5866C21.1964 42.2153 24.8156 35.4443 30.13 30.1299C35.4444 24.8155 42.2153 21.1964 49.5866 19.7302C56.9579 18.2639 64.5984 19.0164 71.542 21.8926C78.4856 24.7687 84.4204 29.6393 88.5959 35.8883C92.7714 42.1374 95 49.4843 95 57C95 67.0782 90.9965 76.7437 83.8701 83.8701C76.7437 90.9964 67.0782 95 57 95Z"
                      fill="#FF6020"
                    />
                  </svg>
                )}
              </a>
            ),
          },
        ]}
        className="react-dataTable paddingbox"
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
              <Button
                className="btn-ok"
                onClick={() => {
                  toggle2();
                  deleteUser();
                }}
              >
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
