import "@styles/react/pages/page-authentication.scss";

import { API_BASE_URL, apiRequest } from "../../../../../../utility/apiRequest";
import { Button, CardText, Col, Modal, ModalBody, Row } from "reactstrap";
import { Download, Eye, Trash, XCircle } from "react-feather";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";

import LoadingContext from "../../../../../../utility/context/LoadingContext";
import moment from "moment";
import toast from "react-hot-toast";

const classworkdetail = () => {
  const navigate = useNavigate();
  const { setLoading } = useContext(LoadingContext);
  const { userID, subjectID } = useLocation().state;
  const [workList, setWorkList] = useState([]);

  const [detailsModal, setDetailsModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [modal2, setModal2] = useState(false);
  const toggle2 = () => setModal2(!modal2);

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async () => {
    const resp = await apiRequest._getUserClassworkDetails(userID, subjectID);
    if (resp.status) {
      setWorkList(resp.data);
    }
  };

  const handleDeleteDoc = async () => {
    setModal2(false);
    setLoading(true);
    const resp = await apiRequest._deleteClassworkDocument(
      userID,
      subjectID,
      modalContent._id
    );

    setLoading(false);

    if (resp.status) {
      toast.success(resp.message);
    } else {
      toast.error(resp.message);
    }
  };

  return (
    <React.Fragment>
      <Row className="mb-2">
        <Col xl="6" md="6">
          <h4 className="card-title mb-1 headingcard">Classwork Details</h4>
        </Col>
        <Col xl="6" md="6" className="text-end">
          <Button className="btn-add" onClick={() => navigate(-1)}>
            Back
          </Button>
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
                        Grade
                      </th>
                      <th className="text-nowrap" style={{ minWidth: "140px" }}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {workList.map((item, index) => (
                      <tr>
                        <td style={{ minWidth: 250 }}>{item.title}</td>
                        <td>{moment(item.createdAt).format("DD MMM yyyy")}</td>
                        <td>
                          <span className="fixedLine">{item.message}</span>
                        </td>
                        <td>
                          <span
                            className="fixedLine"
                            style={{
                              width: "fit-content",
                              padding: "2px 12px",
                              borderRadius: "50px",
                              color: "#fff",
                              background:
                                item.grade == "Sehr gut"
                                  ? "#5BCA49"
                                  : item.grade == "Gut"
                                  ? "#99CA49"
                                  : item.grade == "Befriedigend"
                                  ? "#CABD49"
                                  : item.grade == "Ausreichend"
                                  ? "#FFA132"
                                  : item.grade == "Mangelhaft"
                                  ? "#FF7714"
                                  : "#E93016",
                            }}
                          >
                            {item.grade}
                          </span>
                        </td>
                        <td className="tableaction text-nowrap">
                          <Button
                            className="tablebtndelete"
                            onClick={() => {
                              setModalContent(item);
                              setDetailsModal(true);
                            }}
                          >
                            <Eye className="tableicon" />
                          </Button>
                          <Button
                            className="tablebtnedit"
                            onClick={() =>
                              window.open(
                                API_BASE_URL + "/" + item.classWorkdoc
                              )
                            }
                          >
                            <Download className="tableicon" />
                          </Button>
                          <Button
                            className="tablebtndelete"
                            onClick={() => {
                              setModalContent(item);
                              toggle2();
                            }}
                          >
                            <Trash className="tableicon" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {workList.length < 1 && (
                      <tr>
                        <td
                          colSpan={5}
                          style={{ textAlign: "center", paddingBottom: 0 }}
                        >
                          There are no records to display
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Modal
        centered
        isOpen={detailsModal}
        toggle={() => setDetailsModal(false)}
      >
        <ModalBody className="p-2">
          <div className="deleteModal">
            <h2>{modalContent.title}</h2>
            <p>{modalContent.message}</p>
            <div className="btn-cancel-ok">
              <Button className="btn-ok" onClick={() => setDetailsModal(false)}>
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
            <h2>Are You Sure ?</h2>
            <p>You will not be able to recover the deleted record!</p>
            <div className="btn-cancel-ok">
              <Button className="btn-cancel me-1" onClick={toggle2}>
                Cancel
              </Button>
              <Button
                className="btn-ok"
                onClick={() => {
                  handleDeleteDoc();
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
export default classworkdetail;
