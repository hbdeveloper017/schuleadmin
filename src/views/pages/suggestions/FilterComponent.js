import React, { useState } from "react";
import SearchIcon from "@src/assets/images/img/search.svg";
import { FormGroup, Input, Label } from "reactstrap";

const FilterComponent = ({ filterText, onFilter, onTypeChange }) => {
  const [type, setType] = useState();
  return (
    <div className="d-flex">
      <FormGroup className="form-group" style={{ marginRight: "auto" }}>
        <Input
          type="select"
          value={type}
          onChange={(e) => {
            onTypeChange(e.target.value);
            setType(e.target.value);
          }}
          name="type"
          id="type"
          style={{ width: 200 }}
        >
          <option value="">Filter by type</option>
          <option value="positive">Positive</option>
          <option value="negative">Negative</option>
        </Input>
      </FormGroup>

      <div className="filtersearch_div ms-auto" style={{ maxWidth: "300px" }}>
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
    </div>
  );
};

export default FilterComponent;
