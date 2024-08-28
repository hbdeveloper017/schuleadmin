import { Col, FormGroup, Input, Row } from "reactstrap";
import React, { useEffect, useState } from "react";

import SearchIcon from "@src/assets/images/img/search.svg";
import Select from "react-select";
import { apiRequest } from "../../../../utility/apiRequest";

const FilterComponent = ({ filterText, onFilter, onNewFilter, onReset }) => {
  const [subjectList, setSubjectList] = useState([]);
  const [subjects, setSubjects] = useState(null);
  const [stateList, setStateList] = useState([]);
  const [states, setStates] = useState(null);
  const [schoolList, setSchoolList] = useState([]);
  const [schools, setSchool] = useState(null);
  const [gradeList, setGradeList] = useState([]);
  const [grades, setGrades] = useState(null);
  const [isTrailUser, setIsTrailUser] = useState(false);

  useEffect(() => {
    getSubjectList();
    getStateList();
    getSchoolList();
    getGradeList();
  }, []);

  const getSubjectList = async () => {
    const resp = await apiRequest._getSubjects();
    if (resp.status) {
      let data = await resp.data.map((item) => {
        return {
          value: item._id,
          label: item.name,
        };
      });
      setSubjectList(data);
    }
  };

  const getStateList = async () => {
    const resp = await apiRequest._getStateList();
    if (resp.status) {
      let data = await resp.data.map((item) => {
        return {
          value: item._id,
          label: item.name,
        };
      });
      setStateList(data);
    }
  };

  const getSchoolList = async () => {
    const resp = await apiRequest._getSchool();
    if (resp.status) {
      let data = await resp.data.map((item) => {
        return {
          value: item._id,
          label: item.name,
        };
      });
      setSchoolList(data);
    }
  };

  const getGradeList = async () => {
    const resp = await apiRequest._getGrades();
    if (resp.status) {
      let data = await resp.data.map((item) => {
        return {
          value: item._id,
          label: item.name,
        };
      });
      setGradeList(data);
    }
  };

  return (
    <React.Fragment>
      <Row className="mb-2">
        <Col xl="6" md="6">
          <h4 className="card-title mb-1  headingcard">Approved</h4>
        </Col>
        <Col xl="6" md="6" className={"text-end"}>
          <button
            onClick={() => {
              const selectedSub = subjects && subjects.map((e) => e?.value);
              const selectedSchool = schools && schools.map((e) => e?.value);
              const selectedState = states && states.map((e) => e?.value);
              const selectedGrade = grades && grades.map((e) => e?.value);

              if (
                selectedSub?.length > 0 ||
                selectedSchool?.length > 0 ||
                selectedState?.length > 0 ||
                selectedGrade?.length > 0 ||
                isTrailUser
              )
                onNewFilter({
                  subjects: selectedSub,
                  schools: selectedSchool,
                  states: selectedState,
                  grades: selectedGrade,
                  isTrailUser,
                });
            }}
            className="btn btn-primary me-1"
          >
            Apply Filter
          </button>
          <button
            onClick={() => {
              if (
                !(
                  subjects == null &&
                  states == null &&
                  schools == null &&
                  grades == null &&
                  isTrailUser == false
                )
              )
                onReset();
              setSubjects(null);
              setStates(null);
              setSchool(null);
              setGrades(null);
              setIsTrailUser(false);
            }}
            className="btn btn-danger"
          >
            Reset Filter
          </button>
        </Col>
      </Row>
      <Row className="mb-2">
        <Col md="4">
          <FormGroup className="form-group">
            <Select
              isMulti
              options={subjectList}
              value={subjects}
              onChange={(e) => {
                setSubjects(e);
              }}
              placeholder={"Filter By Subject"}
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

        <Col md="4">
          <FormGroup className="form-group">
            <Select
              isMulti
              options={schoolList}
              value={schools}
              onChange={(e) => {
                setSchool(e);
              }}
              placeholder={"Filter By School"}
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
        <Col md="4">
          <Select
            isMulti
            options={gradeList}
            value={grades}
            onChange={(e) => {
              setGrades(e);
            }}
            placeholder={"Filter By Grade"}
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
        </Col>
        <Col md="4">
          <FormGroup className="form-group">
            <Select
              isMulti
              options={stateList}
              value={states}
              onChange={(e) => {
                setStates(e);
              }}
              placeholder={"Filter By State"}
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
        <Col md="4">
          <FormGroup className="form-group">
            <Input
              type="checkbox"
              id="trail-user"
              name="trail-user"
              value={isTrailUser}
              checked={isTrailUser}
              onChange={() => {
                setIsTrailUser(!isTrailUser);
              }}
              style={{ marginRight: "10px" }}
            />
            <label for="trail-user">Trial User</label>
          </FormGroup>
        </Col>
      </Row>

      <div
        className="filtersearch_div ms-auto mb-2"
        style={{ maxWidth: "300px" }}
      >
        <Input
          id="search"
          type="text"
          placeholder="Search..."
          value={filterText}
          onChange={onFilter}
          style={{ height: "42px" }}
        />
        <img className="searchiconbtn" src={SearchIcon} />
      </div>
    </React.Fragment>
  );
};

export default FilterComponent;
