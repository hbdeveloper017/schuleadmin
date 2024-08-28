import "@styles/react/pages/page-authentication.scss";

import { Button, CardText, Col, Modal, ModalBody, Row } from "reactstrap";
import { Download, Eye, Trash, XCircle } from "react-feather";
import React, { useState } from "react";

import { Link } from "react-router-dom";

const data = [
  {
    id: 1,
    DocumentName: "Algebraic Equations.pdf",
    Date: "20 Feb 2023",
    Message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
  },
  {
    id: 2,
    DocumentName: "Algebraic Equations.pdf",
    Date: "20 Feb 2023",
    Message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
  },
  {
    id: 3,
    DocumentName: "Algebraic Equations.pdf",
    Date: "20 Feb 2023",
    Message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
  },
  {
    id: 4,
    DocumentName: "Algebraic Equations.pdf",
    Date: "20 Feb 2023",
    Message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
  },
  {
    id: 5,
    DocumentName: "Algebraic Equations.pdf",
    Date: "20 Feb 2023",
    Message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
  },
];
const classworkdetail = () => {
  const [modal2, setModal2] = useState(false);
  const toggle2 = () => setModal2(!modal2);
  return (
    <React.Fragment>
      <Row className="mb-2">
        <Col xl="6" md="6">
          <h4 className="card-title mb-1 headingcard">Classwork Details</h4>
        </Col>
        <Col xl="6" md="6" className="text-end">
          <Link to="/pages/viewteacher">
            <Button className="btn-add">Back</Button>
          </Link>
        </Col>
      </Row>
      <Row>
        <Col sm="12">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="text-nowrap" style={{ minWidth: "120px" }}>
                        Document Name
                      </th>
                      <th className="text-nowrap" style={{ minWidth: "120px" }}>
                        Date
                      </th>
                      <th className="text-nowrap" style={{ minWidth: "160px" }}>
                        Message
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
                            {item.DocumentName}
                          </CardText>
                        </td>
                        <td>
                          <CardText tag="span" className="user-info-title mb-0">
                            {item.Date}
                          </CardText>
                        </td>
                        <td>
                          <CardText tag="span" className="user-info-title mb-0">
                            {item.Message}
                          </CardText>
                        </td>
                        <td className="tableaction text-nowrap">
                          <Button className="tablebtnedit">
                            <Download className="tableicon" />
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
            </div>
          </div>
        </Col>
      </Row>
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
export default classworkdetail;
