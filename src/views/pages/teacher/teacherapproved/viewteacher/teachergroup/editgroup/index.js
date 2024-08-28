// ** React Imports

import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { Camera, Edit, X } from "react-feather";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";

import { apiRequest } from "../../../../../../../utility/apiRequest";
import toast from "react-hot-toast";

const Editgroup = () => {
  const navigate = useNavigate();
  const { details } = useLocation().state;
  const [group, setGroup] = useState({
    title: details.title,
    memberCapacity: details.memberCapacity,
  });
  const [err, setErr] = useState({
    title: "",
    memberCapacity: "",
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (group.title == "") {
      toast.error("Title is required.");
      return false;
    }
    if (group.memberCapacity < 5) {
      toast.error("Member capacity at least 5.");
      return false;
    }

    const resp = await apiRequest._updateGroup(
      details.teacherID,
      details._id,
      group
    );
    if (resp.status) {
      navigate(-1);
      toast.success(resp.message);
    } else {
      toast.error(resp.message);
    }
  };
  return (
    <React.Fragment>
      <Row className="mb-2">
        <Col xl="6" md="6">
          <h4 className="card-title mb-1 headingcard">Edit Group</h4>
        </Col>
        <Col xl="6" md="6" className="text-end">
          <Link to={-1}>
            <Button className="btn-add">Back</Button>
          </Link>
        </Col>
      </Row>

      <Row>
        <Col sm="12">
          <div className="card">
            <div className="card-body">
              <Form onSubmit={handleUpdate}>
                <h4 className="card-title mb-1 headingcard">Edit Group</h4>
                <Row>
                  <Col md="6" sm="6">
                    <FormGroup className="form-group">
                      <Label className="form-label" for="title">
                        Title
                      </Label>
                      <Input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        value={group.title}
                        onChange={(e) =>
                          setGroup({
                            ...group,
                            title: e.target.value,
                          })
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6" sm="6">
                    <FormGroup className="form-group">
                      <Label className="form-label" for="fname">
                        Member Capacity
                      </Label>
                      <Input
                        type="text"
                        id="memberCapacity"
                        name="memberCapacity"
                        placeholder="Member Capacity"
                        value={group.memberCapacity}
                        onChange={(e) =>
                          setGroup({
                            ...group,
                            memberCapacity: e.target.value,
                          })
                        }
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
export default Editgroup;
