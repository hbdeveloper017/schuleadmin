import "@styles/react/pages/page-authentication.scss";
import "chart.js/auto";
import "@styles/react/libs/flatpickr/flatpickr.scss";

import { Button, CardText, Col, Modal, ModalBody, Row } from "reactstrap";
import { Eye, Trash, XCircle } from "react-feather";
import React, { useContext, useEffect, useState } from "react";

import { Link } from "react-router-dom";
import LoadingContext from "../../../../../utility/context/LoadingContext";
import Mathematics from "./Mathematics";
import { apiRequest } from "../../../../../utility/apiRequest";
import toast from "react-hot-toast";

const Classwork = ({ studentInfo }) => {
  const [modal2, setModal2] = useState(false);

  const { setLoading } = useContext(LoadingContext);
  const toggle2 = () => setModal2(!modal2);
  const [classworkList, setClassworkList] = useState([]);
  const [selectedDetails, setSelectedDetails] = useState({});

  useEffect(() => {
    getClassworks();
  }, []);

  const getClassworks = async () => {
    const resp = await apiRequest._getUserClasswork(studentInfo.userID);

    if (resp.status) {
      setClassworkList(resp.data);
    }
  };

  const handleDeleteDoc = async () => {
    setModal2(false);
    setLoading(true);
    const resp = await apiRequest._deleteClasswork(
      studentInfo.userID,
      selectedDetails.subjectID
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
                    {classworkList.map((item, index) => (
                      <tr key={item.subjectID}>
                        <td>
                          <CardText tag="span" className="user-info-title mb-0">
                            {item.subject}
                          </CardText>
                        </td>
                        <td>
                          <CardText tag="span" className="user-info-title mb-0">
                            {item.docs}
                          </CardText>
                        </td>
                        <td className="tableaction text-nowrap">
                          {/* <Button
                            className="tablebtnview"
                            tag={Link}
                            to="/pages/classworkdetail"
                            state={{
                              userID: studentInfo.userID,
                              subjectID: item.subjectID,
                            }}
                          >
                            <Eye className="tableicon" />
                          </Button> */}
                          <Button
                            className="tablebtndelete"
                            onClick={() => {
                              setSelectedDetails(item);
                              toggle2();
                            }}
                          >
                            <Trash className="tableicon" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {classworkList.length < 1 && (
                      <tr>
                        <td
                          colSpan={3}
                          style={{ textAlign: "center", paddingBottom: 0 }}
                        >
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
      {classworkList.length > 0 && (
        <Row>
          <Col lg="12" sm="12">
            <h4 className="card-title mb-1 headingcard">Progress Report</h4>
          </Col>
          {classworkList.map((item) => (
            <Col lg="6" sm="12">
              <Mathematics label={item.subject} chartData={item.grades} />
            </Col>
          ))}
        </Row>
      )}
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
              <Button className="btn-ok" onClick={handleDeleteDoc}>
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
