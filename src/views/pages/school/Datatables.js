import { API_BASE_URL, apiRequest } from "../../../utility/apiRequest";
import { Button, Col, Modal, ModalBody, Row } from "reactstrap";
import { Edit, Trash, XCircle } from "react-feather";
import React, { useEffect, useMemo, useState } from "react";

import DataTable from "react-data-table-component";
import FilterComponent from "./FilterComponent";
import { Link } from "react-router-dom";
import LoadingContext from "../../../utility/context/LoadingContext";
import ReactDragListView from "react-drag-listview";
import toast from "react-hot-toast";
import { useContext } from "react";

const Table = () => {
  const { setLoading } = useContext(LoadingContext);
  const [schoolList, setSchoolList] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [deleteSchoolID, setDeleteSchoolID] = useState("");
  const [filterText, setFilterText] = React.useState("");
  const [pageLoading, setPageLoading] = useState(false);
  const [items, setItems] = useState([
    { id: 1, label: "Item 1" },
    { id: 2, label: "Item 2" },
    { id: 3, label: "Item 3" },
    { id: 4, label: "Item 4" },
  ]);
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const [modal2, setModal2] = useState(false);
  const toggle2 = () => setModal2(!modal2);

  useEffect(() => {
    getSchools();

    return () => {
      console.log("return hai ye");
    };
  }, []);

  const getSchools = async () => {
    setPageLoading(true);
    const resp = await apiRequest._getSchool();
    setPageLoading(false);

    if (resp.status) {
      setSchoolList(resp.data);
      setFilterData(resp.data);
    }
  };

  const handleSchoolDelete = async () => {
    setLoading(true);
    const resp = await apiRequest._deleteSchool(deleteSchoolID);
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
          setSchoolList(newData);
        }}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  const handleSchoolUpdate = async (index, schoolInfo) => {
    if (index == 0) {
      return false;
    }

    setLoading(true);

    const formdata = new FormData();
    formdata.append("name", schoolInfo.name);
    formdata.append("index", index);

    const resp = await apiRequest._updateSchool(schoolInfo._id, formdata);

    setLoading(false);

    if (resp.status) {
      toast.success(resp.message);
      getSchools();
    } else {
      toast.error(resp.message);
    }
  };

  const dragProps = {
    onDragEnd(fromIndex, toIndex) {
      const data = [...schoolList];

      const item = data.splice(fromIndex, 1)[0];

      handleSchoolUpdate(toIndex + 1, item);
      // console.log(fromIndex, toIndex);

      // data.splice(toIndex, 0, item);

      // setSchoolList(data);
    },
    nodeSelector: ".rdt_TableRow",
    handleSelector: ".rdt_TableRow",
  };

  return (
    <React.Fragment>
      <Row className="mb-2">
        <Col xl="6" md="6">
          <h4 className="card-title mb-1 headingcard">Schools</h4>
        </Col>
        <Col xl="6" md="6" className="text-end">
          <Button tag={Link} to="/pages/addschool" className="btn-add">
            Add
          </Button>
        </Col>
      </Row>
      <div className="moveRow">
        <ReactDragListView {...dragProps}>
          <DataTable
            data={schoolList}
            noHeader
            progressPending={pageLoading}
            columns={[
              {
                name: "Image",
                minWidth: "120px",
                selector: (row) => row.name,
                sortable: true,
                cell: (row) => (
                  <>
                    <img
                      className="table_img rounded-circle img-thumbnail me-1"
                      src={API_BASE_URL + "/" + row.image}
                    />
                  </>
                ),
              },
              {
                name: "Title",
                minWidth: "400px",
                selector: (row) => row.name,
                sortable: true,
                cell: (row) => row.name,
              },
              {
                name: "Actions",
                minWidth: "120px",
                cell: (row) => (
                  <div className="tableaction">
                    <>
                      <Button
                        tag={Link}
                        to="/pages/editschool"
                        state={{
                          schoolData: row,
                        }}
                        className="tablebtnedit"
                      >
                        <Edit className="tableicon" />
                      </Button>
                      <Button
                        className="tablebtndelete"
                        onClick={() => {
                          setDeleteSchoolID(row._id);
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
        </ReactDragListView>
      </div>

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
                  handleSchoolDelete();
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
