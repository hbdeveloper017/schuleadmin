import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";

import LoadingContext from "../../../../utility/context/LoadingContext";
import Select from "react-select";
import { apiRequest } from "../../../../utility/apiRequest";
import toast from "react-hot-toast";

const Editgrade = () => {
  const { gradeData } = useLocation().state;
  const navigate = useNavigate();
  const { setLoading } = useContext(LoadingContext);
  const [schoolList, setSchoolList] = useState([]);
  const [gradeInfo, setGradeInfo] = useState({});

  useEffect(() => {
    getSchool();
  }, []);

  const getSchool = async () => {
    const resp = await apiRequest._getSchool();

    if (resp.status) {
      let data = resp.data.map((item) => {
        return {
          value: item._id,
          label: item.name,
        };
      });
      setSchoolList(data);

      const filteredInput = data.filter((item) =>
        gradeData.schools.some((school) => school.schoolID === item.value)
      );

      setGradeInfo({
        _id: gradeData._id,
        name: gradeData.name,
        schools: filteredInput,
      });
    }
  };

  const handleEditGrade = async (e) => {
    e.preventDefault();

    if (gradeInfo.name == "" || gradeInfo.schools.length < 1) {
      toast.error("You must fill all the details.");
      return false;
    }

    setLoading(true);

    const schoolIDs = gradeInfo.schools.map((item) => item.value);

    const payload = {
      name: gradeInfo.name,
      schools: schoolIDs,
    };

    const resp = await apiRequest._updateGrade(gradeInfo._id, payload);

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
          <h4 className="card-title mb-1 headingcard">Edit Grade</h4>
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
              <Form onSubmit={handleEditGrade}>
                <Row>
                  <Col md="6" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label" htmlFor="Title">
                        Title
                      </Label>
                      <Input
                        type="text"
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
                        isMulti
                        options={schoolList}
                        value={gradeInfo.schools}
                        onChange={(item) =>
                          setGradeInfo({ ...gradeInfo, schools: item })
                        }
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            padding: "5px 0",
                            borderRadius: 9,
                          }),
                        }}
                        components={{
                          Option: (props) => (
                            <div
                              key={props.data.value}
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
