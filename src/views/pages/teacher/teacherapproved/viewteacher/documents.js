import "@styles/react/pages/page-authentication.scss";

import { API_BASE_URL, apiRequest } from "../../../../../utility/apiRequest";
import { Button, CardText, Col, Modal, ModalBody, Row } from "reactstrap";
import { Download, Eye, Trash, XCircle } from "react-feather";
import React, { useContext, useEffect, useState } from "react";

import { Link } from "react-router-dom";
import LoadingContext from "../../../../../utility/context/LoadingContext";
import moment from "moment";
import toast from "react-hot-toast";

const Documents = ({ teacherInfo }) => {
  const { setLoading } = useContext(LoadingContext);
  const [modal2, setModal2] = useState(false);
  const toggle2 = () => setModal2(!modal2);
  const [documentList, setDocumentList] = useState([]);
  const [detailsModal, setDetailsModal] = useState(false);
  const [detailsContent, setDetailsContent] = useState({});
  const [documentID, setDocumentID] = useState("");

  useEffect(() => {
    getDocumentList();
  }, []);

  const getDocumentList = async () => {
    const resp = await apiRequest._getDocuments(teacherInfo.userID, "teacher");

    if (resp.status) {
      setDocumentList(resp.data);
    }
  };

  const handleDeleteDocument = async () => {
    setModal2(false);
    setLoading(true);
    const resp = await apiRequest._deleteDocument(
      teacherInfo.userID,
      documentID
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
      <div className="card">
        <div className="card-body">
          <Row>
            <Col sm="12">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="text-nowrap" style={{ minWidth: "90px" }}>
                        Document Name
                      </th>
                      <th className="text-nowrap" style={{ minWidth: "140px" }}>
                        Student Name
                      </th>
                      <th className="text-nowrap" style={{ minWidth: "120px" }}>
                        Date
                      </th>
                      <th className="text-nowrap" style={{ minWidth: "160px" }}>
                        Message
                      </th>
                      <th className="text-nowrap" style={{ minWidth: "140px" }}>
                        Status
                      </th>
                      <th className="text-nowrap" style={{ minWidth: "140px" }}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {documentList.map((item, index) => (
                      <tr key={index}>
                        <td onClick={() => console.log(item)}>
                          <CardText tag="span" className="user-info-title mb-0">
                            {item.title}
                          </CardText>
                        </td>
                        <td>
                          <CardText
                            tag="span"
                            className="user-info-title mb-0"
                            style={{ textTransform: "capitalize" }}
                          >
                            {item.name}
                          </CardText>
                        </td>
                        <td>
                          <CardText tag="span" className="user-info-title mb-0">
                            {moment(item.createdAt).format("DD MMM yyyy")}
                          </CardText>
                        </td>
                        <td>
                          <CardText tag="span" className="user-info-title mb-0">
                            <span className="fixedLine">{item.message}</span>
                          </CardText>
                        </td>
                        <td>
                          <CardText tag="span" className="user-info-title mb-0">
                            <span
                              style={{
                                textTransform: "capitalize",
                                background:
                                  item.status == "pending"
                                    ? "#ffc108"
                                    : "#5ccb49",
                                padding: "2px 10px",
                                borderRadius: "18px",
                                color: "#fff",
                                fontSize: "13px",
                                fontWeight: 500,
                              }}
                            >
                              {item.status}
                            </span>
                          </CardText>
                        </td>
                        <td className="tableaction text-nowrap">
                          <Button
                            className="tablebtnview"
                            tag={Link}
                            to="/pages/teacherdocumentcomments"
                            state={{
                              documentInfo: item,
                              teacherInfo: teacherInfo,
                            }}
                          >
                            <Eye className="tableicon" />
                          </Button>
                          {/* <Button
                            className="tablebtnedit"
                            onClick={() =>
                              window.open(API_BASE_URL + "/" + item.doc)
                            }
                          >
                            <Download className="tableicon" />
                          </Button> */}
                          <Button
                            className="tablebtndelete"
                            onClick={() => {
                              setDocumentID(item._id);
                              setModal2(true);
                            }}
                          >
                            <Trash className="tableicon" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {documentList.length < 1 && (
                      <tr>
                        <td colSpan={6} className="text-center pb-0">
                          There are no records to display
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <Modal
        centered
        size="lg"
        isOpen={detailsModal}
        toggle={() => setDetailsModal(false)}
      >
        <ModalBody className="p-2">
          <div className="deleteModal">
            <h2 style={{ textTransform: "capitalize" }}>
              {detailsContent.title}
            </h2>
            <div className="infoRow">
              <div className="singleInfo">
                <h6>Student Name</h6>
                <h4>{detailsContent.name}</h4>
              </div>
              <div className="singleInfo">
                <h6>Subject</h6>
                <h4>{detailsContent?.subject?.name}</h4>
              </div>
              <div className="singleInfo">
                <h6>Doc Date</h6>
                <h4>
                  {moment(detailsContent.createdAt).format("DD MMM yyyy")}
                </h4>
              </div>
              <div className="singleInfo">
                <h6>Doc Status</h6>
                <h4
                  style={{
                    textTransform: "capitalize",
                    color:
                      detailsContent.status == "pending"
                        ? "#cba006"
                        : "#1ba906",
                  }}
                >
                  {detailsContent.status}
                </h4>
              </div>
            </div>

            <div className="singleInfo">
              <h4
                style={{ marginBottom: "5px", color: "#5e5873", fontSize: 16 }}
              >
                Message
              </h4>
              <p>{detailsContent.message}</p>
            </div>
            <div className="btn-cancel-ok">
              <Button
                className="btn-ok me-2"
                onClick={() =>
                  window.open(API_BASE_URL + "/" + detailsContent.doc)
                }
              >
                Downlaod
              </Button>
              <Button
                className="btn-cancel"
                onClick={() => setDetailsModal(false)}
              >
                Clsoe
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
              <Button className="btn-ok" onClick={handleDeleteDocument}>
                OK
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};
export default Documents;
