import { API_BASE_URL, apiRequest } from "../../../../../../utility/apiRequest";
import { Button, Col, Modal, ModalBody, Row } from "reactstrap";
import { Edit, Eye, Info, Trash, XCircle } from "react-feather";
import React, { useEffect, useMemo, useState } from "react";

import DataTable from "react-data-table-component";
import FilterComponent from "./FilterComponent";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import defaultImg from "../../../../../../assets/images/default.jpg";
import toast from "react-hot-toast";

const Table = (props) => {
  const [groupList, setGroupList] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [modal2, setModal2] = useState(false);
  const [filterText, setFilterText] = React.useState("");
  const [selectedUser, setSelectedUser] = useState({});
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);

  const toggle2 = () => setModal2(!modal2);

  useEffect(() => {
    getGroupList();
  }, []);

  const getGroupList = async () => {
    const resp = await apiRequest._getGroups(props?.teacherInfo?.userID);
    if (resp.status) {
      setGroupList(resp.data);
      setFilterData(resp.data);
    }
  };

  const deleteUser = async () => {
    const resp = await apiRequest._deleteUser(selectedUser.userID, "student");

    if (resp.status) {
      toast.success(resp.message);
      getGroupList();
      setSelectedUser({});
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
          setGroupList(newData);
        }}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  return (
    <React.Fragment>
      <DataTable
        noHeader
        data={groupList}
        columns={[
          {
            name: "Title",
            minWidth: "220px",
            selector: (row) => row.title,
            sortable: true,
            cell: (row) => row.title,
          },
          {
            name: "Students",
            minWidth: "170px",
            selector: (row) => row.students,
            sortable: true,
            cell: (row) => (
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
                    {row?.students.slice(1).map((item, i) => (
                      <li key={i}>{item.name}</li>
                    ))}
                  </ul>
                </Tooltip>

                {row?.students[0]?.name}
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
                  {[
                    " ",
                    row.students?.length > 1 && `+${row.students?.length - 1}`,
                  ]}
                </a>
              </div>
            ),
          },
          {
            name: "Member Capacity",
            minWidth: "170px",
            selector: (row) => row.memberCapacity,
            sortable: true,
            cell: (row) => row.memberCapacity,
          },
          {
            name: "Actions",
            minWidth: "200px",
            cell: (row) => (
              <div className="tableaction">
                <Button
                  tag={Link}
                  to="/pages/editgroup"
                  state={{ details: row }}
                  className="tablebtnedit"
                >
                  <Edit className="tableicon" />
                </Button>

                {/* <Button
                  className="tablebtndelete"
                  onClick={() => {
                    toggle2();
                    setSelectedUser(row);
                  }}
                >
                  <Trash className="tableicon" />
                </Button> */}
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
