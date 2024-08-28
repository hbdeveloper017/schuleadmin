import React, { useContext } from "react";
import data from "./data";
import Table from "./Datatables";
import "@styles/react/pages/page-authentication.scss";

const TabStudents = ({ teacherInfo }) => {
  return (
    <div className="card">
      <div className="card-body filterheader">
        <Table data={data} teacherInfo={teacherInfo} />
      </div>
    </div>
  );
};
export default TabStudents;
