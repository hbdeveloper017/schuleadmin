import React, { useEffect, useState } from "react";
import SearchIcon from "@src/assets/images/img/search.svg";
import { Col, FormGroup, Input, Row } from "reactstrap";
import Select from "react-select";
import { apiRequest } from "../../../../../../utility/apiRequest";

const FilterComponent = ({ filterText, onFilter, onSubjectChange }) => {
  const [subjectList, setSubjectList] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    getSubjectList();
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
  return (
    <React.Fragment>
      <Row className="mb-2">
        <Col xl="6" md="6">
          <h4 className="card-title mb-1  headingcard">Referral</h4>
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
