import "@styles/react/pages/page-authentication.scss";

import { API_BASE_URL, apiRequest } from "../../../../../utility/apiRequest";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import React, { useContext, useEffect, useState } from "react";

import LoadingContext from "../../../../../utility/context/LoadingContext";
import moment from "moment";
import toast from "react-hot-toast";

const Availability = ({ studentInfo }) => {
  const { setLoading } = useContext(LoadingContext);
  const [availabilityData, setAvailabilityData] = useState([]);

  useEffect(() => {
    getAvailability();
  }, []);

  const getAvailability = async () => {
    const resp = await apiRequest._getStudentAvailability(studentInfo.userID);

    if (resp.status) {
      let oldAvailability = [];

      resp.data.forEach((element, index) => {
        oldAvailability.push({
          id: element.day,
          day:
            element.day == 1
              ? "Sun"
              : element.day == 2
              ? "Mon"
              : element.day == 3
              ? "Tue"
              : element.day == 4
              ? "Wed"
              : element.day == 5
              ? "Thu"
              : element.day == 6
              ? "Fri"
              : element.day == 7
              ? "Sat"
              : null,
          from: element.available
            ? moment(element.from, "hh:mm A").format("HH:mm")
            : "",
          to: element.available
            ? moment(element.to, "hh:mm A").format("HH:mm")
            : "",
          isSelected: element.available,
        });
      });

      setAvailabilityData(oldAvailability);
    }
  };

  const handleSubmit = async () => {
    let data = availabilityData.filter(
      (item) => item.isSelected && (item.from === "" || item.to === "")
    );

    if (data.length > 0) {
      console.log(data);
      toast.error("Please fill the availability time.");
      return false;
    }

    var formdata = [];

    availabilityData.forEach((element, index) => {
      formdata.push({
        day: element.id,
        available: element.from && element.to ? element.isSelected : false,
        from: element.isSelected
          ? moment(element.from, "hh:mm A").format("HH:mm")
          : "",
        to: element.isSelected
          ? moment(element.to, "hh:mm A").format("HH:mm")
          : "",
      });
    });

    setLoading(true);

    const resp = await apiRequest._updateStudentAvailability(
      studentInfo.userID,
      { availability: formdata }
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
      <Row>
        <Col md="12" sm="12">
          <div className="card">
            <div className="card-body">
              <FormGroup className="form-group timesetting_div">
                {availabilityData.map((item, index) => (
                  <FormGroup check key={item.id}>
                    <Input
                      type="checkbox"
                      value={item.id}
                      checked={item.isSelected}
                      onChange={(evt) => {
                        let oldAvailability = [...availabilityData];
                        oldAvailability[index].isSelected =
                          !oldAvailability[index].isSelected;
                        setAvailabilityData(oldAvailability);
                      }}
                    />
                    <Label check>
                      <span className="day_badge">{item.day}</span>
                      From
                      <Input
                        name="time"
                        placeholder=""
                        type="time"
                        value={item.from}
                        onChange={(evt) => {
                          let oldAvailability = [...availabilityData];
                          if (oldAvailability[index].to != "") {
                            if (
                              oldAvailability[index].to.split(":")[0] <
                                evt.target.value.split(":")[0] ||
                              oldAvailability[index].to.split(":")[0] ==
                                evt.target.value.split(":")[0]
                            ) {
                              toast.error(
                                "Should be gap of at least 1 hour between from and to time."
                              );
                              return false;
                            }
                            oldAvailability[index].from = evt.target.value;
                          } else {
                            oldAvailability[index].from = evt.target.value;
                          }
                          setAvailabilityData(oldAvailability);
                        }}
                      />
                      To
                      <Input
                        name="time"
                        placeholder=""
                        type="time"
                        value={item.to}
                        onChange={(evt) => {
                          let oldAvailability = [...availabilityData];

                          if (oldAvailability[index].from == "") {
                            toast.error("Please select from time first.");
                            return false;
                          }

                          if (
                            oldAvailability[index].from.split(":")[0] >
                              evt.target.value.split(":")[0] ||
                            oldAvailability[index].from.split(":")[0] ==
                              evt.target.value.split(":")[0]
                          ) {
                            toast.error(
                              "Should be gap of at least 1 hour between from and to time."
                            );
                            return false;
                          }

                          oldAvailability[index].to = evt.target.value;
                          setAvailabilityData(oldAvailability);
                        }}
                      />
                    </Label>
                  </FormGroup>
                ))}
              </FormGroup>

              <Button.Ripple
                className="minwidth133 btnprimary mt-2"
                onClick={handleSubmit}
                color="primary"
              >
                Update
              </Button.Ripple>
            </div>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default Availability;
