import { API_BASE_URL, apiRequest } from "../../../utility/apiRequest";
import { Button, Col, Modal, ModalBody, Row } from "reactstrap";
import { Edit, Trash, XCircle } from "react-feather";
import React, { useContext, useEffect, useMemo, useState } from "react";

import DataTable from "react-data-table-component";
import FilterComponent from "./FilterComponent";
import { Link } from "react-router-dom";
import LoadingContext from "../../../utility/context/LoadingContext";
import PrimarySubjects from "./PrimarySubjects";
import ReactDragListView from "react-drag-listview";
import SecondarySubject from "./SecondarySubject";
import toast from "react-hot-toast";

const Table = () => {
  const { setLoading } = useContext(LoadingContext);

  const [filterSubject, setFilterSubject] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [filterText, setFilterText] = React.useState("");

  const [primarySubjects, setPrimarySubjects] = useState([]);
  const [secondarySubjects, setSecondarySubject] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [pageLoading, setPageLoading] = useState(false);

  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);

  useEffect(() => {
    setActiveTab(1);
    fetchSubject();
  }, []);

  const fetchSubject = async () => {
    setPageLoading(true);
    const resp = await apiRequest._getSubjects();

    setPageLoading(false);

    if (resp.status) {
      const primarySub = resp.data.filter((sub) => sub.type == "primary");
      const secondarySub = resp.data.filter((sub) => sub.type == "secondary");

      setPrimarySubjects(primarySub);
      setSecondarySubject(secondarySub);

      setFilterSubject(resp.data);
    }
  };

  useEffect(() => {
    // Perform any necessary UI updates when activeTab changes
    console.log("Active tab changed to:", activeTab);
  }, [activeTab]);

  const subHeaderComponent = useMemo(() => {
    return (
      <div className="d-flex justify-content-between">
        <div className="d-flex align-items-center btn-cancel-ok">
          <Button
            onClick={() => setActiveTab(1)}
            className={
              activeTab === 1
                ? "btn-add2 active me-2 ms-0"
                : "btn-add2 me-2 ms-0"
            }
          >
            Primary
          </Button>
          <Button
            onClick={() => setActiveTab(2)}
            className={activeTab === 2 ? "btn-add2 active" : "btn-add2"}
          >
            Secondary
          </Button>
        </div>
        <FilterComponent
          onFilter={(e) => {
            setFilterText(e.target.value);
            if (activeTab == 1) {
              let newData = filterSubject.filter(
                (item) =>
                  item.name
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                  item.type.toLowerCase().includes(e.target.value.toLowerCase())
              );
              setPrimarySubjects(
                newData.filter((sbj) => sbj.type == "primary")
              );
            }

            if (activeTab == 2) {
              let newData = filterSubject.filter(
                (item) =>
                  item.name
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                  item.type.toLowerCase().includes(e.target.value.toLowerCase())
              );
              setSecondarySubject(
                newData.filter((sbj) => sbj.type == "secondary")
              );
            }
          }}
          filterText={filterText}
        />
      </div>
    );
  }, [filterText, resetPaginationToggle, activeTab]);

  const handleSubjectUpdate = async (subjectInfo, index) => {
    if (index == 0) {
      return false;
    }
    setLoading(true);

    const formdata = new FormData();
    formdata.append("name", subjectInfo.name);
    formdata.append("type", subjectInfo.type);
    formdata.append("index", index);

    const resp = await apiRequest._updateSubject(subjectInfo._id, formdata);
    setLoading(false);
    if (resp.status) {
      toast.success(resp.message);
      fetchSubject();
    } else {
      toast.error(resp.message);
    }
  };

  const dragProps = {
    onDragEnd(fromIndex, toIndex) {
      const data =
        activeTab == 1 ? [...primarySubjects] : [...secondarySubjects];

      const item = data.splice(fromIndex, 1)[0];
      console.log(toIndex + 1, item);

      handleSubjectUpdate(item, toIndex + 1);
    },
    nodeSelector: ".rdt_TableRow",
    handleSelector: ".rdt_TableRow",
  };

  return (
    <React.Fragment>
      <Row className="mb-2">
        <Col xl="6" md="6">
          <h4 className="card-title mb-1 headingcard">Subjects</h4>
        </Col>
        <Col xl="6" md="6" className="text-end">
          <Button
            tag={Link}
            to="/pages/addsubject"
            state={{
              primaryLength: primarySubjects.length + 1,
              secondaryLength: secondarySubjects.length + 1,
            }}
            className="btn-add"
          >
            Add
          </Button>
        </Col>
      </Row>

      <div className="moveRow">
        <ReactDragListView {...dragProps}>
          {activeTab == 1 ? (
            <PrimarySubjects
              subjectList={primarySubjects}
              subHeaderComponent={subHeaderComponent}
              pageLoading={pageLoading}
            />
          ) : (
            <SecondarySubject
              subjectList={secondarySubjects}
              subHeaderComponent={subHeaderComponent}
            />
          )}
        </ReactDragListView>
      </div>
    </React.Fragment>
  );
};

export default Table;
