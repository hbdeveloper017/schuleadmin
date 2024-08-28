import React, { useEffect, useState } from "react";
import SearchIcon from "@src/assets/images/img/search.svg";
import { Input } from "reactstrap";
import Select from "react-select";
import { apiRequest } from "../../../../utility/apiRequest";

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
    <div className="d-flex justify-content-between align-items-center">
      <div className="selWidth">
        <Select
          isMulti
          options={subjectList}
          value={subjects}
          onChange={(e) => {
            setSubjects(e);
            onSubjectChange(e);
          }}
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              padding: "5px 0",
              borderRadius: 9,
            }),
          }}
          placeholder={"Filter By Subject"}
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
      </div>
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
