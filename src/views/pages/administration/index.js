import React, { useContext } from "react";
import data from "./data";
import Table from "./Datatables";
import "@styles/react/pages/page-authentication.scss";

const Administration = () => {
  return (
    <div className="card">
      <div className="card-body filterheader">
        <Table data={data} />
      </div>
    </div>
  );
};
export default Administration;
