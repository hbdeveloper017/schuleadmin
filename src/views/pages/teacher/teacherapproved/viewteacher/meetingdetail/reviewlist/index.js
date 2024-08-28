import React, { useContext } from "react";
import data from "./data";
import Table from "./Datatables";
import "@styles/react/pages/page-authentication.scss";

const ReviewList = () => {
  return (
    <Table data={data} />
  );
};
export default ReviewList;
