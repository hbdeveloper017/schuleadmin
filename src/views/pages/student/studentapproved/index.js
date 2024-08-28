import "@styles/react/pages/page-authentication.scss";

import React, { useContext } from "react";

import Table from "./Datatables";
import data from "./data";

const studentapproved = () => {
  return (
    <div className="card">
      <div className="card-body filterheader">
        <Table data={data} />
      </div>
    </div>
  );
};
export default studentapproved;
