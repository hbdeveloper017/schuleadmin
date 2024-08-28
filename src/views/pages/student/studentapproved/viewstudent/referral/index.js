import React, { useContext } from "react";
import data from "./data";
import Table from "./Datatables";
import "@styles/react/pages/page-authentication.scss";
const Referral = ({ studentInfo }) => {
  return (
    <div className="card">
      <div className="card-body filterheader">
        <Table data={data} studentInfo={studentInfo} />
      </div>
    </div>
  );
};
export default Referral;
