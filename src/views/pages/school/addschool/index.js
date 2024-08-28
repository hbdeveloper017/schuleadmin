// ** React Imports

import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useState } from "react";
import { Upload, X } from "react-feather";

import LoadingContext from "../../../../utility/context/LoadingContext";
import { apiRequest } from "../../../../utility/apiRequest";
import toast from "react-hot-toast";

const Addschool = () => {
  const navigate = useNavigate();
  const { setLoading } = useContext(LoadingContext);
  const [schoolInfo, setSchoolInfo] = useState({
    name: "",
    image: "",
  });

  const handleSchoolAdd = async (e) => {
    e.preventDefault();
    if (
      schoolInfo.name == "" ||
      schoolInfo.image == "" ||
      schoolInfo.showImage == ""
    ) {
      toast.error("You must fill all the details.");
      return false;
    }
    setLoading(true);

    const formdata = new FormData();
    formdata.append("name", schoolInfo.name);
    formdata.append("image", schoolInfo.image);

    const resp = await apiRequest._addSchool(formdata);

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
          <h4 className="card-title mb-1 headingcard">Add School</h4>
        </Col>
        <Col xl="6" md="6" className="text-end">
          <Link to="/pages/school">
            <Button className="btn-add">Back</Button>
          </Link>
        </Col>
      </Row>
      <Row>
        <Col sm="12">
          <div className="card">
            <div className="card-body">
              <Form onSubmit={handleSchoolAdd}>
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
                        value={schoolInfo.name}
                        onChange={(e) =>
                          setSchoolInfo({ ...schoolInfo, name: e.target.value })
                        }
                        placeholder="Title"
                      />
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
                        onChange={(e) => {
                          setSchoolInfo({
                            ...schoolInfo,
                            image: e.target.files[0],
                          });
                        }}
                      />
                      <label className="fileupload" htmlFor="addCV">
                        <Upload className="uplaodicon" size={30} />
                        <h3>
                          {schoolInfo.image
                            ? schoolInfo.image.name
                            : "Drag & Drop Here"}
                        </h3>
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
export default Addschool;
