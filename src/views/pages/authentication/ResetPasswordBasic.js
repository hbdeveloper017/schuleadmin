// ** React Imports

import "@styles/react/pages/page-authentication.scss";

import {
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Form,
  Label,
  Row,
} from "reactstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import { ChevronLeft } from "react-feather";
import InputPassword from "@components/input-password-toggle";
import LoadingContext from "../../../utility/context/LoadingContext";
import { apiRequest } from "../../../utility/apiRequest";
import logo from "@src/assets/images/logo/logo-white.svg";
import toast from "react-hot-toast";

const ResetPasswordBasic = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setLoading } = useContext(LoadingContext);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async () => {
    if (newPassword.length < 7 || confirmPassword.length < 7) {
      toast.error("Password should be at least 8 character.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password should be same.");
      return false;
    }

    setLoading(true);
    let searchElm = await location.search.split("=");

    console.log(searchElm);

    const paylaod = {
      otp: searchElm[1].replace(/&email/g, ""),
      email: searchElm[2].replace(/&role/g, ""),
      role: searchElm[3],
      newPassword: newPassword,
      confirmPassword: confirmPassword,
    };

    const resp = await apiRequest._forgotPasswordVerifyReset(paylaod);
    setLoading(false);
    if (resp.status) {
      toast.success(resp.message);
      navigate("/login", { replace: true });
    } else {
      toast.error(resp.message);
    }
  };
  return (
    <div className="auth-wrapper auth-cover">
      <Row className="auth-inner m-0">
        <Col
          className="loginbg d-none d-lg-flex align-items-center p-5"
          lg="6"
          sm="12"
        >
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <img className="logologin" src={logo} alt="logo" />
          </div>
        </Col>
        <Col
          className="loginform d-flex align-items-center auth-bg px-2 p-lg-5"
          lg="6"
          sm="12"
        >
          <Col className="px-xl-2 mx-auto" sm="12" md="12" lg="12">
            <CardTitle tag="h4" className="loginhead mb-1">
              Reset Password 🔒
            </CardTitle>
            <CardText className="mb-2">
              Your new password must be different from previously used passwords
            </CardText>
            <Form
              className="auth-reset-password-form mt-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="mb-1">
                <Label className="form-label" for="new-password">
                  New Password
                </Label>
                <InputPassword
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                  className="input-group-merge"
                  id="new-password"
                  autoFocus
                />
              </div>
              <div className="mb-1">
                <Label className="form-label" for="confirm-password">
                  Confirm Password
                </Label>
                <InputPassword
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-group-merge"
                  id="confirm-password"
                />
              </div>
              <Link onClick={handleSubmit}>
                <Button className="login_btn mt-3" color="primary" block>
                  Set New Password
                </Button>
              </Link>
            </Form>
            <p className="text-center mt-2">
              <Link to="/login">
                <ChevronLeft className="rotate-rtl me-25" size={14} />
                <span className="align-middle">Back to Login.</span>
              </Link>
            </p>
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default ResetPasswordBasic;
