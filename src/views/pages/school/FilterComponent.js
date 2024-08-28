import { Input } from "reactstrap";
import React from "react";
import SearchIcon from "@src/assets/images/img/search.svg";

const FilterComponent = ({ filterText, onFilter }) => {
  return (
    <>
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
    </>
  );
};

export default FilterComponent;
