// ** React Imports

import { API_BASE_URL, apiRequest } from "../../../../utility/apiRequest";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Upload, X } from "react-feather";

import LoadingContext from "../../../../utility/context/LoadingContext";
import subjectimg1 from "@src/assets/images/img/subjectimg1.png";
import toast from "react-hot-toast";
import { useContext } from "react";

const Editsubject = () => {
  const navigation = useNavigate();
  const { data } = useLocation().state;
  const { setLoading } = useContext(LoadingContext);
  const [subjectInfo, setSubjectInfo] = useState({
    _id: "",
    name: "",
    status: "",
    image: "",
    type: "",
  });

  useEffect(() => {
    setSubjectInfo({
      _id: data._id,
      name: data.name,
      status: data.status,
      image: data.image,
      showIamge: API_BASE_URL + "/" + data.image,
      type: data.type,
    });
  }, []);

  const handleSubjectUpdate = async (e) => {
    e.preventDefault();
    if (
      subjectInfo.name == "" ||
      subjectInfo.image == "" ||
      subjectInfo.type == ""
    ) {
      toast.error("You must fill all the details");
      return false;
    }
    setLoading(true);

    const formdata = new FormData();
    formdata.append("name", subjectInfo.name);
    formdata.append("image", subjectInfo.image);
    formdata.append("type", subjectInfo.type);

    const resp = await apiRequest._updateSubject(subjectInfo._id, formdata);
    setLoading(false);
    if (resp.status) {
      toast.success(resp.message);
      navigation(-1);
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
          <h4 className="card-title mb-1 headingcard">Edit Subject</h4>
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
              <Form onSubmit={handleSubjectUpdate}>
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
                        value={subjectInfo.name}
                        onChange={(e) =>
                          setSubjectInfo({
                            ...subjectInfo,
                            name: e.target.value,
                          })
                        }
                        placeholder="Title"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6" sm="6">
                    <FormGroup className="form-group">
                      <Label className="form-label" htmlFor="Title">
                        Title
                      </Label>
                      <Input
                        id="exampleSelect"
                        name="select"
                        type="select"
                        disabled
                        value={subjectInfo.type}
                        onChange={(e) =>
                          setSubjectInfo({
                            ...subjectInfo,
                            type: e.target.value,
                          })
                        }
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
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setSubjectInfo({
                            ...subjectInfo,
                            image: e.target.files[0],
                            showIamge: URL.createObjectURL(e.target.files[0]),
                          })
                        }
                      />
                      <label className="fileupload" htmlFor="addCV">
                        <Upload className="uplaodicon" size={30} />
                        <h3>Drag & Drop Here</h3>
                      </label>
                      {subjectInfo.showIamge && (
                        <div className="formimg">
                          <img src={subjectInfo.showIamge} />
                          <X
                            className="closebtn"
                            size={10}
                            onClick={() =>
                              setSubjectInfo({
                                ...subjectInfo,
                                showIamge: "",
                                image: "",
                              })
                            }
                          />
                        </div>
                      )}
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
export default Editsubject;
