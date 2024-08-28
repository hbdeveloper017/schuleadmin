import { Button, Modal, ModalBody } from "reactstrap";
import { Edit, Trash, XCircle } from "react-feather";
import React, { useState } from "react";

import { API_BASE_URL } from "../../../utility/apiRequest";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";

function PrimarySubjects({ subjectList, subHeaderComponent, pageLoading }) {
  const [deleteSubjectID, setDeleteSubjectID] = useState("");
  const [modal2, setModal2] = useState(false);

  const toggle2 = () => setModal2(!modal2);

  const handleDelete = async () => {
    setLoading(true);

    const resp = await apiRequest._deleteSubject(deleteSubjectID);
    setLoading(false);

    if (resp.status) {
      toast.success(resp.message);
    } else {
      toast.error(resp.message);
    }
  };

  return (
    <>
      <DataTable
        noHeader
        progressPending={pageLoading}
        columns={[
          {
            name: "Image",
            minWidth: "120px",
            selector: (row) => row.image,
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
            name: "Type",
            minWidth: "400px",
            style: { textTransform: "capitalize" },
            selector: (row) => row.type,
            sortable: true,
            cell: (row) => row.type,
          },
          {
            name: "Actions",
            minWidth: "120px",
            cell: (row) => (
              <div className="tableaction">
                <>
                  <Button
                    tag={Link}
                    to="/pages/editsubject"
                    state={{ data: row }}
                    className="tablebtnedit"
                  >
                    <Edit className="tableicon" />
                  </Button>
                  <Button
                    className="tablebtndelete"
                    onClick={() => {
                      setDeleteSubjectID(row._id);
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
        data={subjectList}
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
                  handleDelete();
                }}
              >
                OK
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default PrimarySubjects;
