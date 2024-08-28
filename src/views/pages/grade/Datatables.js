import { Button, Col, Modal, ModalBody, Row } from "reactstrap";
import { Edit, Trash, XCircle } from "react-feather";
import React, { useContext, useEffect, useMemo, useState } from "react";

import DataTable from "react-data-table-component";
import FilterComponent from "./FilterComponent";
import { Link } from "react-router-dom";
import LoadingContext from "../../../utility/context/LoadingContext";
import { apiRequest } from "../../../utility/apiRequest";
import toast from "react-hot-toast";

const Table = () => {
  const { setLoading } = useContext(LoadingContext);
  const [gradeList, setGradeList] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [deleteGradeID, setDeleteGradeID] = useState("");
  const [modal2, setModal2] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [pageLoading, setPageLoading] = useState(false);
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const toggle2 = () => setModal2(!modal2);

  useEffect(() => {
    getGrade();
  }, []);

  const getGrade = async () => {
    setPageLoading(true);

    const resp = await apiRequest._getGrades();
    setPageLoading(false);

    if (resp.status) {
      setGradeList(resp.data);
      setFilterData(resp.data);
    }
  };

  const handleDeleteGrade = async () => {
    setLoading(true);
    const resp = await apiRequest._deleteGrade(deleteGradeID);

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
          let newData = filterData.filter((item) =>
            item.name.toLowerCase().includes(e.target.value.toLowerCase())
          );
          setGradeList(newData);
        }}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  return (
    <React.Fragment>
      <Row className="mb-2">
        <Col xl="6" md="6">
          <h4 className="card-title mb-1 headingcard">Grades</h4>
        </Col>
        <Col xl="6" md="6" className="text-end">
          <Button tag={Link} to="/pages/addgrade" className="btn-add">
            Add
          </Button>
        </Col>
      </Row>

      <DataTable
        noHeader
        data={gradeList}
        progressPending={pageLoading}
        columns={[
          {
            name: "Class/Grade",
            maxWidth: "150px",
            selector: (row) => row.name,
            sortable: true,
            cell: (row) => row.name,
          },
          {
            name: "Schools",
            minWidth: "800px",
            selector: (row) => row.schools[0].name,
            sortable: true,
            cell: (row) => (
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {row.schools.map((item) => (
                  <span className="gradeName">{item.name}</span>
                ))}
              </div>
            ),
          },
          {
            name: "Actions",
            minWidth: "90px",
            cell: (row) => (
              <div className="tableaction">
                <>
                  <Button
                    tag={Link}
                    to="/pages/editgrade"
                    state={{ gradeData: row }}
                    className="tablebtnedit"
                  >
                    <Edit className="tableicon" />
                  </Button>
                  <Button
                    className="tablebtndelete"
                    onClick={() => {
                      setModal2(true);
                      setDeleteGradeID(row._id);
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
                  setModal2(false);
                  handleDeleteGrade();
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
