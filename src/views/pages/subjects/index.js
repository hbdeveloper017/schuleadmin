import "@styles/react/pages/page-authentication.scss";

import React from "react";
import Table from "./Datatables";

const Subjects = () => {
  return (
    <div className="card">
      <div className="card-body filterheader">
        <Table />
      </div>
    </div>
  );
};
export default Subjects;
