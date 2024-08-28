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
import { CheckCircle, Send, XCircle } from "react-feather";
import React, { useContext, useEffect, useMemo, useState } from "react";

import DataTable from "react-data-table-component";
import FilterComponent from "./FilterComponent";
import LoadingContext from "../../../utility/context/LoadingContext";
import { Tooltip } from "react-tooltip";
import { apiRequest } from "../../../utility/apiRequest";
import moment from "moment/moment";
import toast from "react-hot-toast";

const Table = (props) => {
  const [reports, setReports] = useState([]);
  const { setLoading } = useContext(LoadingContext);
  const [modal2, setModal2] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  const toggle2 = () => setModal2(!modal2);
  const [modal, setModal] = useState(false);
  const [repondId, setRepondId] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [filterText, setFilterText] = React.useState("");
  const [filterData, setFilterData] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);

  useEffect(() => {
    getReports();
  }, []);

  const getReports = async () => {
    setPageLoading(true);
    const resp = await apiRequest._getReoprts();
    setPageLoading(false);
    if (resp.status) {
      setReports(resp.data);
      setFilterData(resp.data);
      setLoading(false);
    } else {
      setFilterData([]);
      setLoading(false);
    }
  };

  const toggle = (id) => {
    setRepondId(id);
    setModal(!modal);
  };

  const respondReport = async () => {
    setIsSubmit(true);
    if (title && message) {
      setLoading(true);
      let dict = {
        reportedByID: repondId,
        title: title.trim(),
        content: message.trim(),
      };
      const resp = await apiRequest._addRespondReport(dict);
      setLoading(false);
      if (resp.status) {
        toast.success(resp.message);
        setRepondId("");
        setLoading(false);
        setIsSubmit(false);
      } else {
        toast.error(resp.message);
        setLoading(false);
        setIsSubmit(false);
      }
    }
  };

  const updateStatus = async () => {
    setLoading(true);
    const payload = {
      reportID: repondId,
      status: "resolved",
    };

    const resp = await apiRequest._updateReportStatus(payload);
    setLoading(false);

    if (resp.status) {
      toast.success(resp.message);
      setRepondId("");
      getReports();
    }
  };

  const subHeaderComponent = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <FilterComponent
        onFilter={(e) => {
          setFilterText(e.target.value);
          let newData = filterData.filter(
            (item) =>
              item.reportedTo.name
                .toLowerCase()
                .includes(e.target.value.toLowerCase()) ||
              item.reportedBy.name
                .toLowerCase()
                .includes(e.target.value.toLowerCase()) ||
              item.reason.toLowerCase().includes(e.target.value.toLowerCase())
          );
          setReports(newData);
        }}
        onClear={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  return (
    <React.Fragment>
      <Row className="mb-2">
        <Col xl="6" md="6">
          <h4 className="card-title mb-1 headingcard">All Reports</h4>
        </Col>
      </Row>
      <DataTable
        noHeader
        data={reports}
        progressPending={pageLoading}
        columns={[
          {
            name: "Report To",
            minWidth: "290px",
            selector: (row) => row.reportedTo.name,
            sortable: true,
            cell: (row) => (
              <>
                {row.reportedTo.name}
                <span style={{ textTransform: "capitalize", marginLeft: 5 }}>
                  ({row.reportedTo.role})
                </span>
              </>
            ),
          },
          {
            name: "Report By",
            minWidth: "290px",
            selector: (row) => row.reportedBy.name,
            sortable: true,
            cell: (row) => (
              <>
                {row.reportedBy.name}
                <span style={{ textTransform: "capitalize", marginLeft: 5 }}>
                  ({row.reportedBy.role})
                </span>
              </>
            ),
          },
          {
            name: "Reason",
            minWidth: "400px",
            selector: (row) => row.reason,
            sortable: true,
            cell: (row) => row.reason,
          },
          {
            name: "Date",
            minWidth: "130px",
            selector: (row) => row.createdAt,
            sortable: true,
            cell: (row) => moment(row.createdAt).format("DD MMM yyyy"),
          },
          {
            name: "Status",
            minWidth: "130px",
            selector: (row) => row.status,
            sortable: true,
            cell: (row) => (
              <span style={{ textTransform: "capitalize" }}>{row.status}</span>
            ),
          },
          {
            name: "Actions",
            minWidth: "120px",
            cell: (row) => (
              <div className="tableaction">
                {row.status == "pending" && (
                  <div className="d-flex">
                    <Button
                      className="tablebtndelete ms-1"
                      onClick={() => toggle(row.reportedBy._id)}
                    >
                      <Send className="tableicon" />
                    </Button>
                    <Button
                      className="tablebtndelete"
                      onClick={() => {
                        setRepondId(row._id);
                        toggle2();
                      }}
                    >
                      <CheckCircle className="tableicon" />
                    </Button>
                  </div>
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
      <Modal
        backdrop="static"
        centered
        isOpen={modal}
        toggle={toggle}
        size={"lg"}
      >
        <ModalBody className="p-2">
          <div className="deleteModal">
            <h2>Send New Notification</h2>
            <p style={{ marginBottom: 10 }}>
              Send a new notification to selected participants
            </p>

            <FormGroup className="form-group">
              <Label className="form-label" for="title">
                Title
              </Label>
              <Input
                type="text"
                id="title"
                name="title"
                placeholder="Title"
                onChange={(event) => setTitle(event.target.value)}
              />
              {isSubmit && !title && (
                <span style={{ color: "red" }}>Title is required.</span>
              )}
            </FormGroup>

            <FormGroup className="form-group">
              <Label className="form-label" for="Message">
                Message
              </Label>
              <Input
                type="textarea"
                id="Message"
                name="Message"
                rows="4"
                placeholder="Type Here..."
                onChange={(event) => setMessage(event.target.value)}
              />
              {isSubmit && !message && (
                <span style={{ color: "red" }}>Message is required.</span>
              )}
            </FormGroup>

            <div className="btn-cancel-ok text-center">
              <Button className="btn-cancel me-1" onClick={toggle}>
                Cancel
              </Button>
              <Button className="btn-ok" onClick={respondReport}>
                OK
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      <Modal centered isOpen={modal2} toggle={toggle2}>
        <ModalBody className="p-3">
          <div className="deleteModal text-center">
            <XCircle className="deletemodal_icon" />
            {/* <h2>Are You Sure ?</h2> */}
            <h2 className="mb-3">Are you sure this report is resolved!</h2>
            <div className="btn-cancel-ok">
              <Button className="btn-cancel me-1" onClick={toggle2}>
                Cancel
              </Button>
              <Button className="btn-ok" onClick={updateStatus}>
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
