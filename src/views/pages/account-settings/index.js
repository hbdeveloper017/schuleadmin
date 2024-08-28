// ** React Imports

import { API_BASE_URL, apiRequest } from "../../../utility/apiRequest";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { Camera, Edit, X } from "react-feather";
import React, { useContext, useEffect, useState } from "react";

import Avatar from "@components/avatar";
import { Link } from "react-router-dom";
import LoadingContext from "../../../utility/context/LoadingContext";
import avatar1 from "@src/assets/images/portrait/small/avatar-s-11.jpg";
import { isUserLoggedIn } from "@utils";
import toast from "react-hot-toast";

const AccountSettings = () => {
  const { setLoading } = useContext(LoadingContext);
  const [userInfo, setUserInfo] = useState({});
  const [adminInfo, setAdminInfo] = useState({
    name: "",
    email: "",
    profileImage: "",
    showProfile: "",
    companyName: "",
  });
  const [password, setPassword] = useState({
    old: "",
    new: "",
    confirm: "",
  });

  useEffect(() => {
    const ud = isUserLoggedIn();
    setUserInfo(JSON.parse(ud));
    setAdminInfo({
      name: JSON.parse(ud).fullName,
      email: JSON.parse(ud).email,
      companyName: JSON.parse(ud).companyName,
      profileImage: JSON.parse(ud).profileImage,
      showProfile: API_BASE_URL + "/" + JSON.parse(ud).profileImage,
    });
  }, []);

  const handleProfileEdit = async (profile) => {
    setLoading(true);
    const formdata = new FormData();
    formdata.append("email", adminInfo.email);
    formdata.append("fullName", adminInfo.name);
    formdata.append("companyName", adminInfo.companyName);
    formdata.append("profileImage", profile ? profile : adminInfo.profileImage);

    const resp = await apiRequest._editProfile(formdata);
    console.log(resp.data);
    setLoading(false);
    if (resp.status) {
      let oldData = userInfo;
      oldData.email = resp.data.email;
      oldData.fullName = resp.data.fullName;
      oldData.profileImage = resp.data.profileImage;
      oldData.companyName = resp.data.companyName;

      localStorage.setItem("userData", JSON.stringify(oldData));
      toast.success(resp.message);

      window.dispatchEvent(new Event("userDataChange"));
    } else {
      toast.error(resp.message);
    }
  };

  const handlePasswordUpdate = async () => {
    console.log(password);
    if (password.old == "" || password.new == "" || password.confirm == "") {
      toast.error("Please fill the password");
      return false;
    }
    if (password.new !== password.confirm) {
      toast.error("Confirm password shuld same as new password");
      return false;
    }
    setLoading(true);
    const paylaod = {
      currentPassword: password.old,
      newPassword: password.new,
      confirmPassword: password.confirm,
    };

    const resp = await apiRequest._editPassword(paylaod);
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
        <Col sm="4">
          <div className="user-avatar-section d-flex flex-column align-items-center justify-content-center">
            <div className="d-flex flex-column mb-1 align-items-center justify-content-center">
              <Avatar
                className="useravatar1"
                img={adminInfo?.showProfile ? adminInfo.showProfile : avatar1}
              />
            </div>
            <Button.Ripple
              id="change-img"
              tag={Label}
              outline
              className="mb-0"
              color="primary"
            >
              <span className="d-none d-sm-block">Update Picture</span>
              <span className="d-block d-sm-none">
                <Edit size={14} />
              </span>
              <input
                type="file"
                hidden
                id="change-img"
                accept="image/*"
                onChange={(e) => {
                  setAdminInfo({
                    ...adminInfo,
                    profileImage: e.target.files[0],
                    showProfile: URL.createObjectURL(e.target.files[0]),
                  });
                  setTimeout(() => {
                    handleProfileEdit(e.target.files[0]);
                  }, 400);
                }}
              />
            </Button.Ripple>
          </div>
        </Col>
        <Col sm="8">
          <div className="card">
            <div className="card-body">
              <Form onSubmit={(e) => e.preventDefault()}>
                <h4 className="card-title mb-1 headingcard">Basic Info</h4>
                <Row>
                  <Col md="6" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label" for="fname">
                        Full Name
                      </Label>
                      <Input
                        type="text"
                        id="fname"
                        name="fname"
                        value={adminInfo.name}
                        onChange={(e) =>
                          setAdminInfo({ ...adminInfo, name: e.target.value })
                        }
                        placeholder="Full Name"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label" for="email">
                        Email
                      </Label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={adminInfo.email}
                        onChange={(e) =>
                          setAdminInfo({ ...adminInfo, email: e.target.value })
                        }
                        placeholder="Email"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="12" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label" for="email">
                        Company Name
                      </Label>
                      <Input
                        type="company"
                        id="company"
                        name="text"
                        value={adminInfo.companyName}
                        onChange={(e) =>
                          setAdminInfo({
                            ...adminInfo,
                            companyName: e.target.value,
                          })
                        }
                        placeholder="Company Name"
                      />
                    </FormGroup>
                  </Col>
                  <Col className="d-flex flex-sm-row flex-column mt-2 " sm="12">
                    <Button.Ripple
                      onClick={handleProfileEdit}
                      className="minwidth133 btnprimary"
                      type="button"
                      color="primary"
                    >
                      Update
                    </Button.Ripple>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-1 headingcard">Change Password</h4>
              <Form onSubmit={(e) => e.preventDefault()}>
                <Row>
                  <Col md="12" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label" for="password">
                        Current Password
                      </Label>
                      <Input
                        type="text"
                        id="oldpassword"
                        name="oldpassword"
                        value={password.old}
                        onChange={(e) =>
                          setPassword({ ...password, old: e.target.value })
                        }
                        placeholder="Current Password"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label" for="password">
                        New Password
                      </Label>
                      <Input
                        type="text"
                        id="password"
                        name="password"
                        value={password.new}
                        onChange={(e) =>
                          setPassword({ ...password, new: e.target.value })
                        }
                        placeholder="New Password"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6" sm="12">
                    <FormGroup className="form-group">
                      <Label className="form-label" for="confirmpassword">
                        Confirm Password
                      </Label>
                      <Input
                        type="text"
                        id="confirmpassword"
                        name="confirmpassword"
                        value={password.confirm}
                        onChange={(e) =>
                          setPassword({ ...password, confirm: e.target.value })
                        }
                        placeholder="Confirm Password"
                      />
                    </FormGroup>
                  </Col>
                  <Col className="d-flex flex-sm-row flex-column mt-2 " sm="12">
                    <Button.Ripple
                      className="minwidth133 btnprimary"
                      type="button"
                      color="primary"
                      onClick={handlePasswordUpdate}
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
export default AccountSettings;
