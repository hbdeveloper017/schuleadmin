// ** React Imports

import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";

import LoadingContext from "../../../../utility/context/LoadingContext";
import { apiRequest } from "../../../../utility/apiRequest";
import toast from "react-hot-toast";

// ** Custom Components

// ** Third Party Components

const Editgrade = () => {
  const { wordData } = useLocation().state;
  const navigate = useNavigate();
  const { setLoading } = useContext(LoadingContext);
  const [wordInfo, setWordInfo] = useState({});

  useEffect(() => {
    setWordInfo({
      _id: wordData._id,
      name: wordData.name,
      status: wordData.status,
    });
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (wordInfo.name == "") {
      toast.error("You must fill the text.");
      return false;
    }

    setLoading(true);

    let payload = {
      name: wordInfo.name,
    };

    const resp = await apiRequest._updateBadWord(wordInfo._id, payload);
    setLoading(false);
    if (resp.status) {
      toast.success(resp.message);
      navigate(-1);
    } else {
      toast.error(resp.message);
    }
  };

  return (
    <React.Fragment>
      <Row className="mb-2">
        <Col xl="6" md="6">
          <h4 className="card-title mb-1 headingcard">Edit Bad Word</h4>
        </Col>
        <Col xl="6" md="6" className="text-end">
          <Link to="/pages/badwords">
            <Button className="btn-add">Back</Button>
          </Link>
        </Col>
      </Row>
      <Row>
        <Col sm="12">
          <div className="card">
            <div className="card-body">
              <Form onSubmit={handleUpdate}>
                <Row>
                  <Col md="12" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label" htmlFor="Title">
                        Title
                      </Label>
                      <Input
                        type="text"
                        id="Title"
                        name="Title"
                        value={wordInfo.name}
                        onChange={(e) =>
                          setWordInfo({ ...wordInfo, name: e.target.value })
                        }
                        placeholder="Title"
                      />
                    </FormGroup>
                  </Col>
                  <Col className="d-flex flex-sm-row flex-column mt-2 " sm="12">
                    <Button.Ripple
                      className="minwidth133 btnprimary"
                      type="submit"
                      color="primary"
                    >
                      Update
                    </Button.Ripple>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default Editgrade;
