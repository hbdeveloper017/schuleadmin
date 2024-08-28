import "@styles/react/pages/page-authentication.scss";

import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  Row,
} from "reactstrap";
import React, { useContext, useEffect, useState } from "react";

import LoadingContext from "../../../../../utility/context/LoadingContext";
import Select from "react-select";
import { apiRequest } from "../../../../../utility/apiRequest";
import toast from "react-hot-toast";

const Subjectstariff = ({ studentInfo }) => {
  const { setLoading } = useContext(LoadingContext);
  const [modal2, setModal2] = useState(false);
  const toggle2 = () => setModal2(!modal2);

  const [subjectList, setSubjectList] = useState();
  const [subjectFreeLessons, setSubjectFreeLessons] = useState(
    studentInfo && studentInfo.freeLessons
  );
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  useEffect(() => {
    getTariffDetails();
  }, []);

  const getTariffDetails = async () => {
    const resp = await apiRequest._getTariffInfo(studentInfo.userID);
    if (resp.status) {
      // const formatedSubject2 = studentInfo.subjects.map((item) => {
      //   return {
      //     groupLessonsQuota: 0,
      //     groupTariff: 0,
      //     individualLessonsQuota: 0,
      //     individualTariff: 0,
      //     value: item._id,
      //     label: item.name,
      //   };
      // });

      const formatedSubject = resp.data.map((item) => {
        return {
          value: item.subjectID,
          label: item.subjectName,
          individualTariff: item.individualTariff,
          individualLessonsQuota: item.individualLessonsQuota,
          groupTariff: item.groupTariff,
          groupLessonsQuota: item.groupLessonsQuota,
          initialGroupQuota: item.groupLessonsQuota,
          initialIndividualQuota: item.individualLessonsQuota,
        };
      });

      setSubjectList(formatedSubject);
    } else {
      const formatedSubject2 = studentInfo.subjects.map((item) => {
        return {
          groupLessonsQuota: 0,
          groupTariff: 0,
          individualLessonsQuota: 0,
          individualTariff: 0,
          value: item._id,
          label: item.name,
          initialGroupQuota: item.groupLessonsQuota,
          initialIndividualQuota: item.individualLessonsQuota,
        };
      });
      setSubjectList(formatedSubject2);
    }
  };

  const handleTariffValue = (index, value, type) => {
    if (/[-+*!@#$%^&()_+\=\[\]{};:"\\|,.<>\/?]/.test(value)) {
      toast.error("negative values are not allowed.");
      return false;
    }

    const oldIndividualValue = [...subjectList];
    console.log(oldIndividualValue);
    type == 1
      ? (oldIndividualValue[index].individualLessonsQuota = value
          ? parseInt(value)
          : null)
      : (oldIndividualValue[index].groupLessonsQuota = value
          ? parseInt(value)
          : null);

    setSubjectList(oldIndividualValue);
  };

  const removeSelectedSubject = (index) => {
    const oldIndividualValue = [...selectedSubjects];
    oldIndividualValue.splice(index, 1);

    setSelectedSubjects(oldIndividualValue);
  };

  const handleFreeLessonsUpdate = async () => {
    let dict = {
      freeLessons: subjectFreeLessons,
    };
    const resp = await apiRequest._updateFreeLessons(studentInfo.userID, dict);
    console.log("response: ", resp);
    if (resp.status) {
      toast.success(resp.message);
      setLoading(false);

      setSubjectFreeLessons(subjectFreeLessons);
    } else {
      toast.error(resp.message);
      setLoading(false);
      setSubjectFreeLessons(studentInfo && studentInfo.freeLessons);
    }
  };

  const handleTariffUpdate = async (e) => {
    e.preventDefault();

    setLoading(true);

    const individual_tariffs = subjectList.map((item) => ({
      subjectID: item.value,
      lessonType: "individual",
      lessons: item.individualTariff,
      lessonQuota: item?.individualLessonsQuota || 0,
      initialLessonQuota: item?.initialIndividualQuota,
    }));

    const group_tariffs = subjectList.map((item) => ({
      subjectID: item.value,
      lessonType: "group",
      lessons: item?.groupTariff,
      lessonQuota: item?.groupLessonsQuota || 0,
      initialLessonQuota: item?.initialGroupQuota,
    }));

    let finalArray = [...individual_tariffs, ...group_tariffs];

    const payload = {
      tariff: finalArray,
      individualTariff: individual_tariffs.reduce(
        (acc, subject) => acc + subject.lessonQuota,
        0
      ),
      groupTariff: group_tariffs.reduce(
        (acc, subject) => acc + subject.lessonQuota,
        0
      ),
    };

    console.log(payload, "payload");

    // return;

    // return;

    const resp = await apiRequest._updateTariffInfo(
      studentInfo.userID,
      payload
    );

    setLoading(false);

    if (resp.status) {
      toast.success(resp.message);
    } else {
      toast.error(resp.message);
    }
  };

  return (
    <React.Fragment>
      <Modal centered isOpen={modal2} toggle={toggle2}>
        <ModalBody className="p-2 statusmodal_body">
          <h2 className="status_heading" style={{ textAlign: "left" }}>
            Add Subject
          </h2>
          <Row>
            <Col md="12" sm="12">
              <FormGroup className="form-group">
                <Label className="form-label">Subject</Label>
                <Select
                  isMulti
                  name="colors"
                  options={subjectList}
                  isClearable={false}
                  value={selectedSubjects}
                  onChange={(item) => setSelectedSubjects(item)}
                />
              </FormGroup>
            </Col>
          </Row>
          <div className="btn-cancel-ok mt-1">
            {/* <Button className="btn-cancel me-1" onClick={toggle2}>
              Cancel
            </Button> */}
            <Button color="primary" onClick={toggle2}>
              Close
            </Button>
          </div>
        </ModalBody>
      </Modal>

      <Row>
        <Col sm="12">
          <div className="card">
            <div className="card-body">
              <Form onSubmit={handleTariffUpdate}>
                <Row>
                  <Col md="12" sm="12">
                    <FormGroup className="form-group mb_8">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <Label className="form-label fs-4">Subject</Label>
                        {/* <Button className="btn-add" onClick={toggle2}>
                          Add Subject
                        </Button> */}
                      </div>
                      <div className="subjectadd_form">
                        {subjectList &&
                          subjectList.map((item, index) => (
                            <span
                              className="subjectadd"
                              style={{ textTransform: "capitalize" }}
                            >
                              {item.label}{" "}
                              <span
                                style={{ cursor: "pointer" }}
                                onClick={() => removeSelectedSubject(index)}
                              ></span>
                            </span>
                          ))}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="12" sm="12">
                    <FormGroup className="form-group IndividualTariff_div mb_8">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <Label
                          className="form-label"
                          htmlFor="IndividualTariff"
                        >
                          Total Individual Tariff
                        </Label>
                        <Input
                          type="number"
                          disabled
                          className="w-auto"
                          id="IndividualTariff"
                          name="IndividualTariff"
                          value={subjectList?.reduce(
                            (acc, subject) =>
                              acc +
                              (subject.individualLessonsQuota !== null
                                ? subject.individualLessonsQuota
                                : 0),
                            0
                          )}
                          placeholder="Total Individual Tariff"
                        />
                      </div>
                      <div className="subjectTariff_form">
                        {subjectList?.map((item, index) => (
                          <FormGroup className="form-group me-1">
                            <Label
                              style={{
                                textTransform: "capitalize",
                                whiteSpace: "nowrap",
                              }}
                              className="form-label d-block"
                              htmlFor="Math"
                            >
                              {item.label}
                              <small style={{ marginLeft: 5 }}>
                                (
                                {[
                                  item.individualLessonsQuota,
                                  "/",
                                  item.individualTariff,
                                ]}
                                )
                              </small>
                            </Label>
                            <Input
                              type="number"
                              id={item.label + index}
                              name={item.label + index}
                              value={item.individualLessonsQuota}
                              min={0}
                              onChange={(e) =>
                                handleTariffValue(index, e.target.value, 1)
                              }
                              placeholder={item.label}
                            />
                          </FormGroup>
                        ))}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="12" sm="12">
                    <FormGroup className="form-group IndividualTariff_div mb_8">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <Label className="form-label" htmlFor="GroupTariff">
                          Total Group Tariff
                        </Label>
                        <Input
                          type="number"
                          disabled
                          className="w-auto"
                          id="GroupTariff"
                          name="GroupTariff"
                          value={subjectList?.reduce(
                            (acc, subject) =>
                              acc +
                              (subject.groupLessonsQuota !== null
                                ? subject.groupLessonsQuota
                                : 0),
                            0
                          )}
                          placeholder="Total Group Tariff"
                        />
                      </div>
                      <div className="subjectTariff_form">
                        {subjectList?.map((item, index) => (
                          <FormGroup className="form-group me-1">
                            <Label
                              className="form-label d-block"
                              htmlFor="Math2"
                              style={{
                                textTransform: "capitalize",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {item.label}
                              <small style={{ marginLeft: 5 }}>
                                (
                                {[
                                  item.groupLessonsQuota,
                                  "/",
                                  item.groupTariff,
                                ]}
                                )
                              </small>
                            </Label>
                            <Input
                              type="number"
                              min={0}
                              id={item.groupLessonsQuota}
                              name={item.groupLessonsQuota}
                              value={item.groupLessonsQuota}
                              onChange={(e) =>
                                handleTariffValue(index, e.target.value, 2)
                              }
                              placeholder={item.label}
                            />
                          </FormGroup>
                        ))}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col className="d-flex flex-sm-row flex-column mt-2 " sm="12">
                    <Button.Ripple
                      className="minwidth133 btnprimary mb-2"
                      type="submit"
                      color="primary"
                    >
                      Update
                    </Button.Ripple>
                  </Col>
                </Row>
              </Form>

              <Form>
                <Row>
                  <Col md="12" sm="12">
                    <FormGroup className="form-group IndividualTariff_div mb_8">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <Label className="form-label" htmlFor="GroupTariff">
                          Free Lesson
                        </Label>
                      </div>
                      <div className="subjectTariff_form w-100">
                        {console.log("subjectFreeLessons", subjectFreeLessons)}
                        <FormGroup className="form-group me-1 w-100">
                          <Input
                            type="number"
                            placeholder={"0"}
                            value={subjectFreeLessons}
                            onChange={(event) => {
                              if (
                                /[-+*!@#$%^&()_+\=\[\]{};:"\\|,.<>\/?]/.test(
                                  event.target.value
                                )
                              ) {
                                toast.error("negative values are not allowed.");
                                return false;
                              }
                              setSubjectFreeLessons(event.target.value);
                            }}
                          />
                        </FormGroup>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col className="d-flex flex-sm-row flex-column mt-2 " sm="12">
                    <Button.Ripple
                      className="minwidth133 btnprimary"
                      color="primary"
                      onClick={handleFreeLessonsUpdate}
                    >
                      Update
                    </Button.Ripple>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default Subjectstariff;
