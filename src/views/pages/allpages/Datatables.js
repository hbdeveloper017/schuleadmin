import { Button, Col, Modal, ModalBody, Row } from "reactstrap";
import { Edit, Eye, Trash, XCircle } from "react-feather";
import React, { useEffect, useMemo, useState } from "react";

import DataTable from "react-data-table-component";
import FilterComponent from "./FilterComponent";
import { Link } from "react-router-dom";
import { apiRequest } from "../../../utility/apiRequest";
import moment from "moment";

const Table = (props) => {
  const [pageList, setPageList] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [filterText, setFilterText] = React.useState("");
  const [modal2, setModal2] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const toggle2 = () => setModal2(!modal2);

  useEffect(() => {
    getPages();
  }, []);

  const getPages = async () => {
    setPageLoading(true);
    const resp = await apiRequest._getCmsPages();
    setPageLoading(false);

    if (resp.status) {
      setPageList(resp.data);
      setFilterData(resp.data);
    }
  };

  const subHeaderComponent = useMemo(() => {
    return (
      <FilterComponent
        onFilter={(e) => {
          setFilterText(e.target.value);
          let newData = filterData.filter((item) =>
            item.title.toLowerCase().includes(e.target.value.toLowerCase())
          );
          setPageList(newData);
        }}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  return (
    <React.Fragment>
      <Row className="mb-2">
        <Col xl="6" md="6">
          <h4 className="card-title mb-1  headingcard">All Pages</h4>
        </Col>
      </Row>
      <DataTable
        noHeader
        data={pageList}
        progressPending={pageLoading}
        columns={[
          {
            name: "Title",
            minWidth: "220px",
            selector: "title",
            sortable: true,
            cell: (row) => row.title,
          },
          {
            name: "Last Modified Date",
            minWidth: "138px",
            selector: "date",
            sortable: true,
            cell: (row) => moment(row.updatedAt).format("DD MMM yyyy"),
          },
          {
            name: "Actions",
            minWidth: "80px",
            cell: (row) => (
              <div className="tableaction">
                <>
                  <Button
                    tag={Link}
                    to="/pages/editpage"
                    state={{ cmsContent: row }}
                    className="tablebtnedit"
                  >
                    <Edit className="tableicon" />
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
              <Button className="btn-ok" onClick={toggle2}>
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
