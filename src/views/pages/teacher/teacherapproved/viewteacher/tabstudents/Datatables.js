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
  const [studentList, setStudentList] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [modal2, setModal2] = useState(false);
  const [filterText, setFilterText] = React.useState("");
  const [selectedUser, setSelectedUser] = useState({});
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);

  const toggle2 = () => setModal2(!modal2);

  useEffect(() => {
    getStudentList();
  }, []);

  const getStudentList = async () => {
    const resp = await apiRequest._getUserAssignedStudents(
      props.teacherInfo.userID
    );
    if (resp.status) {
      setStudentList(resp.data);
      setFilterData(resp.data);
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
            minWidth: "100px",
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
                  {[row.studentFirstName, " ", row.studentLastName]}
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
            name: "Subjects",
            minWidth: "140px",
            selector: (row) => row?.subjects,
            sortable: true,
            cell: (row) => (
              <div className="tooltipWrapper">
                <Tooltip
                  id={row.userID}
                  place="top"
                  style={{
                    backgroundColor: "#797d8c",
                    color: "#fff",
                    fontWeight: 600,
                  }}
                >
                  <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                    {row?.subjects.slice(1).map((item, i) => (
                      <li key={i}>{item.name}</li>
                    ))}
                  </ul>
                </Tooltip>

                {row?.subjects[0]?.name}
                <a
                  style={{
                    lineHeight: "18px",
                    fontSize: 13,
                    whiteSpace: "nowrap",
                    fontWeight: 600,
                    color: "#FF6020",
                  }}
                  data-tooltip-id={row.userID}
                >
                  {[
                    " ",
                    row.subjects?.length > 1 && `+${row.subjects?.length - 1}`,
                  ]}
                </a>
              </div>
            ),
          },
          {
            name: "School",
            minWidth: "140px",
            selector: (row) => row?.school,
            sortable: true,
            cell: (row) => row?.school?.name,
          },
          {
            name: "Grade",
            minWidth: "80px",
            selector: (row) => row?.grade,
            sortable: true,
            cell: (row) => row?.grade?.name,
          },
          {
            name: "State",
            minWidth: "140px",
            selector: (row) => row?.state,
            sortable: true,
            cell: (row) => row?.state?.name,
          },
          {
            name: "Free Lessons",
            minWidth: "140px",
            selector: (row) => row.freeLessons,
            sortable: true,
            cell: (row) => row.freeLessons,
          },
          {
            name: "Group Meetings Left",
            minWidth: "180px",
            selector: (row) => row.groupLessons,
            sortable: true,
            cell: (row) => (
              <>
                {row.groupLessons?.total ? (
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
                        {row.groupLessons.data.map((item) => (
                          <li>{[item.name, " - ", item.lessons]}</li>
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
                      {row.groupLessons?.total}{" "}
                      <Info
                        className="tableicon"
                        style={{ width: 14, height: 14 }}
                      />
                    </a>
                  </>
                ) : (
                  row.groupLessons
                )}
              </>
            ),
          },
          {
            name: "Individual Meetings Left",
            minWidth: "210px",
            selector: (row) => row.individualLessons,
            sortable: true,
            cell: (row) => (
              <>
                {row.individualLessons?.total ? (
                  <>
                    <Tooltip
                      id={row.phone?.number}
                      place="top"
                      style={{
                        backgroundColor: "#797d8c",
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    >
                      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                        {row.individualLessons.data.map((item) => (
                          <li>{[item.name, " - ", item.lessons]}</li>
                        ))}
                      </ul>
                    </Tooltip>

                    <a
                      style={{
                        fontWeight: 600,
                        lineHeight: "18px",
                        fontSize: 13,
                      }}
                      data-tooltip-id={row.phone?.number}
                    >
                      {row.individualLessons?.total}{" "}
                      <Info
                        className="tableicon"
                        style={{ width: 14, height: 14 }}
                      />
                    </a>
                  </>
                ) : (
                  row.individualLessons
                )}
              </>
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
          // {
          //   name: "Actions",
          //   minWidth: "200px",
          //   cell: (row) => (
          //     <div className="tableaction">
          //       <>
          //         {row.status != "deleted" && (
          //           <>
          //             <Button
          //               className="tablebtndelete"
          //               onClick={() => {
          //                 toggle2();
          //                 setSelectedUser(row);
          //               }}
          //             >
          //               <Trash className="tableicon" />
          //             </Button>
          //           </>
          //         )}
          //       </>
          //     </div>
          //   ),
          // },
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
