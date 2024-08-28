import { Button, Col, Modal, ModalBody, Row } from "reactstrap";
import { Eye, Trash, XCircle } from "react-feather";
import React, { useMemo, useState } from "react";

import DataTable from "react-data-table-component";
import FilterComponent from "./FilterComponent";
import { Tooltip } from "react-tooltip";
import avatar1 from "@src/assets/images/img/notificationicon1.jpg";
import moment from "moment";

const Table = (props) => {
  const [modalContent, setModalContent] = useState({});
  const [currentNoti, setCurrentNoti] = useState();
  const [contentModal, setContentModal] = useState(false);
  const [notification, setNotification] = useState(props.data);

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);

  const subHeaderComponent = useMemo(() => {
    return (
      <FilterComponent
        onFilter={(e) => {
          setFilterText(e.target.value);
          let newData = props.data.filter((item) =>
            item.title.toLowerCase().includes(e.target.value.toLowerCase())
          );
          setNotification(newData);
        }}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  const [modal2, setModal2] = useState(false);
  const toggle2 = () => setModal2(!modal2);

  return (
    <React.Fragment>
      <DataTable
        noHeader
        columns={[
          {
            name: "Title",
            minWidth: "290px",
            selector: (row) => row.title,
            sortable: true,
            cell: (row) => (
              <>
                <img
                  className="table_img rounded-circle img-thumbnail me-1"
                  src={avatar1}
                />
                {row.title} ddd
              </>
            ),
          },
          {
            name: "Students",
            minWidth: "170px",
            selector: (row) => row?.students[0]?.name,
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
            name: "Description",
            minWidth: "400px",
            selector: (row) => row.content,
            sortable: true,
            cell: (row) => <span className="fixedLine">{row.content}</span>,
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
                      setCurrentNoti(row._id);
                      toggle2();
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
        data={notification}
        defaultSortField="name"
        pagination
        subHeader
        // subHeaderComponent={subHeaderComponent}
      />
      <Modal
        centered
        isOpen={contentModal}
        toggle={() => setContentModal(false)}
      >
        <ModalBody className="p-3">
          <div className="deleteModal">
            <h2>{modalContent.title}</h2>
            <p>{modalContent.content}</p>
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
              <Button
                className="btn-ok"
                onClick={() => {
                  const onSuccess = () => {
                    toggle2();
                  };
                  props.onDelete(currentNoti, onSuccess);
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
