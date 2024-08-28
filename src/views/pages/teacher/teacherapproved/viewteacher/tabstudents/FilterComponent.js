import React from "react";
import SearchIcon from "@src/assets/images/img/search.svg";
import { Input } from "reactstrap";
import Select from "react-select";

const subjectList = [
  {
    _id: "659fc8d8653132d491dd5c8f",
    name: "Mathematik",
    image: "uploads/1711086024345-math.png",
    type: "primary",
  },
  {
    _id: "659fc8d8653132d491dd5c90",
    name: "Englisch",
    image: "uploads/1711086208906-english.png",
    type: "primary",
  },
  {
    _id: "659fc8d8653132d491dd5c91",
    name: "Französisch",
    image: "uploads/1711086217436-french.png",
    type: "primary",
  },
  {
    _id: "659fc8d8653132d491dd5c92",
    name: "Deutsch",
    image: "uploads/1711086264760-german.png",
    type: "primary",
  },
  {
    _id: "659fc8d8653132d491dd5c95",
    name: "Latein",
    image: "uploads/1711086306682-bdd24c155988295cc9fa50e6d4af40d8.png",
    type: "primary",
  },
  {
    _id: "659fc8d8653132d491dd5c96",
    name: "Deutsch als Fremdsprache",
    image: "uploads/1711086273409-german.png",
    type: "secondary",
  },
  {
    _id: "659fc8d8653132d491dd5c97",
    name: "Physik",
    image: "uploads/static/subjects/physik.png",
    type: "secondary",
  },
  {
    _id: "659fc8d8653132d491dd5c94",
    name: "Geschichte",
    image: "uploads/static/subjects/geschichte.png",
    type: "secondary",
  },
  {
    _id: "659fc8d8653132d491dd5c93",
    name: "Geographie",
    image: "uploads/static/subjects/geographie.png",
    type: "secondary",
  },
  {
    _id: "65f423de37cd77a7c5ea122d",
    name: "subject updated again",
    image: "uploads/1711971738544-companyPlaceholder.png",
    type: "primary",
  },
];

const FilterComponent = ({ filterText, onFilter }) => {


  return (
    <div className="d-flex justify-content-between align-items-center">
      {/* <div className="selWidth">
      <Select
        isMulti
        options={subjectList}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            padding: "5px 0",
            borderRadius: 9,
          }),
        }}
        defaultInputValue="Filter By Subject"
        components={{
          Option: (props) => (
            <div
              onClick={() => props.selectOption(props.data)}
              style={{
                padding: "10px 10px",
                cursor: "pointer",
              }}
            >
              <span>{props.data.name}</span>
            </div>
          ),
        }}
      />
      </div> */}
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
