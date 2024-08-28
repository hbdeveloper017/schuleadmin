import "@styles/react/pages/page-authentication.scss";

import { Button, CardText, Col, Modal, ModalBody, Row } from "reactstrap";
import { Download, Eye, Trash, XCircle } from "react-feather";
import React, { useState } from "react";

import { Link } from "react-router-dom";

const data = [
  {
    id: 1,
    Title: "Mathematics",
    Documents: "6",
  },
  {
    id: 2,
    Title: "Physics",
    Documents: "6",
  },
  {
    id: 3,
    Title: "Chemistry",
    Documents: "6",
  },
  {
    id: 4,
    Title: "Mechanics",
    Documents: "6",
  },
  {
    id: 5,
    Title: "Thermodynamics",
    Documents: "6",
  },
];
const Classwork = () => {
  const [modal2, setModal2] = useState(false);
  const toggle2 = () => setModal2(!modal2);
  return (
    <React.Fragment>
      <div className="card">
        <div className="card-body">
          <Row>
            <Col sm="12">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="text-nowrap" style={{ minWidth: "120px" }}>
                        Title
                      </th>
                      <th className="text-nowrap" style={{ minWidth: "120px" }}>
                        Documents
                      </th>
                      <th className="text-nowrap" style={{ minWidth: "140px" }}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr>
                        <td>
                          <CardText tag="span" className="user-info-title mb-0">
                            {item.Title}
                          </CardText>
                        </td>
                        <td>
                          <CardText tag="span" className="user-info-title mb-0">
                            {item.Documents}
                          </CardText>
                        </td>
                        <td className="tableaction text-nowrap">
                          <Button
                            className="tablebtnview"
                            tag={Link}
                            to="/pages/classworkdetail2"
                          >
                            <Eye className="tableicon" />
                          </Button>
                          <Button className="tablebtndelete" onClick={toggle2}>
                            <Trash className="tableicon" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Col>
          </Row>
        </div>
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
export default Classwork;
