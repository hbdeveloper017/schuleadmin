import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import LoadingContext from "../../../../utility/context/LoadingContext";
import { apiRequest } from "../../../../utility/apiRequest";
import toast from "react-hot-toast";

const Editpage = () => {
  const navigate = useNavigate();
  const { cmsContent } = useLocation().state;
  const { setLoading } = useContext(LoadingContext);
  const [contentInfo, setContentInfo] = useState({
    page: cmsContent.page,
    title: cmsContent.title,
  });

  const [editorState, setEditorState] = useState();

  useEffect(() => {
    setEditorState(cmsContent.content);
  }, []);

  const handleContentUpdate = async () => {
    if (
      contentInfo.page == "" ||
      contentInfo.title == "" ||
      editorState == ""
    ) {
      toast.error("Please fill all the details.");
      return false;
    }

    setLoading(true);
    const payload = {
      page: contentInfo.page,
      title: contentInfo.title,
      content: editorState,
    };

    const resp = await apiRequest._updateCmsPages(cmsContent._id, payload);

    setLoading(false);

    if (resp.status) {
      toast.success(resp.message);
      navigate(-1);
    } else {
      toast.error(resp.message);
    }
  };

  return (
    <React.Fragment>
      <Row className="mb-2">
        <Col xl="6" md="6">
          <h4 className="card-title mb-1 headingcard">Edit Page</h4>
        </Col>
        <Col xl="6" md="6" className="text-end">
          <Button tag={Link} to="/pages/allpages" className="btn-add">
            Back
          </Button>
        </Col>
      </Row>
      <Row>
        <Col sm="12">
          <div className="card">
            <div className="card-body">
              <Form onSubmit={(e) => e.preventDefault()}>
                <Row>
                  <Col md="12" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label" htmlFor="title">
                        Title
                      </Label>
                      <Input
                        type="text"
                        id="title"
                        name="title"
                        value={contentInfo.title}
                        onChange={(e) =>
                          setContentInfo({
                            ...contentInfo,
                            title: e.target.value,
                          })
                        }
                        placeholder="Title"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="12" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label">Description</Label>

                      <CKEditor
                        editor={ClassicEditor}
                        data={editorState}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          setEditorState(data);
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col className="d-flex flex-sm-row flex-column mt-2 " sm="12">
                    <Button.Ripple
                      onClick={handleContentUpdate}
                      className="minwidth133 btnprimary"
                      type="submit"
                      color="primary"
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
export default Editpage;
