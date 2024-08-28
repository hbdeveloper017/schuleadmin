import { Button, Col, Modal, ModalBody, Row } from "reactstrap";
import { Eye, Trash, XCircle } from "react-feather";
import React, { useContext, useEffect, useMemo, useState } from "react";

import DataTable from "react-data-table-component";
import FilterComponent from "./FilterComponent";
import LoadingContext from "../../../utility/context/LoadingContext";
import { apiRequest } from "../../../utility/apiRequest";
import toast from "react-hot-toast";

const Table = (props) => {
  const { setLoading } = useContext(LoadingContext);
  const [suggestionList, setSuggestionList] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [modalContent, setModalContent] = useState({});
  const [contentModal, setContentModal] = useState(false);
  const [deleteSuggestionID, setDeleteSuggestionID] = useState("");
  const [pageLoading, setPageLoading] = useState(false);
  const [modal2, setModal2] = useState(false);
  const toggle2 = () => setModal2(!modal2);
  const [type, setType] = useState();

  useEffect(() => {
    getSuggestionList();
  }, [type]);

  const getSuggestionList = async () => {
    setPageLoading(true);
    const payload = {
      type,
    };
    const resp = await apiRequest._getSuggestions(payload);
    setPageLoading(false);
    if (resp.status) {
      setSuggestionList(resp.data);
      setFilterData(resp.data);
    }
  };

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);

  const handleSuggestionDelete = async () => {
    setLoading(true);
    setModal2(false);
    const resp = await apiRequest._deleteSuggestions(deleteSuggestionID);
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
        onTypeChange={setType}
        onFilter={(e) => {
          setFilterText(e.target.value);
          let newData = filterData.filter(
            (item) =>
              item.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
              item.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
              item.suggestionType
                .toLowerCase()
                .includes(e.target.value.toLowerCase()) ||
              item.mobile.toLowerCase().includes(e.target.value.toLowerCase())
          );
          setSuggestionList(newData);
        }}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  return (
    <React.Fragment>
      <Row className="mb-2">
        <Col xl="6" md="6">
          <h4 className="card-title mb-1  headingcard">Suggestions</h4>
        </Col>
      </Row>

      <DataTable
        noHeader
        data={suggestionList}
        progressPending={pageLoading}
        columns={[
          {
            name: "Name",
            minWidth: "130px",
            selector: (row) => row.name,
            sortable: true,
            cell: (row) => row.name,
          },
          {
            name: "Email",
            minWidth: "230px",
            selector: (row) => row.email,
            sortable: true,
            cell: (row) => row.email,
          },
          {
            name: "Phone No.",
            minWidth: "80px",
            selector: (row) => row.mobile,
            sortable: true,
            cell: (row) => row.mobile,
          },
          {
            name: "Message",
            minWidth: "300px",
            selector: (row) => row.suggestion,
            sortable: true,
            cell: (row) => <span className="fixedLine">{row.suggestion}</span>,
          },
          {
            name: "Type",
            minWidth: "100px",
            maxWidth: "100px",
            selector: (row) => row.suggestionType,
            sortable: true,
            cell: (row) => (
              <span
                className={
                  row.suggestionType.charAt(0).toUpperCase() +
                  row.suggestionType.slice(1) +
                  " badge"
                }
              >
                {row.suggestionType.charAt(0).toUpperCase() +
                  row.suggestionType.slice(1)}
              </span>
            ),
          },
          {
            name: "Actions",
            minWidth: "80px",
            cell: (row) => (
              <div className="tableaction">
                <>
                  <Button
                    className="tablebtndelete"
                    onClick={() => {
                      setModalContent(row);
                      setContentModal(true);
                    }}
                  >
                    <Eye className="tableicon" />
                  </Button>
                  <Button
                    className="tablebtndelete"
                    onClick={() => {
                      setDeleteSuggestionID(row._id);
                      setModal2(true);
                    }}
                  >
                    <Trash className="tableicon" />
                  </Button>
                </>
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
        centered
        isOpen={contentModal}
        toggle={() => setContentModal(false)}
      >
        <ModalBody className="p-2">
          <div className="deleteModal">
            <h2>{modalContent.name}</h2>
            <p>{modalContent.suggestion}</p>
            <div className="btn-cancel-ok">
              <Button
                className="btn-cancel me-1"
                onClick={() => setContentModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>

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
              <Button className="btn-ok" onClick={handleSuggestionDelete}>
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
