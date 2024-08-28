import { API_BASE_URL, apiRequest } from "../../../../utility/apiRequest";
import {
  Badge,
  Button,
  Col,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  Row,
} from "reactstrap";
import { CheckCircle, Edit, Eye, Info, XCircle } from "react-feather";
import { Link, useLocation } from "react-router-dom";
import React, { useContext, useEffect, useMemo, useState } from "react";

import DataTable from "react-data-table-component";
import FilterComponent from "./FilterComponent";
import LoadingContext from "../../../../utility/context/LoadingContext";
import { Tooltip } from "react-tooltip";
import dummyAvatar from "../../../../assets/images/default.jpg";
import moment from "moment";
import toast from "react-hot-toast";

const Table = () => {
  const { setLoading } = useContext(LoadingContext);
  const { state } = useLocation();
  const [teacherList, setTeacherList] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [modal2, setModal2] = useState(false);
  const toggle2 = () => setModal2(!modal2);
  const [Message, setMessage] = useState("");

  useEffect(() => {
    getPendingStudent();
  }, []);

  const getPendingStudent = async () => {
    const payload = {
      role: "teacher",
      type: "pending-approval",
    };
    // const resp = await apiRequest._getUserList(payload);
    const resp = await apiRequest._getUserAssignedStudents(
      state.teacherInfo.userID
    );
    if (resp.status) {
      setTeacherList(resp.data);
      setFilterData(resp.data);
    }
  };

  const handleApproveTeacher = async () => {
    setModal(false);
    setLoading(true);
    const payload = {
      userID: selectedTeacher,
      role: "teacher",
    };

    const resp = await apiRequest._userApprove(payload);

    setLoading(false);

    if (resp.status) {
      toast.success(resp.message);
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
                .includes(e.target.value.toLowerCase())
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
          <h4 className="card-title mb-1  headingcard">Students</h4>
        </Col>
      </Row>

      <DataTable
        noHeader
        data={teacherList}
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
                      : dummyAvatar
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
                      id={row.phone}
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
                      data-tooltip-id={row.phone}
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
            minWidth: "100px",
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
            cell: (row) => (
              <div className="tableaction">
                <Button
                  onClick={() => toggle2(row._id)}
                  className="tablebtnview"
                >
                  <XCircle className="tableicon" />
                </Button>
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

      <Modal centered isOpen={modal} toggle={toggle}>
        <ModalBody className="p-2">
          <div className="deleteModal text-center">
            <CheckCircle className="deletemodal_icon" />
            <h2>Confirmation</h2>
            <p>Are you sure you want to accept this?</p>
            <div className="btn-cancel-ok">
              <Button className="btn-cancel me-1" onClick={toggle}>
                Cancel
              </Button>
              <Button className="btn-ok" onClick={handleApproveTeacher}>
                OK
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      <Modal centered isOpen={modal2} toggle={toggle2}>
        <ModalBody className="p-2 statusmodal_body">
          <h2 className="status_heading">Reason</h2>
          <Row>
            <Col md="12" sm="12">
              <FormGroup className="form-group">
                <Label className="form-label" for="Message">
                  Message
                </Label>
                <Input
                  type="textarea"
                  id="Message"
                  name="Message"
                  rows="4"
                  value={Message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type Here..."
                />
              </FormGroup>
            </Col>
          </Row>
          <div className="btn-cancel-ok text-center mt-1">
            <Button className="btn-cancel me-1" onClick={toggle2}>
              Cancel
            </Button>
            <Button color="primary" onClick={toggle2}>
              Send
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default Table;
