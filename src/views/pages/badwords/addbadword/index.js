import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";

import LoadingContext from "../../../../utility/context/LoadingContext";
import Papa from "papaparse";
import { XCircle } from "react-feather";
import { apiRequest } from "../../../../utility/apiRequest";
import toast from "react-hot-toast";

// const csvFile = require();

const internalStyle = {
  inputStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    opacity: 0,
  },
  buttonStyle: {
    position: "relative",
    overflow: "hidden",
  },
};

const Addgrade = () => {
  const navigate = useNavigate();
  const { setLoading } = useContext(LoadingContext);
  const [title, setTitle] = useState("");
  const [badWrods, setBadWards] = useState([]);

  const handleAddWord = async (e) => {
    e.preventDefault();

    if (badWrods.length < 1) {
      toast.error("You must fill the word.");
      return false;
    }

    setLoading(true);

    let payload = {
      names: badWrods,
    };

    const resp = await apiRequest._addBadWord(payload);
    setLoading(false);

    if (resp.status) {
      toast.success(resp.message);
      navigate(-1);
    } else {
      toast.error(resp.message);
    }
  };

  const addWord = async () => {
    const oldWords = [...badWrods];
    oldWords.push(title);
    setBadWards(oldWords);
    setTitle("");
  };

  const removeWord = async (index) => {
    const oldWords = [...badWrods];
    oldWords.splice(index, 1);

    setBadWards(oldWords);
  };
  return (
    <React.Fragment>
      <Row className="mb-2">
        <Col xl="6" md="6">
          <h4 className="card-title mb-1 headingcard">Add Bad Word</h4>
        </Col>
        <Col xl="6" md="6" className="text-end">
          <Button style={internalStyle.buttonStyle} className="btn-add me-2">
            <input
              type="file"
              accept=".csv"
              style={internalStyle.inputStyle}
              onChange={(e) => {
                // Handle file selection
                const file = e.target.files[0];
                // Process the selected file
                // console.log(file);

                Papa.parse(file, {
                  header: true,
                  complete: (results) => {
                    console.log(results);
                    let data = [];

                    results?.data.forEach((element, index) => {
                      data.push(element.bad_words);
                    });
                    setBadWards(data);
                  },
                });
              }}
            />
            Import CSV
          </Button>

          <Link to="/pages/badwords">
            <Button className="btn-add">Back</Button>
          </Link>
        </Col>
      </Row>
      <Row>
        <Col sm="12">
          <div className="card">
            <div className="card-body">
              <Row>
                <Col md="12" sm="12">
                  <FormGroup className="form-group">
                    <Label className="form-label" htmlFor="Title">
                      Title
                    </Label>
                    <Input
                      type="text"
                      id="title"
                      name="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Title"
                      onKeyUp={(e) => e.key === " " && addWord()}
                    />
                  </FormGroup>
                </Col>
                <p
                  style={{
                    marginTop: 10,
                    fontSize: 14,
                    fontWeight: 300,
                    color: "#000",
                  }}
                >
                  <strong>Note : </strong>
                  To add multiple words, simply press space after each word and
                  please do not duplicate the words.
                </p>
                <p
                  style={{
                    marginTop: 0,
                    fontSize: 14,
                    fontWeight: 300,
                    color: "#000",
                  }}
                >
                  <strong>Note : </strong>
                  <a
                    href="http://3.91.192.145:3001/uploads/static/bad_words_sample.csv"
                    download={true}
                    style={{ color: "#FF6020", fontWeight: "600" }}
                  >
                    Download CSV Sample
                  </a>
                </p>

                <Col md={12} className="tagWrapper">
                  {badWrods.map((item, index) => (
                    <h6 className="tagContainer" key={index}>
                      {item}
                      <span onClick={() => removeWord(index)}>
                        <XCircle size={16} />
                      </span>
                    </h6>
                  ))}
                </Col>

                <Col className="d-flex flex-sm-row flex-column mt-2 " sm="12">
                  <Button.Ripple
                    className="minwidth133 btnprimary"
                    onClick={handleAddWord}
                    color="primary"
                  >
                    Save
                  </Button.Ripple>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default Addgrade;
