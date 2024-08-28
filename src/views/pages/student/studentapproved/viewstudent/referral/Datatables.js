import { API_BASE_URL, apiRequest } from "../../../../../../utility/apiRequest";
import {
  Button,
  Col,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  Row,
} from "reactstrap";
import { Edit, Eye, Info, Trash, XCircle } from "react-feather";
import React, { useEffect, useMemo, useState } from "react";

import DataTable from "react-data-table-component";
import FilterComponent from "./FilterComponent";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import defaultImg from "../../../../../../assets/images/default.jpg";
import moment from "moment";
import toast from "react-hot-toast";

const Table = ({ studentInfo }) => {
  const [studentList, setStudentList] = useState([]);

  const [filterData, setFilterData] = useState([]);
  const [modal2, setModal2] = useState(false);
  const [filterText, setFilterText] = React.useState("");
  const [selectedUser, setSelectedUser] = useState({});
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const [subjects, setSubjects] = useState([]);

  const toggle2 = () => setModal2(!modal2);

  useEffect(() => {
    getStudentList();
  }, [subjects]);

  const getStudentList = async () => {
    const payload = {
      role: "student",
      type: "approved",
    };
    if (subjects.length > 0) payload["subjects"] = subjects;

    const resp = await apiRequest._getReferral(studentInfo.userID);

    if (resp.status) {
      setStudentList(resp.data);
      setFilterData(resp.data);
    } else {
      setStudentList([]);
      setFilterData([]);
    }
  };

  const deleteUser = async () => {
    const resp = await apiRequest._deleteUser(selectedUser.userID, "student");

    if (resp.status) {
      toast.success(resp.message);
      getStudentList();
      setSelectedUser({});
    } else {
      toast.error(resp.message);
    }
  };

  const subHeaderComponent = useMemo(() => {
    return (
      <FilterComponent
        onSubjectChange={(e) => {
          setSubjects(e.map((e) => e?.value));
        }}
        onFilter={(e) => {
          setFilterText(e.target.value);
          let newData = filterData.filter(
            (item) =>
              item.studentFirstName
                .toLowerCase()
                .includes(e.target.value.toLowerCase()) ||
              item.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
              item.grade.name
                .toLowerCase()
                .includes(e.target.value.toLowerCase()) ||
              item.school.name
                .toLowerCase()
                .includes(e.target.value.toLowerCase()) ||
              item.status.toLowerCase().includes(e.target.value.toLowerCase())
          );
          setStudentList(newData);
        }}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  return (
    <React.Fragment>
      <DataTable
        noHeader
        data={studentList}
        columns={[
          {
            name: "Name",
            minWidth: "220px",
            selector: (row) => row.profileImage,
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
                <span style={{ textTransform: "capitalize" }}>
                  {[row.name]}
                </span>
              </>
            ),
          },
          {
            name: "Email",
            minWidth: "170px",
            selector: (row) => row.email,
            sortable: true,
            cell: (row) => row.email,
          },
          {
            name: "Phone No.",
            minWidth: "160px",
            selector: (row) => row.phone,
            sortable: true,
            cell: (row) => row.phone.countryCode + " " + row.phone.number,
          },
          {
            name: "Fullfilled Date",
            minWidth: "160px",
            selector: (row) => row.phone,
            sortable: true,
            cell: (row) =>
              row.fulfilledDate
                ? moment(row.fulfilledDate).format("DD MMM yyyy")
                : "-",
          },

          {
            name: "Status",
            minWidth: "80px",
            selector: (row) => row.status,
            sortable: true,
            cell: (row) => (
              <span
                className={
                  row.status == "active" ? "Active badge" : "Inactive badge"
                }
                style={{ textTransform: "capitalize" }}
              >
                {row.referStatus}
              </span>
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
