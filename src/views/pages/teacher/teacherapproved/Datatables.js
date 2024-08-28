import "react-tooltip/dist/react-tooltip.css";

import { API_BASE_URL, apiRequest } from "../../../../utility/apiRequest";
import { Button, Col, Modal, ModalBody, Row } from "reactstrap";
import { Edit, Eye, Trash, XCircle } from "react-feather";
import React, { useEffect, useMemo, useState } from "react";

import DataTable from "react-data-table-component";
import FilterComponent from "./FilterComponent";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import defaultImg from "../../../../assets/images/default.jpg";
import moment from "moment";
import toast from "react-hot-toast";

const Table = (props) => {
  const [teacherList, setTeacherList] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [filterText, setFilterText] = React.useState("");
  const [selectedUser, setSelectedUser] = useState({});
  const [pageLoading, setPageLoading] = useState(false);
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);

  const [modal2, setModal2] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const toggle2 = () => setModal2(!modal2);

  useEffect(() => {
    getStudentList();
  }, [subjects]);

  const getStudentList = async () => {
    setPageLoading(true);
    const payload = {
      role: "teacher",
      type: "approved",
    };
    if (subjects.length > 0) payload["subjects"] = subjects;

    const resp = await apiRequest._getUserList(payload);
    setPageLoading(false);
    if (resp.status) {
      setTeacherList(resp.data);
      setFilterData(resp.data);
    } else {
      setTeacherList([]);
      setFilterData([]);
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
        onSubjectChange={(e) => {
          setSubjects(e.map((e) => e?.value));
        }}
        onFilter={(e) => {
          setFilterText(e.target.value);
          let newData = filterData.filter(
            (item) =>
              item.firstName
                .toLowerCase()
                .includes(e.target.value.toLowerCase()) ||
              item.lastName
                .toLowerCase()
                .includes(e.target.value.toLowerCase()) ||
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
      <Row className="mb-2">
        <Col xl="6" md="6">
          <h4 className="card-title mb-1  headingcard">Approved</h4>
        </Col>
      </Row>

      <DataTable
        // noHeader
        data={teacherList}
        progressPending={pageLoading}
        columns={[
          {
            name: "Name",
            minWidth: "190px",
            selector: (row) => row.firstName,
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
                  {[row.firstName + " " + row.lastName]}
                </span>
              </>
            ),
          },
          {
            name: "Email",
            minWidth: "138px",
            selector: (row) => row.email,
            sortable: true,
            cell: (row) => row.email,
          },
          {
            name: "Phone No.",
            minWidth: "120px",
            selector: (row) => row?.phone?.number,
            style: { whiteSpace: "nowrap" },
            sortable: true,
            cell: (row) => row?.phone?.countryCode + " " + row?.phone?.number,
          },
          {
            name: "Gender",
            minWidth: "120px",

            selector: (row) => row.gender,
            sortable: true,
            cell: (row) => (
              <span style={{ textTransform: "capitalize" }}>
                {row.gender == "prefer-not-to-tell"
                  ? "Not Preferred"
                  : row.gender}
              </span>
            ),
          },
          {
            name: "DOB",
            minWidth: "120px",
            selector: (row) => row.dob,
            sortable: true,
            cell: (row) => moment(row.dob).format("DD MMM yyyy"),
          },
          {
            name: "Subjects",
            minWidth: "170px",
            selector: (row) => row.subjects[0].name,
            sortable: true,
            cell: (row) => (
              <div className="tooltipWrapper">
                {row.subjects.length > 1 ? (
                  <>
                    <Tooltip
                      id={row.email}
                      place="top"
                      style={{
                        backgroundColor: "#797d8c",
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    >
                      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                        {row.subjects.slice(1).map((item) => (
                          <li>{item.name}</li>
                        ))}
                      </ul>
                    </Tooltip>
                    <a
                      style={{
                        fontWeight: 600,
                        lineHeight: "18px",
                        fontSize: 13,
                      }}
                      data-tooltip-id={row.email}
                    >
                      {[
                        row.subjects[0].name,
                        " ",
                        "+" + row.subjects.length - 1 + " more",
                      ]}
                    </a>
                  </>
                ) : (
                  <a
                    style={{
                      fontWeight: 600,
                      lineHeight: "18px",
                      fontSize: 13,
                    }}
                  >
                    {[row.subjects[0].name]}
                  </a>
                )}
              </div>
            ),
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
                {row.status}
              </span>
            ),
          },
          {
            name: "Actions",
            minWidth: "200px",
            // style: { justifyContent: "center" },
            cell: (row) => (
              <div className="tableaction ms-auto">
                <Button
                  tag={Link}
                  to="/pages/viewteacher"
                  state={{ details: row, teacherList: teacherList }}
                  className="tablebtnview"
                >
                  <Eye className="tableicon" />
                </Button>
                {row.status != "deleted" && (
                  <>
                    <Button
                      tag={Link}
                      to="/pages/editteacher"
                      state={{ details: row }}
                      className="tablebtnedit"
                    >
                      <Edit className="tableicon" />
                    </Button>
                    <Button
                      className="tablebtndelete me-0"
                      onClick={() => {
                        toggle2();
                        setSelectedUser(row);
                      }}
                    >
                      <Trash className="tableicon" />
                    </Button>
                  </>
                )}
              </div>
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
