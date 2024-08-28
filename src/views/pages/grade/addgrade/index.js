// ** React Imports

import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";

import LoadingContext from "../../../../utility/context/LoadingContext";
import Select from "react-select";
import { apiRequest } from "../../../../utility/apiRequest";
import toast from "react-hot-toast";

const Addgrade = () => {
  const navigate = useNavigate();
  const { setLoading } = useContext(LoadingContext);
  const [schoolList, setSchoolList] = useState([]);
  const [gradeInfo, setGradeInfo] = useState({
    name: "",
    school: [],
  });

  useEffect(() => {
    getSchool();
  }, []);

  const getSchool = async () => {
    const resp = await apiRequest._getSchool();
    console.log(resp);
    if (resp.status) {
      let data = resp.data.map((item) => {
        return {
          value: item._id,
          label: item.name,
        };
      });
      setSchoolList(data);
    }
  };

  const handleAddGrade = async (e) => {
    e.preventDefault();
    if (gradeInfo.name == "" || gradeInfo.school.length < 1) {
      toast.error("You must fill all the details.");
      return false;
    }
    setLoading(true);
    const schoolIDs = gradeInfo.school.map((item) => item.value);

    const payload = {
      name: gradeInfo.name,
      schools: schoolIDs,
    };

    const resp = await apiRequest._addGrade(payload);
    setLoading(false);

    if (resp.status) {
      toast.success(resp.message);
      setGradeInfo({
        name: "",
        school: [],
      });
      navigate(-1);
    } else {
      toast.error(resp.message);
    }

    console.log(payload);
  };

  return (
    <React.Fragment>
      <Row className="mb-2">
        <Col xl="6" md="6">
          <h4 className="card-title mb-1 headingcard">Add Grade</h4>
        </Col>
        <Col xl="6" md="6" className="text-end">
          <Link to="/pages/grade">
            <Button className="btn-add">Back</Button>
          </Link>
        </Col>
      </Row>
      <Row>
        <Col sm="12">
          <div className="card">
            <div className="card-body">
              <Form onSubmit={handleAddGrade}>
                <Row>
                  <Col md="6" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label" htmlFor="Title">
                        Title
                      </Label>
                      <Input
                        type="number"
                        id="Title"
                        name="Title"
                        value={gradeInfo.name}
                        onChange={(e) =>
                          setGradeInfo({ ...gradeInfo, name: e.target.value })
                        }
                        placeholder="Title"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label" for="School">
                        School
                      </Label>
                      <Select
                        value={gradeInfo.school}
                        onChange={(item) =>
                          setGradeInfo({ ...gradeInfo, school: item })
                        }
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            padding: "5px 0",
                            borderRadius: 9,
                          }),
                        }}
                        options={schoolList}
                        isMulti
                        components={{
                          Option: (props) => (
                            <div
                              onClick={() => props.selectOption(props.data)}
                              style={{
                                padding: "10px 10px",
                                cursor: "pointer",
                              }}
                            >
                              <span>{props.data.label}</span>
                            </div>
                          ),
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <p
                    style={{
                      marginTop: 10,
                      fontSize: 14,
                      fontWeight: 300,
                      color: "#000",
                    }}
                  >
                    <strong>Note : </strong>
                    Numbers are accepted.
                  </p>
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
export default Addgrade;
