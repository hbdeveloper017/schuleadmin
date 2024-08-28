// ** React Imports

import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";

import LoadingContext from "../../../../utility/context/LoadingContext";
import { Upload } from "react-feather";
import { apiRequest } from "../../../../utility/apiRequest";
import toast from "react-hot-toast";

const Addsubject = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { setLoading } = useContext(LoadingContext);
  const [subjectInfo, setSubjectInfo] = useState({
    title: "",
    image: "",
    type: "primary",
    index: state.primaryLength,
  });

  console.log(state);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      subjectInfo.title == "" ||
      subjectInfo.image == "" ||
      subjectInfo.type == ""
    ) {
      toast.error("Please fill the details.");
      return false;
    }
    setLoading(true);

    const formdata = new FormData();
    formdata.append("name", subjectInfo.title);
    formdata.append("image", subjectInfo.image);
    formdata.append("type", subjectInfo.type);
    formdata.append("index", subjectInfo.index);

    const resp = await apiRequest._addSubject(formdata);
    setLoading(false);
    if (resp.status) {
      toast.success(resp.message);
      navigate(-1);
      setSubjectInfo({
        title: "",
        image: "",
        type: "primary",
      });
    } else {
      toast.error(resp.message);
    }
  };

  return (
    <React.Fragment>
      <Row className="mb-2">
        <Col xl="6" md="6">
          <h4 className="card-title mb-1 headingcard">Add Subject</h4>
        </Col>
        <Col xl="6" md="6" className="text-end">
          <Link to="/pages/subjects">
            <Button className="btn-add">Back</Button>
          </Link>
        </Col>
      </Row>
      <Row>
        <Col sm="12">
          <div className="card">
            <div className="card-body">
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md="6" sm="6">
                    <FormGroup className="form-group">
                      <Label className="form-label" htmlFor="Title">
                        Title
                      </Label>
                      <Input
                        type="text"
                        id="Title"
                        name="Title"
                        value={subjectInfo.title}
                        onChange={(e) =>
                          setSubjectInfo({
                            ...subjectInfo,
                            title: e.target.value,
                          })
                        }
                        placeholder="Title"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6" sm="6">
                    <FormGroup className="form-group">
                      <Label className="form-label" htmlFor="Title">
                        Type
                      </Label>
                      <Input
                        id="exampleSelect"
                        name="select"
                        type="select"
                        onChange={(e) => {
                          setSubjectInfo({
                            ...subjectInfo,
                            type: e.target.value,
                            index:
                              e.target.value == "primary"
                                ? state.primaryLength
                                : state.secondaryLength,
                          });
                        }}
                      >
                        <option value="primary">Primary</option>
                        <option value="secondary">Secondary</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md="12" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label">Upload Image</Label>
                      <Input
                        id="addCV"
                        name="addCV"
                        className="displaynone"
                        accept="image/*"
                        type="file"
                        onChange={(event) => {
                          setSubjectInfo({
                            ...subjectInfo,
                            image: event.target.files[0],
                          });
                        }}
                      />
                      <label className="fileupload" htmlFor="addCV">
                        <Upload className="uplaodicon" size={30} />
                        <h3> {subjectInfo.image.name || "Drag & Drop Here"}</h3>
                      </label>
                    </FormGroup>
                  </Col>
                  <Col className="d-flex flex-sm-row flex-column mt-2 " sm="12">
                    <Button.Ripple
                      className="minwidth133 btnprimary"
                      type="submit"
                      color="primary"
                    >
                      Save
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
export default Addsubject;
